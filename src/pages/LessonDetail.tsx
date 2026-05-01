import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { flashcards, lessons } from "@/lib/mock-data";
import { ArrowLeft, Check, RotateCw, Volume2, X } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";

const LessonDetail = () => {
  const { id } = useParams();
  const lesson = lessons.find(l => l.id === id) ?? lessons[0];
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);

  const card = flashcards[idx];
  const progress = ((idx) / flashcards.length) * 100;

  const next = (correct: boolean) => {
    if (idx + 1 >= flashcards.length) {
      setDone(true);
    } else {
      setIdx(idx + 1);
      setFlipped(false);
    }
  };

  return (
    <Layout>
      <div className="container py-8 max-w-3xl">
        <Link to="/lessons" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-navy mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to lessons
        </Link>

        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-xs px-2 py-1 rounded-md bg-mint/20 text-teal font-semibold">{lesson.level}</span>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-navy mt-2">{lesson.title}</h1>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">+{lesson.xp} XP</div>
            <div className="text-xs text-muted-foreground">{lesson.duration} min</div>
          </div>
        </div>

        <Progress value={done ? 100 : progress} className="h-2 mb-8" />

        {!done ? (
          <>
            <div className="text-center text-sm text-muted-foreground mb-4">
              Flashcard {idx + 1} of {flashcards.length}
            </div>

            <Card
              onClick={() => setFlipped(!flipped)}
              className="aspect-[3/2] flex flex-col items-center justify-center p-8 cursor-pointer bg-gradient-card hover:shadow-card transition-smooth select-none relative"
            >
              <button
                onClick={(e) => { e.stopPropagation(); }}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-mint/20 flex items-center justify-center text-teal hover:bg-mint/30"
              >
                <Volume2 className="w-5 h-5" />
              </button>

              {!flipped ? (
                <>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">🇪🇸 Spanish</div>
                  <div className="font-display text-5xl font-bold text-navy text-center">{card.front}</div>
                  <div className="text-sm text-muted-foreground mt-6 flex items-center gap-1">
                    <RotateCw className="w-3 h-3" /> Tap to reveal
                  </div>
                </>
              ) : (
                <>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">🇬🇧 English</div>
                  <div className="font-display text-4xl font-bold text-teal text-center">{card.back}</div>
                  <div className="mt-6 text-sm text-muted-foreground italic text-center max-w-md">"{card.example}"</div>
                </>
              )}
            </Card>

            {flipped && (
              <div className="grid grid-cols-2 gap-3 mt-6 animate-fade-in">
                <Button variant="outline" size="lg" onClick={() => next(false)} className="border-destructive/40 text-destructive hover:bg-destructive/10">
                  <X /> Didn't know
                </Button>
                <Button variant="mint" size="lg" onClick={() => next(true)}>
                  <Check /> Got it!
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card className="p-10 text-center bg-gradient-brand text-white shadow-brand animate-fade-in">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="font-display text-3xl font-extrabold">Lesson complete!</h2>
            <p className="mt-2 text-white/90">You earned <strong>+{lesson.xp} XP</strong> and <strong>+5 💎</strong></p>
            <div className="flex flex-wrap gap-3 justify-center mt-6">
              <Button variant="mint" size="lg" asChild>
                <Link to="/dashboard">Back to dashboard</Link>
              </Button>
              <Button variant="outline" size="lg" onClick={() => { setIdx(0); setFlipped(false); setDone(false); }}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white">
                Practice again
              </Button>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default LessonDetail;
