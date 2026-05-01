import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { user, lessons, skillBreakdown, weeklyProgress, achievements } from "@/lib/mock-data";
import { Flame, Gem, Zap, Target, ArrowRight, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar,
  BarChart, Bar, XAxis, Tooltip, CartesianGrid,
} from "recharts";

const Dashboard = () => {
  const dailyGoal = 50;
  const todayXp = 30;
  const continueLessons = lessons.filter(l => !l.completed).slice(0, 3);

  return (
    <Layout>
      <div className="container py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-muted-foreground">Welcome back,</p>
            <h1 className="font-display text-3xl font-bold text-navy">{user.name} 👋</h1>
          </div>
          <Card className="px-5 py-3 flex items-center gap-4 bg-gradient-card">
            <div className="text-3xl">{user.flag}</div>
            <div>
              <div className="text-xs text-muted-foreground">Currently learning</div>
              <div className="font-display font-semibold text-navy">{user.language} · {user.cefr}</div>
            </div>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Flame} label="Day streak" value={user.streak} color="orange" suffix="🔥" />
          <StatCard icon={Zap} label="Total XP" value={user.xp.toLocaleString()} color="gold" />
          <StatCard icon={Gem} label="Gems" value={user.gems} color="mint" />
          <StatCard icon={Trophy} label="Level" value={user.level} color="teal" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Daily goal */}
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
            <Progress value={(todayXp / dailyGoal) * 100} className="h-3" />
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Level {user.level}</span>
                <span className="font-medium text-navy">{user.xp} / {user.xpToNext} XP</span>
              </div>
              <Progress value={(user.xp / user.xpToNext) * 100} className="h-2" />
            </div>
          </Card>

          {/* Skill breakdown */}
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
          {/* Weekly */}
          <Card className="p-6 lg:col-span-2">
            <h3 className="font-display font-bold text-navy mb-4">This week</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip cursor={{ fill: "hsl(var(--accent))" }} contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
                <Bar dataKey="xp" fill="hsl(var(--teal))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Achievements */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-navy">Achievements</h3>
              <span className="text-xs text-muted-foreground">3 / 6</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {achievements.map((a) => (
                <div key={a.id} className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 text-center ${
                  a.earned ? "bg-gradient-brand text-white shadow-mint" : "bg-muted text-muted-foreground opacity-60"
                }`}>
                  <div className="text-2xl mb-1">{a.icon}</div>
                  <div className="text-[10px] font-medium leading-tight">{a.name}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Continue learning */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-navy">Continue learning</h2>
            <Link to="/lessons" className="text-sm text-teal font-medium hover:underline">View all</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {continueLessons.map((l) => (
              <Card key={l.id} className="p-5 hover:shadow-card transition-smooth">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs px-2 py-1 rounded-md bg-accent text-navy font-medium">{l.module}</span>
                  <span className="text-xs px-2 py-1 rounded-md bg-mint/20 text-teal font-semibold">{l.level}</span>
                </div>
                <h4 className="font-display font-semibold text-navy mb-2">{l.title}</h4>
                <Progress value={l.progress ?? 0} className="h-1.5 mb-3" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>+{l.xp} XP · {l.duration} min</span>
                  <Link to={`/lesson/${l.id}`} className="text-teal font-medium">Resume →</Link>
                </div>
              </Card>
            ))}
          </div>
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
