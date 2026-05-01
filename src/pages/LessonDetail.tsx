import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { findLessonById } from "@/lib/language-content";
import {
  ArrowLeft, Check, Mic, MicOff, RotateCw, Volume2, X, Sparkles,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  speak, stopSpeaking, listenOnce, scoreSimilarity, isSttSupported, isTtsSupported,
} from "@/lib/speech";
import { toast } from "sonner";

type Mode = "flashcard" | "speak";

const LessonDetail = () => {
  const { id } = useParams();
  const found = findLessonById(id ?? "");
  const lesson = found?.lesson;
  const pack = found?.pack;

  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  const [mode, setMode] = useState<Mode>("flashcard");

  // Speaking practice state
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState<string>("");
  const [score, setScore] = useState<number | null>(null);
  const autoPlayed = useRef<string | null>(null);

  if (!lesson || !pack) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="font-display text-2xl font-bold text-navy">Lesson not found</h1>
          <Button variant="mint" asChild className="mt-4">
            <Link to="/lessons">Back to lessons</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const card = lesson.cards[idx];
  const progress = (idx / lesson.cards.length) * 100;

  // Auto-play pronunciation when a new card appears
  useEffect(() => {
    if (done) return;
    const key = `${lesson.id}-${idx}-${mode}`;
    if (autoPlayed.current !== key && isTtsSupported()) {
      autoPlayed.current = key;
      const t = setTimeout(() => speak(card.front, pack.locale), 250);
      return () => clearTimeout(t);
    }
  }, [idx, mode, done, card.front, pack.locale, lesson.id]);

  useEffect(() => () => stopSpeaking(), []);

  const reset = () => {
    setHeard("");
    setScore(null);
    setListening(false);
  };

  const next = () => {
    reset();
    setFlipped(false);
    if (idx + 1 >= lesson.cards.length) setDone(true);
    else setIdx(idx + 1);
  };

  const handleListen = async () => {
    if (!isSttSupported()) {
      toast.error("Speech recognition isn't supported in this browser. Try Chrome or Edge.");
      return;
    }
    setListening(true);
    setHeard("");
    setScore(null);
    try {
      stopSpeaking();
      const r = await listenOnce(pack.locale);
      const s = scoreSimilarity(card.front, r.transcript);
      setHeard(r.transcript);
      setScore(s);
      if (s >= 80) toast.success(`Great pronunciation! ${s}%`);
      else if (s >= 50) toast(`Close! ${s}% — try again`);
      else toast.error(`${s}% — listen and try again`);
    } catch (e: any) {
      toast.error(e.message || "Couldn't hear you, try again");
    } finally {
      setListening(false);
    }
  };

  return (
    <Layout>
      <div className="container py-8 max-w-3xl">
        <Link to="/lessons" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-navy mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to lessons
        </Link>

        <div className="flex items-start justify-between mb-2 gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-2xl">{pack.flag}</span>
              <span className="text-xs px-2 py-1 rounded-md bg-mint/20 text-teal font-semibold">{lesson.level}</span>
              <span className="text-xs px-2 py-1 rounded-md bg-accent text-navy font-medium">{lesson.module}</span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-navy mt-2">{lesson.title}</h1>
            <p className="text-sm text-muted-foreground">{pack.name} · {lesson.cards.length} cards</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xs text-muted-foreground">+{lesson.xp} XP</div>
            <div className="text-xs text-muted-foreground">{lesson.duration} min</div>
          </div>
        </div>

        {/* Mode tabs */}
        {!done && (
          <div className="inline-flex p-1 rounded-xl bg-muted mt-4 mb-4">
            {([
              { k: "flashcard", label: "Flashcards", icon: RotateCw },
              { k: "speak", label: "Pronunciation", icon: Mic },
            ] as { k: Mode; label: string; icon: any }[]).map((t) => (
              <button
                key={t.k}
                onClick={() => { setMode(t.k); reset(); setFlipped(false); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
                  mode === t.k ? "bg-white text-navy shadow-soft" : "text-muted-foreground hover:text-navy"
                }`}
              >
                <t.icon className="w-4 h-4" /> {t.label}
              </button>
            ))}
          </div>
        )}

        <Progress value={done ? 100 : progress} className="h-2 mb-6" />

        {!done ? (
          <>
            <div className="text-center text-sm text-muted-foreground mb-4">
              Card {idx + 1} of {lesson.cards.length}
            </div>

            {mode === "flashcard" ? (
              <>
                <Card
                  onClick={() => setFlipped(!flipped)}
                  className="aspect-[3/2] flex flex-col items-center justify-center p-8 cursor-pointer bg-gradient-card hover:shadow-card transition-smooth select-none relative"
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); speak(card.front, pack.locale); }}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-mint/20 flex items-center justify-center text-teal hover:bg-mint/30"
                    aria-label="Play pronunciation"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>

                  {!flipped ? (
                    <>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">{pack.flag} {pack.name}</div>
                      <div className="font-display text-4xl md:text-5xl font-bold text-navy text-center break-words">{card.front}</div>
                      {card.pronunciation && (
                        <div className="text-sm text-teal italic mt-3">/{card.pronunciation}/</div>
                      )}
                      <div className="text-sm text-muted-foreground mt-6 flex items-center gap-1">
                        <RotateCw className="w-3 h-3" /> Tap to reveal
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">🇬🇧 English</div>
                      <div className="font-display text-3xl md:text-4xl font-bold text-teal text-center">{card.back}</div>
                      <div className="mt-6 text-sm text-navy italic text-center max-w-md">"{card.example}"</div>
                      {card.exampleEn && (
                        <div className="text-xs text-muted-foreground mt-2 text-center max-w-md">{card.exampleEn}</div>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); speak(card.example, pack.locale, { rate: 0.85 }); }}
                        className="mt-3 text-xs flex items-center gap-1 text-teal hover:text-navy"
                      >
                        <Volume2 className="w-3.5 h-3.5" /> Hear example
                      </button>
                    </>
                  )}
                </Card>

                {flipped && (
                  <div className="grid grid-cols-2 gap-3 mt-6 animate-fade-in">
                    <Button variant="outline" size="lg" onClick={next}
                      className="border-destructive/40 text-destructive hover:bg-destructive/10">
                      <X /> Didn't know
                    </Button>
                    <Button variant="mint" size="lg" onClick={next}>
                      <Check /> Got it!
                    </Button>
                  </div>
                )}
              </>
            ) : (
              /* SPEAK MODE */
              <Card className="p-8 bg-gradient-card">
                <div className="text-center">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    Say this in {pack.name}
                  </div>
                  <div className="font-display text-3xl md:text-4xl font-bold text-navy break-words">
                    {card.front}
                  </div>
                  {card.pronunciation && (
                    <div className="text-sm text-teal italic mt-2">/{card.pronunciation}/</div>
                  )}
                  <div className="text-sm text-muted-foreground mt-2">{card.back}</div>

                  <div className="flex items-center justify-center gap-3 mt-6">
                    <Button variant="outline" size="lg" onClick={() => speak(card.front, pack.locale)}>
                      <Volume2 /> Listen
                    </Button>
                    <Button
                      variant={listening ? "destructive" : "hero"}
                      size="lg"
                      onClick={handleListen}
                      disabled={listening}
                      className={listening ? "animate-pulse-glow" : ""}
                    >
                      {listening ? <><MicOff /> Listening...</> : <><Mic /> Speak now</>}
                    </Button>
                  </div>

                  {heard && (
                    <div className="mt-6 animate-fade-in">
                      <div className="text-xs text-muted-foreground mb-1">We heard:</div>
                      <div className="font-display text-lg text-navy">"{heard}"</div>
                      {score !== null && (
                        <div className="mt-4 max-w-sm mx-auto">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Pronunciation score</span>
                            <span className={`font-bold ${
                              score >= 80 ? "text-teal" : score >= 50 ? "text-orange-500" : "text-destructive"
                            }`}>{score}%</span>
                          </div>
                          <Progress value={score} className="h-2" />
                          <div className="mt-3 text-sm">
                            {score >= 80 && <span className="text-teal flex items-center justify-center gap-1"><Sparkles className="w-4 h-4" /> Excellent!</span>}
                            {score >= 50 && score < 80 && <span className="text-orange-500">Close — try once more.</span>}
                            {score < 50 && <span className="text-destructive">Listen carefully and try again.</span>}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 mt-8">
                    <Button variant="outline" size="lg" onClick={next}>Skip</Button>
                    <Button variant="mint" size="lg" onClick={next} disabled={score === null || score < 50}>
                      <Check /> Next
                    </Button>
                  </div>

                  {!isSttSupported() && (
                    <p className="text-xs text-muted-foreground mt-6">
                      💡 Speech recognition needs Chrome or Edge to work.
                    </p>
                  )}
                </div>
              </Card>
            )}
          </>
        ) : (
          <Card className="p-10 text-center bg-gradient-brand text-white shadow-brand animate-fade-in">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="font-display text-3xl font-extrabold">Lesson complete!</h2>
            <p className="mt-2 text-white/90">You earned <strong>+{lesson.xp} XP</strong> and <strong>+5 💎</strong></p>
            <div className="flex flex-wrap gap-3 justify-center mt-6">
              <Button variant="mint" size="lg" asChild>
                <Link to="/lessons">More lessons</Link>
              </Button>
              <Button variant="outline" size="lg"
                onClick={() => { setIdx(0); setFlipped(false); setDone(false); reset(); }}
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
