import { Metadata } from "next";
import { Search as SearchIcon, Film, SlidersHorizontal } from "lucide-react";
import { searchMovies } from "@/lib/tmdb";
import SearchPageClient from "./SearchPageClient";

interface PageProps {
  searchParams: { q?: string; page?: string; year?: string };
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const q = searchParams.q || "";
  return {
    title: q ? `"${q}" — Search — AbsoluteCinema` : "Search — AbsoluteCinema",
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const query = searchParams.q || "";
  const page = parseInt(searchParams.page || "1", 10);
  const year = searchParams.year;

  if (!query) {
    return (
      <div className="min-h-screen pt-24 pb-20 md:pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-2xl bg-ab-card border border-ab-border flex items-center justify-center mb-6">
              <SearchIcon size={32} className="text-ab-text-muted" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Search Movies</h1>
            <p className="text-ab-text-secondary max-w-md">
              Use the search bar above to find movies by title. Discover information about
              your favorite films, check ratings, and watch trailers.
            </p>
          </div>
        </div>
      </div>
    );
  }

  let results = null;
  let error = null;

  try {
    results = await searchMovies(query, page, year);
  } catch (e) {
    error = "Failed to fetch search results. Please try again.";
  }

  return (
    <div className="min-h-screen pt-24 pb-20 md:pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <SearchPageClient
          query={query}
          page={page}
          year={year}
          results={results}
          error={error}
        />
      </div>
    </div>
  );
}
