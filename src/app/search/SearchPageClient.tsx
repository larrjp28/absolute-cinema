"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronLeft, ChevronRight, Filter, X } from "lucide-react";
import { TMDBMovie, TMDBPaginatedResponse } from "@/types";
import MovieCard from "@/components/MovieCard";

interface SearchPageClientProps {
  query: string;
  page: number;
  year?: string;
  results: TMDBPaginatedResponse<TMDBMovie> | null;
  error: string | null;
}

export default function SearchPageClient({
  query,
  page,
  year,
  results,
  error,
}: SearchPageClientProps) {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [filterYear, setFilterYear] = useState(year || "");
  const [showFilters, setShowFilters] = useState(false);

  const movies = results?.results || [];
  const totalPages = results?.total_pages || 0;
  const totalResults = results?.total_results || 0;

  // Client-side sorting
  const sortedMovies = [...movies].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.vote_average - a.vote_average;
      case "year-new":
        return (b.release_date || "").localeCompare(a.release_date || "");
      case "year-old":
        return (a.release_date || "").localeCompare(b.release_date || "");
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const navigate = (newPage: number, newYear?: string) => {
    const params = new URLSearchParams({ q: query, page: String(newPage) });
    if (newYear || filterYear) params.set("year", newYear || filterYear);
    router.push(`/search?${params}`);
  };

  const applyYearFilter = () => {
    navigate(1, filterYear);
  };

  const clearFilters = () => {
    setFilterYear("");
    setSortBy("relevance");
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-ab-error text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Results for &ldquo;{query}&rdquo;
          </h1>
          <p className="text-sm text-ab-text-muted mt-1">
            {totalResults.toLocaleString()} movies found
            {year && ` in ${year}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-ab-card border border-ab-border rounded-xl px-3 py-2 text-sm text-ab-text focus:outline-none focus:border-ab-accent/60 cursor-pointer"
          >
            <option value="relevance">Relevance</option>
            <option value="rating">Highest Rated</option>
            <option value="year-new">Newest</option>
            <option value="year-old">Oldest</option>
            <option value="title">Title A-Z</option>
          </select>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-xl border transition-colors ${
              showFilters || filterYear
                ? "border-ab-accent text-ab-accent bg-ab-accent/10"
                : "border-ab-border text-ab-text-secondary hover:text-ab-text bg-ab-card"
            }`}
            aria-label="Filters"
          >
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-ab-card border border-ab-border rounded-2xl p-4 mb-6 flex flex-wrap items-end gap-4 animate-slide-up">
          <div>
            <label className="text-xs text-ab-text-muted font-medium uppercase tracking-wider block mb-1.5">
              Year
            </label>
            <input
              type="number"
              placeholder="e.g. 2024"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              min="1900"
              max="2030"
              className="w-28 bg-ab-surface border border-ab-border rounded-lg px-3 py-2 text-sm text-ab-text focus:outline-none focus:border-ab-accent/60"
            />
          </div>
          <button
            onClick={applyYearFilter}
            className="px-4 py-2 bg-ab-accent text-white text-sm font-medium rounded-lg hover:bg-ab-accent-dark transition-colors"
          >
            Apply
          </button>
          {filterYear && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 text-sm text-ab-text-secondary hover:text-ab-text transition-colors"
            >
              <X size={14} />
              Clear
            </button>
          )}
        </div>
      )}

      {/* Results Grid */}
      {sortedMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {sortedMovies.map((movie, i) => (
            <div key={movie.id} className="animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
              <MovieCard movie={movie} size="lg" />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Search size={40} className="text-ab-text-muted mx-auto mb-4" />
          <p className="text-lg font-medium">No results found</p>
          <p className="text-sm text-ab-text-muted mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-10">
          <button
            onClick={() => navigate(page - 1)}
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
            onClick={() => navigate(page + 1)}
            disabled={page >= totalPages || page >= 500}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-ab-card border border-ab-border text-sm font-medium hover:bg-ab-card-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
