"use client";

import { useState, useEffect, useCallback } from "react";
import { Heart, Bookmark, Eye } from "lucide-react";
import { TMDBMovie, UserListItem, ListType } from "@/types";
import { isInList, toggleList } from "@/lib/storage";
import { useToast } from "./Toast";

interface ListButtonsProps {
  movie: TMDBMovie | UserListItem;
  compact?: boolean;
}

const LIST_CONFIG: {
  type: ListType;
  icon: typeof Heart;
  label: string;
  activeColor: string;
  addMsg: string;
  removeMsg: string;
}[] = [
  {
    type: "favorites",
    icon: Heart,
    label: "Favorite",
    activeColor: "text-red-500",
    addMsg: "Added to Favorites",
    removeMsg: "Removed from Favorites",
  },
  {
    type: "watchlist",
    icon: Bookmark,
    label: "Watchlist",
    activeColor: "text-ab-accent",
    addMsg: "Added to Watchlist",
    removeMsg: "Removed from Watchlist",
  },
  {
    type: "watched",
    icon: Eye,
    label: "Watched",
    activeColor: "text-ab-indigo",
    addMsg: "Marked as Watched",
    removeMsg: "Unmarked as Watched",
  },
];

export default function ListButtons({ movie, compact = false }: ListButtonsProps) {
  const [states, setStates] = useState<Record<ListType, boolean>>({
    favorites: false,
    watchlist: false,
    watched: false,
  });
  const { showToast } = useToast();

  useEffect(() => {
    setStates({
      favorites: isInList("favorites", movie.id),
      watchlist: isInList("watchlist", movie.id),
      watched: isInList("watched", movie.id),
    });
  }, [movie.id]);

  const handleToggle = useCallback(
    (type: ListType) => {
      const nowActive = toggleList(type, movie);
      setStates((prev) => ({ ...prev, [type]: nowActive }));

      const config = LIST_CONFIG.find((c) => c.type === type)!;
      showToast(nowActive ? config.addMsg : config.removeMsg);

      window.dispatchEvent(new Event("storage-update"));
    },
    [movie, showToast]
  );

  if (compact) {
    return (
      <div className="flex items-center gap-1" onClick={(e) => e.preventDefault()}>
        {LIST_CONFIG.map(({ type, icon: Icon, label, activeColor }) => (
          <button
            key={type}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleToggle(type);
            }}
            className={`p-1.5 rounded-lg bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-all ${
              states[type] ? activeColor : "text-white/80"
            }`}
            aria-label={label}
            title={label}
          >
            <Icon size={14} fill={states[type] ? "currentColor" : "none"} />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {LIST_CONFIG.map(({ type, icon: Icon, label, activeColor }) => (
        <button
          key={type}
          onClick={() => handleToggle(type)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 text-sm font-medium ${
            states[type]
              ? `${activeColor} border-current bg-current/10`
              : "text-ab-text-secondary border-ab-border hover:border-ab-text-muted hover:text-ab-text bg-ab-card hover:bg-ab-card-hover"
          }`}
          aria-label={`${states[type] ? "Remove from" : "Add to"} ${label}`}
        >
          <Icon size={16} fill={states[type] ? "currentColor" : "none"} />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
