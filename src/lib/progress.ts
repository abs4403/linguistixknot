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

/** Server-side atomic completion: validates and clamps XP via DB function. */
export const recordCompletion = async (params: {
  userId: string;
  lessonId: string;
  languageCode: string;
  level: string;
  module: string;
  xp: number;
  score: number;
}) => {
  const { lessonId, languageCode, level, module, xp, score } = params;
  const { error } = await supabase.rpc("record_completion", {
    _lesson_id: lessonId,
    _language_code: languageCode,
    _level: level,
    _module: module,
    _xp: xp,
    _score: score,
  });
  if (error) throw error;
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
  const { data, error } = await supabase.rpc("get_leaderboard");
  if (error || !data) return [];
  return (data as any[]).map((row, i) => ({
    rank: i + 1,
    user_id: row.user_id,
    name: row.display_name ?? "Learner",
    avatar: row.avatar_initials ?? "LL",
    xp: row.weekly_xp,
    totalXp: row.total_xp,
    level: row.level,
  }));
};

