import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import {
  getProfile, getProgress, getRecentCompletions, getWeeklyXpByDay,
  xpForLevel, type Profile, type Progress,
} from "@/lib/progress";
import { supabase } from "@/integrations/supabase/client";
import { languagePacks } from "@/lib/language-content";
import { skillBreakdown, achievements } from "@/lib/mock-data";
import { ArrowRight, Flame, Gem, Loader2, Target, Trophy, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar,
  BarChart, Bar, XAxis, Tooltip, CartesianGrid,
} from "recharts";

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [weekly, setWeekly] = useState<{ day: string; xp: number }[]>([]);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    if (!user) return;
    const [p, pr, wk, rc] = await Promise.all([
      getProfile(user.id), getProgress(user.id),
      getWeeklyXpByDay(user.id), getRecentCompletions(user.id, 4),
    ]);
    setProfile(p); setProgress(pr); setWeekly(wk); setRecent(rc);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
    if (!user) return;
    const channel = supabase.channel(`dash-${user.id}`)
      .on("postgres_changes",
        { event: "*", schema: "public", table: "user_progress", filter: `user_id=eq.${user.id}` },
        () => refresh())
      .on("postgres_changes",
        { event: "INSERT", schema: "public", table: "lesson_completions", filter: `user_id=eq.${user.id}` },
        () => refresh())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (loading || !profile || !progress) {
    return <Layout><div className="container py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-teal" /></div></Layout>;
  }

  const pack = languagePacks[profile.current_language] ?? languagePacks.es;
  const xpNeeded = xpForLevel(progress.level);
  const dailyGoal = 50;
  const todayXp = weekly[(new Date().getDay() + 6) % 7]?.xp ?? 0;
  const earnedAchievements = Math.min(achievements.length,
    [progress.streak_days >= 7, progress.xp >= 100, progress.xp >= 500, recent.length >= 5].filter(Boolean).length);

  return (
    <Layout>
      <div className="container py-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-muted-foreground">Welcome back,</p>
            <h1 className="font-display text-3xl font-bold text-navy">{profile.display_name} 👋</h1>
          </div>
          <Card className="px-5 py-3 flex items-center gap-4 bg-gradient-card">
            <div className="text-3xl">{pack.flag}</div>
            <div>
              <div className="text-xs text-muted-foreground">Currently learning</div>
              <div className="font-display font-semibold text-navy">{pack.name}</div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Flame} label="Day streak" value={progress.streak_days} color="orange" suffix="🔥" />
          <StatCard icon={Zap} label="Total XP" value={progress.xp.toLocaleString()} color="gold" />
          <StatCard icon={Gem} label="Gems" value={progress.gems} color="mint" />
          <StatCard icon={Trophy} label="Level" value={progress.level} color="teal" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="p-6 lg:col-span-2 bg-gradient-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-mint/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-teal" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-navy">Daily goal</h3>
                  <p className="text-sm text-muted-foreground">{todayXp} / {dailyGoal} XP today</p>
                </div>
              </div>
              <Button variant="mint" asChild>
                <Link to="/lessons">Continue <ArrowRight /></Link>
              </Button>
            </div>
            <ProgressBar value={Math.min(100, (todayXp / dailyGoal) * 100)} className="h-3" />
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Level {progress.level}</span>
                <span className="font-medium text-navy">XP this level: {progress.xp % xpNeeded} / {xpNeeded}</span>
              </div>
              <ProgressBar value={((progress.xp % xpNeeded) / xpNeeded) * 100} className="h-2" />
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-display font-bold text-navy mb-4">Skill breakdown</h3>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={skillBreakdown}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Radar dataKey="value" stroke="hsl(var(--teal))" fill="hsl(var(--mint))" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="p-6 lg:col-span-2">
            <h3 className="font-display font-bold text-navy mb-4">This week</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weekly}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip cursor={{ fill: "hsl(var(--accent))" }} contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
                <Bar dataKey="xp" fill="hsl(var(--teal))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-navy">Achievements</h3>
              <span className="text-xs text-muted-foreground">{earnedAchievements} / {achievements.length}</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {achievements.map((a, i) => {
                const earned = i < earnedAchievements;
                return (
                  <div key={a.id} className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 text-center ${
                    earned ? "bg-gradient-brand text-white shadow-mint" : "bg-muted text-muted-foreground opacity-60"
                  }`}>
                    <div className="text-2xl mb-1">{a.icon}</div>
                    <div className="text-[10px] font-medium leading-tight">{a.name}</div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-navy">Recent activity</h2>
            <Link to="/lessons" className="text-sm text-teal font-medium hover:underline">Browse lessons</Link>
          </div>
          {recent.length === 0 ? (
            <Card className="p-10 text-center">
              <p className="text-muted-foreground mb-4">No lessons completed yet — start your first one!</p>
              <Button variant="mint" asChild>
                <Link to="/lessons">Start learning <ArrowRight /></Link>
              </Button>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recent.map((r) => (
                <Card key={r.id} className="p-4">
                  <div className="text-xs text-muted-foreground mb-1">{new Date(r.completed_at).toLocaleDateString()}</div>
                  <div className="font-display font-semibold text-navy text-sm mb-2">{r.lesson_id}</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded bg-accent text-navy font-medium">{r.level}</span>
                    <span className="text-teal font-semibold">+{r.xp_earned} XP</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

const StatCard = ({ icon: Icon, label, value, color, suffix }: any) => {
  const colors: Record<string, string> = {
    orange: "bg-orange-50 text-orange-500",
    gold: "bg-yellow-50 text-yellow-600",
    mint: "bg-mint/15 text-teal",
    teal: "bg-teal/15 text-teal",
  };
  return (
    <Card className="p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="font-display text-2xl font-bold text-navy">{value} {suffix}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </Card>
  );
};

export default Dashboard;
