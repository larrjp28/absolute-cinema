import { Star } from "lucide-react";

interface RatingBadgeProps {
  source: "imdb" | "rt" | "metacritic" | "tmdb";
  value: string;
}

function getScoreColor(source: string, value: string): string {
  const num = parseFloat(value.replace("%", ""));
  if (source === "tmdb" || source === "imdb") {
    const v = source === "tmdb" ? num : num; // both on ~10 scale
    if (v >= 7) return "text-green-400";
    if (v >= 5) return "text-yellow-400";
    return "text-red-400";
  }
  // RT and Metacritic are percentage-based
  const pct = source === "rt" ? num : num;
  if (pct >= 70) return "text-green-400";
  if (pct >= 50) return "text-yellow-400";
  return "text-red-400";
}

function IMDbLogo() {
  return (
    <div className="flex items-center justify-center w-10 h-5 bg-[#F5C518] rounded font-black text-[11px] text-black tracking-tighter leading-none select-none">
      IMDb
    </div>
  );
}

function RTLogo({ value }: { value: string }) {
  const num = parseFloat(value.replace("%", ""));
  const isFresh = num >= 60;
  return (
    <div className="flex items-center justify-center w-6 h-6">
      {isFresh ? (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
          <circle cx="12" cy="10" r="9" fill="#FA320A" />
          <path d="M12 4C12 4 9 8 9 11C9 13 10.5 14.5 12 14.5C13.5 14.5 15 13 15 11C15 8 12 4 12 4Z" fill="#FFBC0E" />
          <ellipse cx="12" cy="20" rx="6" ry="3" fill="#2D7A3A" opacity="0.7" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
          <circle cx="12" cy="10" r="9" fill="#0AC855" opacity="0.8" />
          <path d="M8 7L16 15M16 7L8 15" stroke="#1A5928" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="12" cy="20" rx="6" ry="3" fill="#2D7A3A" opacity="0.5" />
        </svg>
      )}
    </div>
  );
}

function MetacriticLogo({ value }: { value: string }) {
  const num = parseFloat(value);
  const bg = num >= 61 ? "bg-[#66CC33]" : num >= 40 ? "bg-[#FFCC33]" : "bg-[#FF0000]";
  return (
    <div className={`flex items-center justify-center w-7 h-7 rounded ${bg}`}>
      <span className="text-white font-bold text-xs leading-none">{Math.round(num)}</span>
    </div>
  );
}

function TMDbLogo() {
  return (
    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-[#90CEA1] to-[#01B4E4]">
      <Star size={13} className="text-white" fill="white" />
    </div>
  );
}

export default function RatingBadge({ source, value }: RatingBadgeProps) {
  const scoreColor = getScoreColor(source, value);

  return (
    <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] transition-colors">
      {/* Source icon/logo */}
      {source === "imdb" && <IMDbLogo />}
      {source === "rt" && <RTLogo value={value} />}
      {source === "metacritic" && <MetacriticLogo value={value} />}
      {source === "tmdb" && <TMDbLogo />}

      {/* Label + value */}
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] uppercase tracking-wider text-ab-text-muted font-medium leading-tight">
          {source === "imdb" ? "IMDb" : source === "rt" ? "Rotten Tomatoes" : source === "metacritic" ? "Metacritic" : "TMDB"}
        </span>
        <span className={`text-base font-bold leading-tight ${scoreColor}`}>
          {value}{source === "rt" || source === "metacritic" ? "" : source === "tmdb" ? "/10" : "/10"}
        </span>
      </div>
    </div>
  );
}
