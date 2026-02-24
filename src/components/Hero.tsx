"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Info, Star } from "lucide-react";
import { TMDBMovie } from "@/types";
import { getImageUrl } from "@/lib/constants";
import TrailerModal from "./TrailerModal";

interface HeroProps {
  movie: TMDBMovie;
  genreNames?: string[];
}

export default function Hero({ movie, genreNames }: HeroProps) {
  const [showTrailer, setShowTrailer] = useState(false);

  if (!movie) return null;

  return (
    <>
      <section className="relative w-full h-[75vh] md:h-[85vh] overflow-hidden">
        {/* Backdrop */}
        {movie.backdrop_path && (
          <Image
            src={getImageUrl(movie.backdrop_path, "original")}
            alt={movie.title}
            fill
            className="object-cover object-top"
            priority
            quality={90}
            sizes="100vw"
          />
        )}

        {/* Overlays */}
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 hero-gradient-bottom" />

        {/* Content */}
        <div className="absolute inset-0 flex items-end pb-20 md:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl animate-slide-up">
              {/* Rating + Year */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1.5 bg-ab-star/15 text-ab-star px-3 py-1 rounded-full text-sm font-semibold">
                  <Star size={14} fill="currentColor" />
                  {movie.vote_average.toFixed(1)}
                </div>
                <span className="text-ab-text-secondary text-sm">
                  {movie.release_date?.split("-")[0]}
                </span>
                {genreNames && genreNames.length > 0 && (
                  <div className="hidden sm:flex items-center gap-2">
                    <span className="text-ab-text-muted">·</span>
                    {genreNames.slice(0, 3).map((g) => (
                      <span
                        key={g}
                        className="text-xs text-ab-text-secondary bg-white/10 px-2.5 py-0.5 rounded-full"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-[1.1] text-shadow">
                {movie.title}
              </h1>

              {/* Overview */}
              <p className="text-ab-text-secondary text-sm md:text-base mb-8 line-clamp-3 max-w-xl leading-relaxed">
                {movie.overview}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowTrailer(true)}
                  className="flex items-center gap-2 bg-ab-accent hover:bg-ab-accent-dark text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-ab-accent/20"
                >
                  <Play size={18} fill="currentColor" />
                  Watch Trailer
                </button>
                <Link
                  href={`/movie/${movie.id}`}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-ab-text font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105"
                >
                  <Info size={18} />
                  More Info
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showTrailer && (
        <TrailerModal movieId={movie.id} onClose={() => setShowTrailer(false)} />
      )}
    </>
  );
}
