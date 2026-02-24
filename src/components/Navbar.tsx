"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  Home,
  Compass,
  BookmarkPlus,
  X,
  Film,
  Clock,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { TMDB_API_BASE, TMDB_API_KEY, getImageUrl } from "@/lib/constants";
import { TMDBMovie } from "@/types";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/browse", label: "Browse", icon: Compass },
  { href: "/my-lists", label: "My Lists", icon: BookmarkPlus },
];

const RECENT_SEARCHES_KEY = "ab_recent_searches";
const MAX_RECENT = 6;

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string): void {
  const recent = getRecentSearches().filter((s) => s.toLowerCase() !== query.toLowerCase());
  recent.unshift(query);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
}

function clearRecentSearches(): void {
  localStorage.removeItem(RECENT_SEARCHES_KEY);
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<TMDBMovie[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      searchRef.current?.focus();
      setRecentSearches(getRecentSearches());
    } else {
      setSuggestions([]);
      setShowDropdown(false);
      setSelectedIdx(-1);
    }
  }, [searchOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced autocomplete search
  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSuggestions([]);
      setLoadingSuggestions(false);
      return;
    }
    setLoadingSuggestions(true);
    try {
      const res = await fetch(
        `${TMDB_API_BASE}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(q)}&page=1&include_adult=false`
      );
      const data = await res.json();
      setSuggestions((data.results || []).slice(0, 6));
    } catch {
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  }, []);

  const onQueryChange = (val: string) => {
    setSearchQuery(val);
    setSelectedIdx(-1);
    setShowDropdown(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  const executeSearch = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    saveRecentSearch(trimmed);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    setSearchOpen(false);
    setSearchQuery("");
    setShowDropdown(false);
    setSuggestions([]);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIdx >= 0 && suggestions[selectedIdx]) {
      router.push(`/movie/${suggestions[selectedIdx].id}`);
      setSearchOpen(false);
      setSearchQuery("");
      setShowDropdown(false);
      return;
    }
    executeSearch(searchQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const total = suggestions.length;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((prev) => (prev < total - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((prev) => (prev > 0 ? prev - 1 : total - 1));
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleClearRecent = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  const showRecentSection = searchQuery.length < 2 && recentSearches.length > 0;
  const showSuggestionsSection = searchQuery.length >= 2;

  const dropdownContent = (isDesktop: boolean) => (
    <div
      ref={isDesktop ? dropdownRef : undefined}
      className="absolute left-0 right-0 top-full mt-1 bg-ab-secondary/95 backdrop-blur-xl border border-ab-border rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-[100] max-h-[400px] overflow-y-auto"
    >
      {/* Recent searches */}
      {showRecentSection && (
        <div className="p-2">
          <div className="flex items-center justify-between px-2 py-1.5">
            <span className="text-[11px] uppercase tracking-wider text-ab-text-muted font-medium flex items-center gap-1.5">
              <Clock size={12} />
              Recent Searches
            </span>
            <button
              onClick={handleClearRecent}
              className="text-[11px] text-ab-text-muted hover:text-ab-error transition-colors"
            >
              Clear all
            </button>
          </div>
          {recentSearches.map((term) => (
            <button
              key={term}
              onClick={() => executeSearch(term)}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-ab-text-secondary hover:bg-white/5 hover:text-ab-text transition-colors text-left"
            >
              <Clock size={14} className="shrink-0 text-ab-text-muted" />
              <span className="truncate">{term}</span>
              <ArrowUpRight size={12} className="ml-auto shrink-0 text-ab-text-muted" />
            </button>
          ))}
        </div>
      )}

      {/* Suggestions */}
      {showSuggestionsSection && (
        <div className="p-2">
          {loadingSuggestions ? (
            <div className="flex items-center gap-2 px-3 py-3 text-sm text-ab-text-muted">
              <div className="w-4 h-4 border-2 border-ab-text-muted border-t-transparent rounded-full animate-spin" />
              Searching...
            </div>
          ) : suggestions.length > 0 ? (
            <>
              <div className="px-2 py-1.5">
                <span className="text-[11px] uppercase tracking-wider text-ab-text-muted font-medium flex items-center gap-1.5">
                  <TrendingUp size={12} />
                  Suggestions
                </span>
              </div>
              {suggestions.map((movie, idx) => (
                <Link
                  key={movie.id}
                  href={`/movie/${movie.id}`}
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                    setShowDropdown(false);
                  }}
                  className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                    idx === selectedIdx
                      ? "bg-ab-accent/15 text-ab-text"
                      : "text-ab-text-secondary hover:bg-white/5 hover:text-ab-text"
                  }`}
                >
                  {/* Poster thumbnail */}
                  <div className="w-8 h-12 rounded overflow-hidden bg-ab-card shrink-0">
                    {movie.poster_path ? (
                      <Image
                        src={getImageUrl(movie.poster_path, "w92")}
                        alt={movie.title}
                        width={32}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Film size={14} className="text-ab-text-muted" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{movie.title}</p>
                    <p className="text-xs text-ab-text-muted">
                      {movie.release_date?.split("-")[0] || "N/A"}
                      {movie.vote_average > 0 && (
                        <span className="ml-2 text-ab-star">★ {movie.vote_average.toFixed(1)}</span>
                      )}
                    </p>
                  </div>
                </Link>
              ))}
              {/* View all results link */}
              <button
                onClick={() => executeSearch(searchQuery)}
                className="flex items-center justify-center gap-1.5 w-full px-3 py-2.5 mt-1 rounded-lg text-sm font-medium text-ab-accent hover:bg-ab-accent/10 transition-colors border-t border-ab-border"
              >
                <Search size={14} />
                View all results for &ldquo;{searchQuery}&rdquo;
              </button>
            </>
          ) : (
            <div className="px-3 py-3 text-sm text-ab-text-muted">
              No movies found for &ldquo;{searchQuery}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* ── Desktop / Tablet Top Bar ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "glass border-b border-ab-border shadow-lg shadow-black/20"
            : "bg-gradient-to-b from-ab-primary/90 to-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-9 h-9 bg-ab-accent rounded-lg flex items-center justify-center font-extrabold text-white text-sm tracking-tight group-hover:bg-ab-accent-dark transition-colors">
                AB
              </div>
              <span className="hidden sm:block text-lg font-bold tracking-tight">
                Absolute<span className="text-ab-accent">Cinema</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "text-ab-accent bg-ab-accent/10"
                      : "text-ab-text-secondary hover:text-ab-text hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Search */}
            <div className="flex items-center gap-2">
              {searchOpen ? (
                <div className="relative" ref={dropdownRef}>
                  <form onSubmit={handleSearch} className="flex items-center animate-fade-in">
                    <input
                      ref={searchRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => onQueryChange(e.target.value)}
                      onFocus={() => setShowDropdown(true)}
                      onKeyDown={handleKeyDown}
                      placeholder="Search movies..."
                      className="w-44 sm:w-72 bg-ab-card border border-ab-border rounded-xl px-4 py-2 text-sm text-ab-text placeholder:text-ab-text-muted focus:outline-none focus:border-ab-accent/60 transition-all"
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                        setShowDropdown(false);
                      }}
                      className="ml-2 p-2 text-ab-text-secondary hover:text-ab-text transition-colors"
                      aria-label="Close search"
                    >
                      <X size={18} />
                    </button>
                  </form>
                  {showDropdown && (showRecentSection || showSuggestionsSection) && dropdownContent(true)}
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-ab-text-secondary hover:text-ab-text transition-colors"
                  aria-label="Open search"
                >
                  <Search size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Bottom Navigation ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-ab-border safe-area-pb">
        <div className="flex items-center justify-around h-16 px-1">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
                  isActive ? "text-ab-accent" : "text-ab-text-muted hover:text-ab-text-secondary"
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{link.label}</span>
              </Link>
            );
          })}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
              searchOpen ? "text-ab-accent" : "text-ab-text-muted hover:text-ab-text-secondary"
            }`}
          >
            <Search size={20} strokeWidth={searchOpen ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Search</span>
          </button>
        </div>
      </div>

      {/* ── Mobile Search Overlay ── */}
      {searchOpen && (
        <div className="md:hidden fixed inset-x-0 bottom-16 z-[55] glass border-t border-ab-border animate-slide-up">
          <div className="p-3">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ab-text-muted" />
                <input
                  ref={mobileSearchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onQueryChange(e.target.value)}
                  onFocus={() => {
                    setRecentSearches(getRecentSearches());
                    setShowDropdown(true);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search movies, actors..."
                  className="w-full bg-ab-card border border-ab-border rounded-xl pl-10 pr-4 py-3 text-sm text-ab-text placeholder:text-ab-text-muted focus:outline-none focus:border-ab-accent/60"
                  autoFocus
                  autoComplete="off"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                  setShowDropdown(false);
                }}
                className="p-2 text-ab-text-secondary"
                aria-label="Close search"
              >
                <X size={20} />
              </button>
            </form>
          </div>
          {/* Mobile dropdown appears above the search bar */}
          {showDropdown && (showRecentSection || showSuggestionsSection) && (
            <div className="max-h-[50vh] overflow-y-auto border-t border-ab-border">
              {dropdownContent(false)}
            </div>
          )}
        </div>
      )}
    </>
  );
}
