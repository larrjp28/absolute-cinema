"use client";

import { useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TMDBMovie, UserListItem } from "@/types";
import MovieCard from "./MovieCard";

interface MovieRowProps {
  title: string;
  movies: (TMDBMovie | UserListItem)[];
  seeAllHref?: string;
}

export default function MovieRow({ title, movies, seeAllHref }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
    setTimeout(checkScroll, 400);
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section className="py-4 md:py-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        <div className="flex items-center gap-2">
          {seeAllHref && (
            <a
              href={seeAllHref}
              className="text-sm text-ab-accent hover:text-ab-accent-dark transition-colors mr-2"
            >
              See All
            </a>
          )}
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="hidden sm:flex p-1.5 rounded-lg bg-ab-card hover:bg-ab-card-hover border border-ab-border text-ab-text-secondary hover:text-ab-text disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="hidden sm:flex p-1.5 rounded-lg bg-ab-card hover:bg-ab-card-hover border border-ab-border text-ab-text-secondary hover:text-ab-text disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Scrolling Row */}
      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-row px-4 sm:px-6 lg:px-[calc((100vw-80rem)/2+2rem)] pb-4"
        >
          {movies.map((movie, i) => (
            <MovieCard key={movie.id} movie={movie} index={i} />
          ))}
        </div>

        {/* Fade edges */}
        {canScrollLeft && (
          <div className="hidden sm:block absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-ab-primary to-transparent pointer-events-none" />
        )}
        {canScrollRight && (
          <div className="hidden sm:block absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-ab-primary to-transparent pointer-events-none" />
        )}
      </div>
    </section>
  );
}
