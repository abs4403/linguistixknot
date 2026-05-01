import { Logo } from "./Logo";

export const Footer = () => (
  <footer className="border-t border-border bg-muted/30 mt-16">
    <div className="container py-10 grid gap-8 md:grid-cols-4">
      <div className="space-y-3">
        <Logo />
        <p className="text-sm text-muted-foreground max-w-xs">
          The friendly hub for learning languages with AI tutors, gamified lessons, and a global community.
        </p>
      </div>
      {[
        { title: "Learn", items: ["Languages", "Lessons", "AI Tutor", "Flashcards"] },
        { title: "Community", items: ["Leaderboard", "Study Groups", "Live Tutors", "Exchange"] },
        { title: "Company", items: ["About", "Pricing", "Blog", "Contact"] },
      ].map((col) => (
        <div key={col.title}>
          <h4 className="font-display font-semibold text-navy mb-3">{col.title}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {col.items.map((i) => (
              <li key={i} className="hover:text-teal cursor-pointer transition-smooth">{i}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} LLHub. Made with 💚 for language learners worldwide.
    </div>
  </footer>
);
