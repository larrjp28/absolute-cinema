"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { TMDBMovie, UserListItem } from "@/types";
import { getImageUrl } from "@/lib/constants";
import ListButtons from "./ListButtons";

interface MovieCardProps {
  movie: TMDBMovie | UserListItem;
  index?: number;
  showListButtons?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function MovieCard({
  movie,
  index = 0,
  showListButtons = true,
  size = "md",
}: MovieCardProps) {
  const sizeClasses = {
    sm: "w-[130px] sm:w-[150px]",
    md: "w-[150px] sm:w-[180px]",
    lg: "w-[170px] sm:w-[200px]",
  };

  const posterSizes = {
    sm: "w342" as const,
    md: "w342" as const,
    lg: "w500" as const,
  };

  return (
    <div
      className={`${sizeClasses[size]} shrink-0 group`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Poster */}
      <Link href={`/movie/${movie.id}`} className="block">
        <div className="movie-card relative aspect-[2/3] rounded-xl overflow-hidden bg-ab-card poster-shadow">
          <Image
            src={getImageUrl(movie.poster_path, posterSizes[size])}
            alt={movie.title}
            fill
            className="object-cover"
            sizes={`(max-width: 640px) ${size === "sm" ? "130px" : "150px"}, ${size === "lg" ? "200px" : "180px"}`}
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Rating badge */}
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-ab-star px-2 py-0.5 rounded-md text-xs font-semibold">
            <Star size={10} fill="currentColor" />
            {movie.vote_average.toFixed(1)}
          </div>

          {/* List buttons on hover */}
          {showListButtons && (
            <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ListButtons movie={movie} compact />
            </div>
          )}
        </div>
      </Link>

      {/* Title & Year */}
      <Link href={`/movie/${movie.id}`} className="block mt-2.5 px-0.5">
        <h3 className="text-sm font-medium text-ab-text truncate group-hover:text-ab-accent transition-colors">
          {movie.title}
        </h3>
        <p className="text-xs text-ab-text-muted mt-0.5">
          {movie.release_date?.split("-")[0] || "TBA"}
        </p>
      </Link>
    </div>
  );
}
