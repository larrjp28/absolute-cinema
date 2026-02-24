"use client";

import { useState, useEffect, useCallback } from "react";
import { Heart, Bookmark, Eye, Trash2, Film, ArrowUpDown } from "lucide-react";
import { UserListItem, ListType } from "@/types";
import { getFavorites, getWatchlist, getWatched, removeFromList } from "@/lib/storage";
import MovieCard from "@/components/MovieCard";
import { useToast } from "@/components/Toast";

const TABS: { type: ListType; label: string; icon: typeof Heart; emptyText: string }[] = [
  {
    type: "favorites",
    label: "Favorites",
    icon: Heart,
    emptyText: "Movies you love will appear here. Click the heart icon on any movie to add it.",
  },
  {
    type: "watchlist",
    label: "Watchlist",
    icon: Bookmark,
    emptyText: "Save movies you want to watch later. Click the bookmark icon on any movie.",
  },
  {
    type: "watched",
    label: "Watched",
    icon: Eye,
    emptyText: "Track movies you've already seen. Click the eye icon on any movie.",
  },
];

type SortField = "addedAt" | "title" | "vote_average" | "release_date";

export default function MyListsPage() {
  const [activeTab, setActiveTab] = useState<ListType>("favorites");
  const [items, setItems] = useState<UserListItem[]>([]);
  const [sortBy, setSortBy] = useState<SortField>("addedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const { showToast } = useToast();

  const loadItems = useCallback(() => {
    switch (activeTab) {
      case "favorites":
        setItems(getFavorites());
        break;
      case "watchlist":
        setItems(getWatchlist());
        break;
      case "watched":
        setItems(getWatched());
        break;
    }
  }, [activeTab]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Listen for storage changes from other components
  useEffect(() => {
    const handler = () => loadItems();
    window.addEventListener("storage-update", handler);
    return () => window.removeEventListener("storage-update", handler);
  }, [loadItems]);

  const handleRemove = (movieId: number, title: string) => {
    removeFromList(activeTab, movieId);
    setItems((prev) => prev.filter((item) => item.id !== movieId));
    showToast(`Removed "${title}" from ${activeTab}`);
    window.dispatchEvent(new Event("storage-update"));
  };

  const toggleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir(field === "title" ? "asc" : "desc");
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    let result = 0;
    switch (sortBy) {
      case "title":
        result = a.title.localeCompare(b.title);
        break;
      case "vote_average":
        result = a.vote_average - b.vote_average;
        break;
      case "release_date":
        result = (a.release_date || "").localeCompare(b.release_date || "");
        break;
      case "addedAt":
        result = (a.addedAt || "").localeCompare(b.addedAt || "");
        break;
    }
    return sortDir === "desc" ? -result : result;
  });

  const activeConfig = TABS.find((t) => t.type === activeTab)!;

  return (
    <div className="min-h-screen pt-24 pb-20 md:pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">My Lists</h1>
        <p className="text-ab-text-muted mb-8">
          Your personal movie collections — track what you love, want to watch, and have seen.
        </p>

        {/* Tabs */}
        <div className="flex gap-1 bg-ab-card border border-ab-border rounded-2xl p-1.5 mb-8 w-fit">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.type;
            return (
              <button
                key={tab.type}
                onClick={() => setActiveTab(tab.type)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-ab-accent text-ab-primary shadow-lg shadow-ab-accent/20"
                    : "text-ab-text-secondary hover:text-ab-text hover:bg-white/5"
                }`}
              >
                <Icon size={16} fill={isActive ? "currentColor" : "none"} />
                <span className="hidden sm:inline">{tab.label}</span>
                {items.length > 0 && isActive && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isActive ? "bg-ab-primary/20" : "bg-ab-border"
                  }`}>
                    {items.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sort controls */}
        {items.length > 1 && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-xs text-ab-text-muted uppercase tracking-wider font-medium mr-1">
              Sort by:
            </span>
            {(
              [
                { field: "addedAt" as SortField, label: "Date Added" },
                { field: "title" as SortField, label: "Title" },
                { field: "vote_average" as SortField, label: "Rating" },
                { field: "release_date" as SortField, label: "Year" },
              ] as const
            ).map(({ field, label }) => (
              <button
                key={field}
                onClick={() => toggleSort(field)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  sortBy === field
                    ? "bg-ab-accent/10 text-ab-accent border border-ab-accent/30"
                    : "bg-ab-card border border-ab-border text-ab-text-secondary hover:text-ab-text"
                }`}
              >
                {label}
                {sortBy === field && (
                  <ArrowUpDown size={10} />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        {sortedItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {sortedItems.map((item, i) => (
              <div
                key={item.id}
                className="relative group/card animate-fade-in"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <MovieCard movie={item} size="lg" showListButtons={false} />
                <button
                  onClick={() => handleRemove(item.id, item.title)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/80 text-white opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-red-600 z-10"
                  aria-label={`Remove ${item.title}`}
                  title="Remove from list"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-2xl bg-ab-card border border-ab-border flex items-center justify-center mb-6">
              <Film size={32} className="text-ab-text-muted" />
            </div>
            <p className="text-lg font-medium mb-2">
              No movies in {activeConfig.label}
            </p>
            <p className="text-sm text-ab-text-muted max-w-md">
              {activeConfig.emptyText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
