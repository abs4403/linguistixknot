
-- 1. Lock down lesson_completions: owner-only SELECT
DROP POLICY IF EXISTS "Completions are viewable by everyone" ON public.lesson_completions;
CREATE POLICY "Users can view own completions"
  ON public.lesson_completions FOR SELECT
  USING (auth.uid() = user_id);

-- 2. Lock down user_progress: owner-only SELECT, remove direct UPDATE
DROP POLICY IF EXISTS "Progress is viewable by everyone" ON public.user_progress;
CREATE POLICY "Users can view own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;
-- Allow only updating profile-related fields if needed (none for now); writes go through SECURITY DEFINER fn.

-- 3. Public leaderboard view (only safe columns)
DROP VIEW IF EXISTS public.leaderboard;
CREATE VIEW public.leaderboard
WITH (security_invoker = true) AS
SELECT
  up.user_id,
  up.weekly_xp,
  up.level,
  up.xp AS total_xp,
  up.week_start,
  p.display_name,
  p.avatar_initials
FROM public.user_progress up
JOIN public.profiles p ON p.id = up.user_id
WHERE up.weekly_xp > 0
ORDER BY up.weekly_xp DESC
LIMIT 50;

-- The view inherits RLS from base tables. To make leaderboard public, add a permissive
-- SELECT policy scoped to the columns the view exposes via a helper function.
-- Simpler: provide a SECURITY DEFINER function that returns the leaderboard.
CREATE OR REPLACE FUNCTION public.get_leaderboard()
RETURNS TABLE (
  user_id uuid,
  display_name text,
  avatar_initials text,
  weekly_xp integer,
  level integer,
  total_xp integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT up.user_id, p.display_name, p.avatar_initials,
         up.weekly_xp, up.level, up.xp
  FROM public.user_progress up
  JOIN public.profiles p ON p.id = up.user_id
  WHERE up.weekly_xp > 0
  ORDER BY up.weekly_xp DESC
  LIMIT 50;
$$;

GRANT EXECUTE ON FUNCTION public.get_leaderboard() TO anon, authenticated;

-- 4. Server-side completion recorder (atomic + tamper-proof XP)
CREATE OR REPLACE FUNCTION public.record_completion(
  _lesson_id text,
  _language_code text,
  _level text,
  _module text,
  _xp integer,
  _score integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  cur public.user_progress%ROWTYPE;
  today date := CURRENT_DATE;
  monday date := (CURRENT_DATE - ((EXTRACT(DOW FROM CURRENT_DATE)::int + 6) % 7));
  yesterday date := CURRENT_DATE - 1;
  awarded_xp int;
  awarded_score int;
  new_streak int;
  new_xp int;
  new_level int;
  new_weekly int;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Clamp inputs server-side so clients can't inflate values
  awarded_xp := LEAST(GREATEST(COALESCE(_xp, 0), 0), 50);
  awarded_score := LEAST(GREATEST(COALESCE(_score, 0), 0), 100);

  INSERT INTO public.lesson_completions (
    user_id, lesson_id, language_code, level, module, xp_earned, score
  ) VALUES (uid, _lesson_id, _language_code, _level, _module, awarded_xp, awarded_score);

  SELECT * INTO cur FROM public.user_progress WHERE user_id = uid;
  IF NOT FOUND THEN
    INSERT INTO public.user_progress (user_id) VALUES (uid)
    RETURNING * INTO cur;
  END IF;

  -- Streak
  IF cur.last_activity_date IS NULL THEN
    new_streak := 1;
  ELSIF cur.last_activity_date = today THEN
    new_streak := cur.streak_days;
  ELSIF cur.last_activity_date = yesterday THEN
    new_streak := cur.streak_days + 1;
  ELSE
    new_streak := 1;
  END IF;

  -- Level: 200 + (level-1)*150 per level
  new_xp := cur.xp + awarded_xp;
  new_level := cur.level;
  WHILE new_xp >= (200 + (new_level - 1) * 150) LOOP
    new_xp := new_xp - (200 + (new_level - 1) * 150);
    new_level := new_level + 1;
  END LOOP;

  -- Weekly XP
  IF cur.week_start = monday THEN
    new_weekly := cur.weekly_xp + awarded_xp;
  ELSE
    new_weekly := awarded_xp;
  END IF;

  UPDATE public.user_progress SET
    xp = cur.xp + awarded_xp,
    level = new_level,
    gems = cur.gems + 5,
    streak_days = new_streak,
    last_activity_date = today,
    weekly_xp = new_weekly,
    week_start = monday,
    updated_at = now()
  WHERE user_id = uid;
END;
$$;

GRANT EXECUTE ON FUNCTION public.record_completion(text,text,text,text,integer,integer) TO authenticated;

-- 5. Realtime: ensure users only receive their own row events.
-- Realtime evaluates the SELECT RLS policy on the source table when broadcasting
-- postgres_changes payloads. Owner-only SELECT (added above) means subscribers
-- only receive their own rows.
