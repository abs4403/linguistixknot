import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { languages, cefrLevels, lessons } from "@/lib/mock-data";
import { CheckCircle2, Lock, PlayCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "react-router-dom";

const moduleColors: Record<string, string> = {
  Vocabulary: "bg-mint/20 text-teal",
  Grammar: "bg-teal/15 text-teal",
  Listening: "bg-blue-100 text-blue-700",
  Reading: "bg-purple-100 text-purple-700",
  Writing: "bg-orange-100 text-orange-700",
};

const Lessons = () => {
  const [lang, setLang] = useState("es");
  const [level, setLevel] = useState<string>("all");
  const [q, setQ] = useState("");

  const filtered = lessons.filter(l =>
    (level === "all" || l.level === level) &&
    l.title.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <Layout>
      <div className="container py-8 space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-navy">Lessons</h1>
          <p className="text-muted-foreground">Pick a language and dive in.</p>
        </div>

        {/* Languages */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
          {languages.map(l => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full border transition-smooth ${
                lang === l.code
                  ? "bg-navy text-white border-navy shadow-card"
                  : "bg-white border-border hover:border-teal"
              }`}
            >
              <span className="text-xl">{l.flag}</span>
              <span className="text-sm font-medium">{l.name}</span>
            </button>
          ))}
        </div>

        {/* Levels + search */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setLevel("all")}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-smooth ${
                level === "all" ? "bg-mint text-navy" : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >All</button>
            {cefrLevels.map(lv => (
              <button
                key={lv.code}
                onClick={() => setLevel(lv.code)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-smooth ${
                  level === lv.code ? "bg-mint text-navy" : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >{lv.code} · {lv.label}</button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search lessons..." className="pl-9" />
          </div>
        </div>

        {/* Lesson list */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((l, i) => {
            const locked = l.level === "C1" || l.level === "C2";
            return (
              <Card key={l.id} className={`p-5 transition-smooth ${locked ? "opacity-60" : "hover:shadow-card hover:-translate-y-1"}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs px-2 py-1 rounded-md font-medium ${moduleColors[l.module]}`}>{l.module}</span>
                  <span className="text-xs px-2 py-1 rounded-md bg-accent text-navy font-semibold">{l.level}</span>
                </div>
                <h3 className="font-display font-bold text-navy text-lg mb-2">{l.title}</h3>
                <Progress value={l.progress ?? 0} className="h-1.5 mb-4" />
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">+{l.xp} XP · {l.duration} min</div>
                  {locked ? (
                    <Button variant="ghost" size="sm" disabled><Lock className="w-4 h-4" /></Button>
                  ) : l.completed ? (
                    <Button variant="ghost" size="sm" className="text-teal" asChild>
                      <Link to={`/lesson/${l.id}`}><CheckCircle2 className="w-4 h-4" /> Review</Link>
                    </Button>
                  ) : (
                    <Button variant="mint" size="sm" asChild>
                      <Link to={`/lesson/${l.id}`}><PlayCircle className="w-4 h-4" /> Start</Link>
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Lessons;
