import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { leaderboard, achievements } from "@/lib/mock-data";
import { Crown, Medal, Trophy } from "lucide-react";

const rankIcon = (r: number) => {
  if (r === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
  if (r === 2) return <Medal className="w-5 h-5 text-gray-400" />;
  if (r === 3) return <Medal className="w-5 h-5 text-amber-700" />;
  return <span className="text-sm font-semibold text-muted-foreground">#{r}</span>;
};

const Leaderboard = () => (
  <Layout>
    <div className="container py-8 max-w-4xl space-y-8">
      <div className="text-center">
        <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-gold items-center justify-center mb-3 shadow-card">
          <Trophy className="w-7 h-7 text-white" />
        </div>
        <h1 className="font-display text-3xl font-bold text-navy">Weekly Leaderboard</h1>
        <p className="text-muted-foreground">Resets in 3 days · Top 3 win bonus gems 💎</p>
      </div>

      {/* Podium */}
      <div className="grid grid-cols-3 gap-4 items-end">
        {[leaderboard[1], leaderboard[0], leaderboard[2]].map((p, idx) => {
          const heights = ["h-32", "h-44", "h-24"];
          const colors = ["bg-gray-200", "bg-gradient-gold", "bg-amber-200"];
          return (
            <div key={p.rank} className="text-center">
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

      {/* Full list */}
      <Card className="overflow-hidden">
        {leaderboard.map((p) => (
          <div
            key={p.rank}
            className={`flex items-center gap-4 px-5 py-4 border-b border-border last:border-0 ${
              p.isYou ? "bg-mint/10" : "hover:bg-muted/50"
            }`}
          >
            <div className="w-8 flex justify-center">{rankIcon(p.rank)}</div>
            <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center text-white text-sm font-semibold">
              {p.avatar}
            </div>
            <div className="flex-1">
              <div className="font-medium text-navy flex items-center gap-2">
                {p.name} <span>{p.country}</span>
                {p.isYou && <span className="text-xs px-2 py-0.5 rounded-full bg-mint text-navy font-semibold">YOU</span>}
              </div>
            </div>
            <div className="text-right">
              <div className="font-display font-bold text-navy">{p.xp.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">XP</div>
            </div>
          </div>
        ))}
      </Card>

      {/* Achievements */}
      <div>
        <h2 className="font-display text-xl font-bold text-navy mb-4">Your achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {achievements.map(a => (
            <Card key={a.id} className={`p-5 flex items-center gap-4 ${a.earned ? "" : "opacity-60"}`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${
                a.earned ? "bg-gradient-brand shadow-mint" : "bg-muted"
              }`}>{a.icon}</div>
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

export default Leaderboard;
