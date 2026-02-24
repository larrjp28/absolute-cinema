"use client";

import { useState } from "react";
import { Play, Share2 } from "lucide-react";
import { TMDBMovieDetail } from "@/types";
import ListButtons from "@/components/ListButtons";
import TrailerModal from "@/components/TrailerModal";
import { useToast } from "@/components/Toast";

interface MovieDetailClientProps {
  movie: TMDBMovieDetail;
  trailerId: string | null;
}

export default function MovieDetailClient({ movie, trailerId }: MovieDetailClientProps) {
  const [showTrailer, setShowTrailer] = useState(false);
  const { showToast } = useToast();

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link copied to clipboard!");
    } catch {
      showToast("Could not copy link");
    }
  };

  const movieForList = {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    vote_average: movie.vote_average,
    release_date: movie.release_date,
    overview: movie.overview,
    backdrop_path: movie.backdrop_path,
    genre_ids: movie.genres.map((g) => g.id),
    vote_count: movie.vote_count,
    popularity: 0,
    adult: false,
    original_language: movie.original_language,
    original_title: movie.title,
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
        <ListButtons movie={movieForList} />
        {trailerId && (
          <button
            onClick={() => setShowTrailer(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ab-accent text-white font-medium text-sm hover:bg-ab-accent-dark transition-all hover:scale-105"
          >
            <Play size={16} fill="currentColor" />
            Trailer
          </button>
        )}
        <button
          onClick={handleShare}
          className="p-2.5 rounded-xl border border-ab-border bg-ab-card hover:bg-ab-card-hover text-ab-text-secondary hover:text-ab-text transition-colors"
          aria-label="Share"
          title="Copy link"
        >
          <Share2 size={16} />
        </button>
      </div>

      {showTrailer && (
        <TrailerModal movieId={movie.id} onClose={() => setShowTrailer(false)} />
      )}
    </>
  );
}
