import { Globe2 } from "lucide-react";
import { Link } from "react-router-dom";

export const Logo = ({ variant = "dark" }: { variant?: "dark" | "light" }) => {
  const text = variant === "light" ? "text-white" : "text-navy";
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className="relative">
        <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center shadow-mint group-hover:scale-110 transition-smooth">
          <Globe2 className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
      </div>
      <span className={`font-display font-extrabold text-xl ${text} tracking-tight`}>
        Linguist<span className="text-mint">ix</span>
      </span>
    </Link>
  );
};
