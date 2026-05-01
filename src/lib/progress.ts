import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  display_name: string;
  current_language: string;
  avatar_initials: string;
}

export interface Progress {
  user_id: string;
  xp: number;
  level: number;
  gems: number;
  streak_days: number;
  weekly_xp: number;
  week_start: string;
  last_activity_date: string | null;
}

export const xpForLevel = (level: number) => 200 + (level - 1) * 150;

const todayStr = () => new Date().toISOString().slice(0, 10);
const mondayStr = () => {
  const d = new Date();
  const day = (d.getDay() + 6) % 7; // 0 = Mon
  d.setDate(d.getDate() - day);
  return d.toISOString().slice(0, 10);
};

export const getProfile = async (userId: string): Promise<Profile | null> => {
  const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  return data;
};

export const getProgress = async (userId: string): Promise<Progress | null> => {
  const { data } = await supabase.from("user_progress").select("*").eq("user_id", userId).maybeSingle();
  return data as Progress | null;
};

export const updateLanguage = async (userId: string, code: string) => {
  await supabase.from("profiles").update({ current_language: code }).eq("id", userId);
};

export const updateDisplayName = async (userId: string, name: string) => {
  await supabase.from("profiles").update({
    display_name: name,
    avatar_initials: name.trim().slice(0, 2).toUpperCase() || "LL",
  }).eq("id", userId);
};

/** Apply XP + gems + streak + weekly_xp atomically (client-side compute, then update) */
export const recordCompletion = async (params: {
  userId: string;
  lessonId: string;
  languageCode: string;
  level: string;
  module: string;
  xp: number;
  score: number;
}) => {
  const { userId, lessonId, languageCode, level, module, xp, score } = params;

  // 1. Insert completion
  await supabase.from("lesson_completions").insert({
    user_id: userId, lesson_id: lessonId, language_code: languageCode,
    level, module, xp_earned: xp, score,
  });

  // 2. Update progress
  const current = await getProgress(userId);
  if (!current) return;

  const today = todayStr();
  const monday = mondayStr();
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().slice(0, 10);

  let streak = current.streak_days;
  if (current.last_activity_date !== today) {
    streak = current.last_activity_date === yStr ? streak + 1 : 1;
  }
  if (!current.last_activity_date) streak = 1;

  let newXp = current.xp + xp;
  let level_ = current.level;
  while (newXp >= xpForLevel(level_)) {
    newXp -= xpForLevel(level_);
    level_++;
  }

  const sameWeek = current.week_start === monday;
  const weekly = (sameWeek ? current.weekly_xp : 0) + xp;

  await supabase.from("user_progress").update({
    xp: current.xp + xp,
    level: level_,
    gems: current.gems + 5,
    streak_days: streak,
    last_activity_date: today,
    weekly_xp: weekly,
    week_start: monday,
  }).eq("user_id", userId);
};

export const getRecentCompletions = async (userId: string, limit = 10) => {
  const { data } = await supabase
    .from("lesson_completions")
    .select("*")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false })
    .limit(limit);
  return data ?? [];
};

export const getWeeklyXpByDay = async (userId: string) => {
  const monday = new Date(mondayStr());
  const { data } = await supabase
    .from("lesson_completions")
    .select("xp_earned, completed_at")
    .eq("user_id", userId)
    .gte("completed_at", monday.toISOString());

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const totals = days.map(d => ({ day: d, xp: 0 }));
  (data ?? []).forEach((row: any) => {
    const idx = (new Date(row.completed_at).getDay() + 6) % 7;
    totals[idx].xp += row.xp_earned;
  });
  return totals;
};

export const getLeaderboard = async () => {
  const { data } = await supabase
    .from("user_progress")
    .select("user_id, weekly_xp, xp, level")
    .order("weekly_xp", { ascending: false })
    .limit(20);

  if (!data?.length) return [];

  const ids = data.map(r => r.user_id);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_initials")
    .in("id", ids);

  const profileMap = new Map(profiles?.map(p => [p.id, p]) ?? []);
  return data.map((row, i) => ({
    rank: i + 1,
    user_id: row.user_id,
    name: profileMap.get(row.user_id)?.display_name ?? "Learner",
    avatar: profileMap.get(row.user_id)?.avatar_initials ?? "LL",
    xp: row.weekly_xp,
    totalXp: row.xp,
    level: row.level,
  }));
};
