"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { TMDBMovie, TMDBPaginatedResponse } from "@/types";
import { GENRES, SORT_OPTIONS, TMDB_API_BASE, TMDB_API_KEY } from "@/lib/constants";
import MovieCard from "@/components/MovieCard";
import GenreBadge from "@/components/GenreBadge";

export default function BrowsePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 pb-20 md:pb-8 px-4 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-ab-accent" />
      </div>
    }>
      <BrowseContent />
    </Suspense>
  );
}

function BrowseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialGenre = searchParams.get("genre") ? Number(searchParams.get("genre")) : 0;
  const initialSort = searchParams.get("sort") || "popularity.desc";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);

  const [activeGenre, setActiveGenre] = useState(initialGenre);
  const [sortBy, setSortBy] = useState(initialSort);
  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState<TMDBPaginatedResponse<TMDBMovie> | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        api_key: TMDB_API_KEY,
        sort_by: sortBy,
        page: String(page),
        include_adult: "false",
        "vote_count.gte": "50",
      });
      if (activeGenre) params.set("with_genres", String(activeGenre));

      const res = await fetch(`${TMDB_API_BASE}/discover/movie?${params}`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    } finally {
      setLoading(false);
    }
  }, [activeGenre, sortBy, page]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (activeGenre) params.set("genre", String(activeGenre));
    if (sortBy !== "popularity.desc") params.set("sort", sortBy);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    router.replace(`/browse${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [activeGenre, sortBy, page, router]);

  const handleGenreClick = (genreId: number) => {
    setActiveGenre(activeGenre === genreId ? 0 : genreId);
    setPage(1);
  };

  const movies = data?.results || [];
  const totalPages = data?.total_pages || 0;

  return (
    <div className="min-h-screen pt-24 pb-20 md:pb-8 px-4 page-transition">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Browse Movies</h1>
        <p className="text-ab-text-muted mb-6">
          Explore movies by genre, sort by popularity, ratings, and more.
        </p>

        {/* Genre Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <GenreBadge
            id={0}
            name="All"
            active={activeGenre === 0}
            onClick={() => { setActiveGenre(0); setPage(1); }}
          />
          {GENRES.map((genre) => (
            <GenreBadge
              key={genre.id}
              id={genre.id}
              name={genre.name}
              active={activeGenre === genre.id}
              onClick={() => handleGenreClick(genre.id)}
            />
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-ab-text-muted">
            {data ? `${data.total_results.toLocaleString()} movies` : "Loading..."}
          </p>
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
            className="bg-ab-card border border-ab-border rounded-xl px-3 py-2 text-sm text-ab-text focus:outline-none focus:border-ab-accent/60 cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-ab-accent" />
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {movies.map((movie, i) => (
              <div key={movie.id} className="animate-fade-in" style={{ animationDelay: `${i * 20}ms` }}>
                <MovieCard movie={movie} size="lg" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg font-medium text-ab-text-muted">No movies found</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              onClick={() => { setPage(page - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              disabled={page <= 1}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-ab-card border border-ab-border text-sm font-medium hover:bg-ab-card-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <span className="text-sm text-ab-text-muted">
              Page {page} of {Math.min(totalPages, 500)}
            </span>
            <button
              onClick={() => { setPage(page + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              disabled={page >= totalPages || page >= 500}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-ab-card border border-ab-border text-sm font-medium hover:bg-ab-card-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
