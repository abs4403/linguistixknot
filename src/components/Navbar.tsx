import { Link, NavLink, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Flame, Gem, Menu, X } from "lucide-react";
import { user } from "@/lib/mock-data";
import { useState } from "react";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/lessons", label: "Lessons" },
  { to: "/chat", label: "AI Tutor" },
  { to: "/leaderboard", label: "Leaderboard" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const onLanding = pathname === "/";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
                  isActive ? "bg-accent text-navy" : "text-muted-foreground hover:text-navy hover:bg-muted"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {!onLanding && (
            <div className="hidden sm:flex items-center gap-3 mr-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 text-orange-600 text-sm font-semibold">
                <Flame className="w-4 h-4 fill-orange-500" />
                {user.streak}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-mint/10 text-teal text-sm font-semibold">
                <Gem className="w-4 h-4" />
                {user.gems}
              </div>
            </div>
          )}
          {onLanding ? (
            <>
              <Button variant="ghost" asChild className="hidden sm:inline-flex">
                <Link to="/dashboard">Log in</Link>
              </Button>
              <Button variant="hero" asChild>
                <Link to="/dashboard">Get started</Link>
              </Button>
            </>
          ) : (
            <div className="hidden sm:flex w-9 h-9 rounded-full bg-gradient-brand text-white items-center justify-center font-semibold text-sm">
              AR
            </div>
          )}
          <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container py-3 flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-lg text-sm font-medium ${
                    isActive ? "bg-accent text-navy" : "text-muted-foreground"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
