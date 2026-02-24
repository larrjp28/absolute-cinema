"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { TMDB_API_KEY, TMDB_API_BASE } from "@/lib/constants";

interface TrailerModalProps {
  movieId: number;
  onClose: () => void;
}

export default function TrailerModal({ movieId, onClose }: TrailerModalProps) {
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const res = await fetch(
          `${TMDB_API_BASE}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`
        );
        const data = await res.json();
        const results = data.results || [];

        // Prefer official trailers, then teasers, then anything
        const trailer =
          results.find(
            (v: any) => v.type === "Trailer" && v.site === "YouTube" && v.official
          ) ||
          results.find((v: any) => v.type === "Trailer" && v.site === "YouTube") ||
          results.find((v: any) => v.type === "Teaser" && v.site === "YouTube") ||
          results.find((v: any) => v.site === "YouTube");

        if (trailer) setVideoKey(trailer.key);
      } catch (error) {
        console.error("Failed to fetch trailer:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrailer();
  }, [movieId]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl mx-4 aspect-video bg-ab-card rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white/60 hover:text-white transition-colors z-10"
          aria-label="Close trailer"
        >
          <X size={24} />
        </button>

        {loading ? (
          <div className="flex items-center justify-center h-full gap-3 text-ab-text-muted">
            <Loader2 size={24} className="animate-spin" />
            <span>Loading trailer...</span>
          </div>
        ) : videoKey ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1`}
            className="w-full h-full"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            title="Movie Trailer"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-ab-text-muted gap-2">
            <p className="text-lg font-medium">No trailer available</p>
            <p className="text-sm">Check back later for updates</p>
          </div>
        )}
      </div>
    </div>
  );
}
