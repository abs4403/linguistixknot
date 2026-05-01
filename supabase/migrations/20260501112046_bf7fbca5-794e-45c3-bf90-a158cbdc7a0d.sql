
-- PROFILES
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Learner',
  current_language text not null default 'es',
  avatar_initials text not null default 'LL',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- USER PROGRESS
create table public.user_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  xp integer not null default 0,
  level integer not null default 1,
  gems integer not null default 0,
  streak_days integer not null default 0,
  last_activity_date date,
  weekly_xp integer not null default 0,
  week_start date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_progress enable row level security;

create policy "Progress is viewable by everyone"
  on public.user_progress for select using (true);

create policy "Users can insert own progress"
  on public.user_progress for insert with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.user_progress for update using (auth.uid() = user_id);

-- LESSON COMPLETIONS
create table public.lesson_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  language_code text not null,
  level text not null,
  module text not null,
  score integer not null default 0,
  xp_earned integer not null default 0,
  completed_at timestamptz not null default now()
);

alter table public.lesson_completions enable row level security;

create index lesson_completions_user_idx on public.lesson_completions(user_id, completed_at desc);

create policy "Completions are viewable by everyone"
  on public.lesson_completions for select using (true);

create policy "Users can record own completions"
  on public.lesson_completions for insert with check (auth.uid() = user_id);

-- TRIGGER: auto-create profile + progress on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_initials)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    upper(substr(coalesce(new.raw_user_meta_data ->> 'display_name', new.email), 1, 2))
  );
  insert into public.user_progress (user_id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at trigger
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

create trigger user_progress_touch before update on public.user_progress
  for each row execute function public.touch_updated_at();

-- Realtime
alter table public.user_progress replica identity full;
alter table public.lesson_completions replica identity full;
alter publication supabase_realtime add table public.user_progress;
alter publication supabase_realtime add table public.lesson_completions;
