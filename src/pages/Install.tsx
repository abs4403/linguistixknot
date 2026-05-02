import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Apple, Download, Share, Smartphone, Plus, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const Install = () => {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const ua = window.navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream);
    const standalone = window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setInstalled(standalone);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => {
      setInstalled(true);
      toast.success("Linguistix installed! 🎉");
    });
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setDeferred(null);
  };

  return (
    <Layout>
      <section className="container py-16 max-w-3xl">
        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-brand items-center justify-center shadow-mint mx-auto">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-4xl font-extrabold text-navy">Install Linguistix</h1>
          <p className="text-muted-foreground">
            Add Linguistix to your home screen and learn like a native app — fullscreen, fast, and one tap away.
          </p>
        </div>

        {installed ? (
          <Card className="p-8 text-center space-y-3 bg-mint/5 border-mint/30">
            <CheckCircle2 className="w-12 h-12 text-teal mx-auto" />
            <h2 className="font-display text-2xl font-bold text-navy">You're all set!</h2>
            <p className="text-muted-foreground">Linguistix is installed. Open it from your home screen anytime.</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-navy font-display font-bold text-lg">
                <Smartphone className="w-5 h-5 text-teal" /> Android & Desktop
              </div>
              <p className="text-sm text-muted-foreground">
                Tap install below. If the button is disabled, open your browser menu and choose
                <strong> "Install app"</strong> or <strong>"Add to Home screen"</strong>.
              </p>
              <Button variant="hero" size="lg" onClick={install} disabled={!deferred} className="w-full">
                <Download /> {deferred ? "Install Linguistix" : "Use browser menu"}
              </Button>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-navy font-display font-bold text-lg">
                <Apple className="w-5 h-5 text-teal" /> iPhone & iPad {isIOS && "(detected)"}
              </div>
              <ol className="text-sm text-muted-foreground space-y-3">
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-mint/20 text-teal flex items-center justify-center font-bold text-xs shrink-0">1</span>
                  <span>Open this page in <strong>Safari</strong>.</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-mint/20 text-teal flex items-center justify-center font-bold text-xs shrink-0">2</span>
                  <span>Tap the <Share className="inline w-4 h-4" /> <strong>Share</strong> button.</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-mint/20 text-teal flex items-center justify-center font-bold text-xs shrink-0">3</span>
                  <span>Choose <Plus className="inline w-4 h-4" /> <strong>Add to Home Screen</strong>.</span>
                </li>
              </ol>
            </Card>
          </div>
        )}

        <div className="mt-10 grid sm:grid-cols-3 gap-4">
          {[
            { t: "Fullscreen", d: "No browser bars — feels like a real app." },
            { t: "Home-screen icon", d: "Launch with a single tap." },
            { t: "Always up to date", d: "Auto-updates whenever we ship new lessons." },
          ].map((f) => (
            <Card key={f.t} className="p-5">
              <div className="font-display font-bold text-navy">{f.t}</div>
              <div className="text-sm text-muted-foreground mt-1">{f.d}</div>
            </Card>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Install;
