import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { achievements } from "@/lib/mock-data";
import { getLeaderboard } from "@/lib/progress";
import { useAuth } from "@/contexts/AuthContext";
import { Crown, Loader2, Medal, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const rankIcon = (r: number) => {
  if (r === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
  if (r === 2) return <Medal className="w-5 h-5 text-gray-400" />;
  if (r === 3) return <Medal className="w-5 h-5 text-amber-700" />;
  return <span className="text-sm font-semibold text-muted-foreground">#{r}</span>;
};

const Leaderboard = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState<Awaited<ReturnType<typeof getLeaderboard>>>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const data = await getLeaderboard();
    setRows(data);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
    const channel = supabase.channel("leaderboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "user_progress" }, () => refresh())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const podium = [rows[1], rows[0], rows[2]].filter(Boolean);

  return (
    <Layout>
      <div className="container py-8 max-w-4xl space-y-8">
        <div className="text-center">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-gold items-center justify-center mb-3 shadow-card">
            <Trophy className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-navy">Weekly Leaderboard</h1>
          <p className="text-muted-foreground">Updates in real time as learners earn XP 💎</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-teal" /></div>
        ) : rows.length === 0 ? (
          <Card className="p-10 text-center">
            <p className="text-muted-foreground mb-4">No XP earned this week yet — be the first!</p>
            <Button variant="mint" asChild><Link to="/lessons">Start a lesson</Link></Button>
          </Card>
        ) : (
          <>
            {podium.length === 3 && (
              <div className="grid grid-cols-3 gap-4 items-end">
                {podium.map((p, idx) => {
                  const heights = ["h-32", "h-44", "h-24"];
                  const colors = ["bg-gray-200", "bg-gradient-gold", "bg-amber-200"];
                  return (
                    <div key={p.user_id} className="text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-brand mx-auto mb-2 flex items-center justify-center text-white font-bold shadow-mint">
                        {p.avatar}
                      </div>
                      <div className="font-display font-semibold text-navy text-sm truncate">{p.name}</div>
                      <div className="text-xs text-muted-foreground mb-2">{p.xp} XP</div>
                      <div className={`${heights[idx]} ${colors[idx]} rounded-t-2xl flex items-start justify-center pt-3 font-display font-extrabold text-white text-2xl`}>
                        {p.rank}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <Card className="overflow-hidden">
              {rows.map((p) => {
                const isYou = user?.id === p.user_id;
                return (
                  <div key={p.user_id} className={`flex items-center gap-4 px-5 py-4 border-b border-border last:border-0 ${
                    isYou ? "bg-mint/10" : "hover:bg-muted/50"
                  }`}>
                    <div className="w-8 flex justify-center">{rankIcon(p.rank)}</div>
                    <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center text-white text-sm font-semibold">
                      {p.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-navy flex items-center gap-2">
                        {p.name}
                        {isYou && <span className="text-xs px-2 py-0.5 rounded-full bg-mint text-navy font-semibold">YOU</span>}
                      </div>
                      <div className="text-xs text-muted-foreground">Level {p.level} · {p.totalXp.toLocaleString()} total XP</div>
                    </div>
                    <div className="text-right">
                      <div className="font-display font-bold text-navy">{p.xp.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">weekly XP</div>
                    </div>
                  </div>
                );
              })}
            </Card>
          </>
        )}

        <div>
          <h2 className="font-display text-xl font-bold text-navy mb-4">Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {achievements.map(a => (
              <Card key={a.id} className="p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-brand shadow-mint flex items-center justify-center text-3xl">{a.icon}</div>
                <div>
                  <div className="font-display font-semibold text-navy">{a.name}</div>
                  <div className="text-xs text-muted-foreground">{a.desc}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Leaderboard;
