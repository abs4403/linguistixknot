import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  ArrowRight, BookOpen, Brain, Globe2, MessageCircle,
  Mic, Sparkles, Trophy, Users, Zap,
} from "lucide-react";
import { languages, cefrLevels } from "@/lib/mock-data";
import heroImg from "@/assets/hero-llhub.jpg";

const Index = () => (
  <Layout>
    {/* Hero */}
    <section className="relative overflow-hidden bg-gradient-hero text-white">
      <div className="absolute inset-0 opacity-30 mix-blend-overlay">
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-mint/40 blur-3xl" />
        <div className="absolute top-40 -right-20 w-96 h-96 rounded-full bg-teal/40 blur-3xl" />
      </div>
      <div className="container relative grid lg:grid-cols-2 gap-12 py-20 lg:py-28 items-center">
        <div className="space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-sm">
            <Sparkles className="w-4 h-4 text-mint" />
            AI-powered language learning, reimagined
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-[1.05]">
            Speak any language, <span className="text-mint">faster than ever.</span>
          </h1>
          <p className="text-lg text-white/80 max-w-xl">
            Master 12+ languages with bite-sized lessons, an AI conversation tutor,
            spaced-repetition flashcards, and a global community cheering you on.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="mint" size="xl" asChild>
              <Link to="/dashboard">Start learning free <ArrowRight /></Link>
            </Button>
            <Button variant="outline" size="xl" asChild className="bg-white/5 border-white/30 text-white hover:bg-white/10 hover:text-white">
              <Link to="/install">📲 Install app</Link>
            </Button>
          </div>
          <div className="flex items-center gap-6 pt-4 text-sm text-white/70">
            <div className="flex -space-x-2">
              {["SM","KT","AO","LR"].map((i, idx) => (
                <div key={i} className="w-9 h-9 rounded-full bg-gradient-brand border-2 border-navy flex items-center justify-center text-xs font-semibold"
                  style={{ zIndex: 10 - idx }}>{i}</div>
              ))}
            </div>
            Joined by 2.4M+ learners worldwide
          </div>
        </div>
        <div className="relative">
          <img
            src={heroImg}
            alt="Language learning illustration with speech bubbles in different languages"
            width={1536} height={1024}
            className="rounded-3xl shadow-brand animate-float"
          />
          <Card className="absolute -bottom-6 -left-6 p-4 shadow-card hidden md:flex items-center gap-3 bg-white">
            <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-gold" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Daily streak</div>
              <div className="font-display font-bold text-navy">12 days 🔥</div>
            </div>
          </Card>
          <Card className="absolute -top-6 -right-6 p-4 shadow-card hidden md:flex items-center gap-3 bg-white">
            <div className="w-10 h-10 rounded-xl bg-mint/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-teal" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Today's XP</div>
              <div className="font-display font-bold text-navy">+240 XP</div>
            </div>
          </Card>
        </div>
      </div>
    </section>

    {/* Languages */}
    <section className="container py-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-navy">Choose from 12+ languages</h2>
        <p className="mt-3 text-muted-foreground">From A1 absolute beginner to C2 mastery — pick your journey.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {languages.map((l) => (
          <Card key={l.code} className="p-5 hover:shadow-card hover:-translate-y-1 transition-smooth cursor-pointer bg-gradient-card border-border/50">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{l.flag}</div>
              <div>
                <div className="font-display font-semibold text-navy">{l.name}</div>
                <div className="text-xs text-muted-foreground">{l.learners} learners</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-2 mt-8">
        {cefrLevels.map((lv) => (
          <span key={lv.code} className="px-3 py-1.5 rounded-full bg-accent text-navy text-sm font-medium">
            {lv.code} · {lv.label}
          </span>
        ))}
      </div>
    </section>

    {/* Features */}
    <section className="bg-muted/40 py-20">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-navy">Everything you need to fluency</h2>
          <p className="mt-3 text-muted-foreground">A complete toolkit, beautifully designed.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: BookOpen, title: "Interactive Lessons", desc: "Vocab, grammar, listening, reading & writing modules.", c: "mint" },
            { icon: MessageCircle, title: "AI Conversation Tutor", desc: "Chat in your target language anytime, anywhere.", c: "teal" },
            { icon: Mic, title: "Pronunciation Coach", desc: "Record your voice and get instant AI feedback.", c: "mint" },
            { icon: Brain, title: "Smart Flashcards", desc: "Spaced-repetition keeps words sticking forever.", c: "teal" },
            { icon: Trophy, title: "Streaks & Leaderboards", desc: "Earn XP, gems, badges. Compete weekly.", c: "mint" },
            { icon: Users, title: "Community & Tutors", desc: "Match with partners, join groups, book live classes.", c: "teal" },
          ].map((f) => (
            <Card key={f.title} className="p-6 bg-white border-border/50 hover:shadow-card transition-smooth">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                f.c === "mint" ? "bg-mint/15 text-teal" : "bg-teal/15 text-teal"
              }`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-navy text-lg mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="container py-20">
      <div className="relative rounded-3xl bg-gradient-hero p-10 md:p-16 text-white overflow-hidden">
        <Globe2 className="absolute -right-10 -bottom-10 w-72 h-72 opacity-10" />
        <div className="relative max-w-2xl">
          <h2 className="font-display text-3xl md:text-5xl font-extrabold leading-tight">
            Your fluency journey starts <span className="text-mint">today.</span>
          </h2>
          <p className="mt-4 text-white/80 text-lg">Free forever. No credit card. Just 5 minutes a day.</p>
          <Button variant="mint" size="xl" asChild className="mt-6">
            <Link to="/dashboard">Get started <ArrowRight /></Link>
          </Button>
        </div>
      </div>
    </section>
  </Layout>
);

export default Index;
