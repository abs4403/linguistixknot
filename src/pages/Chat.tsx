import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles, Mic } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Msg { role: "user" | "ai"; content: string; translation?: string; }

const initial: Msg[] = [
  { role: "ai", content: "¡Hola! Soy Lucía, tu tutora de español. ¿Cómo estás hoy?", translation: "Hi! I'm Lucía, your Spanish tutor. How are you today?" },
];

const suggestions = [
  "Estoy bien, ¿y tú?",
  "Quiero practicar el pretérito",
  "Háblame del clima en Madrid",
];

const Chat = () => {
  const [messages, setMessages] = useState<Msg[]>(initial);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages(m => [...m, { role: "user", content: text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages(m => [...m, {
        role: "ai",
        content: "¡Perfecto! Vamos a practicar. Cuéntame, ¿qué hiciste ayer?",
        translation: "Perfect! Let's practice. Tell me, what did you do yesterday?",
      }]);
      setTyping(false);
    }, 1100);
  };

  return (
    <Layout>
      <div className="container py-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-brand flex items-center justify-center text-white shadow-mint">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-navy">AI Tutor — Lucía</h1>
            <p className="text-sm text-muted-foreground">Spanish · B1 · Conversation practice</p>
          </div>
        </div>

        <Card className="flex flex-col h-[60vh] overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  m.role === "user"
                    ? "bg-gradient-brand text-white rounded-br-sm shadow-mint"
                    : "bg-muted text-navy rounded-bl-sm"
                }`}>
                  <div className="font-medium">{m.content}</div>
                  {m.translation && (
                    <div className="text-xs mt-1.5 opacity-70 italic">{m.translation}</div>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                  {[0, 150, 300].map(d => (
                    <span key={d} className="w-2 h-2 rounded-full bg-teal animate-bounce" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-border p-3 bg-muted/30">
            <div className="flex flex-wrap gap-2 mb-3">
              {suggestions.map(s => (
                <button key={s} onClick={() => send(s)} className="text-xs px-3 py-1.5 rounded-full bg-white border border-border hover:border-teal hover:text-teal transition-smooth">
                  {s}
                </button>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
              <Button type="button" variant="ghost" size="icon" className="text-teal"><Mic className="w-5 h-5" /></Button>
              <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Escribe en español..." className="flex-1" />
              <Button type="submit" variant="mint" size="icon"><Send className="w-4 h-4" /></Button>
            </form>
          </div>
        </Card>

        <p className="text-xs text-muted-foreground text-center mt-4">
          💡 Connect Lovable AI to wire up real conversations with grammar feedback.
        </p>
      </div>
    </Layout>
  );
};

export default Chat;
