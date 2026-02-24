import Link from "next/link";

interface GenreBadgeProps {
  id: number;
  name: string;
  active?: boolean;
  onClick?: () => void;
  asLink?: boolean;
}

export default function GenreBadge({
  id,
  name,
  active = false,
  onClick,
  asLink = false,
}: GenreBadgeProps) {
  const classes = `inline-flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer select-none ${
    active
      ? "bg-ab-accent text-white"
      : "bg-white/5 text-ab-text-secondary border border-ab-border hover:bg-white/10 hover:text-ab-text hover:border-ab-text-muted"
  }`;

  if (asLink) {
    return (
      <Link href={`/browse?genre=${id}`} className={classes}>
        {name}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {name}
    </button>
  );
}
