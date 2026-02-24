"use client";

import { useState } from "react";
import { Star, ChevronDown, ChevronUp, User } from "lucide-react";
import { TMDBReview } from "@/types";

interface ReviewCardProps {
  review: TMDBReview;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.content.length > 400;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-ab-card border border-ab-border rounded-2xl p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-ab-surface flex items-center justify-center shrink-0 overflow-hidden">
          {review.author_details.avatar_path ? (
            <img
              src={
                review.author_details.avatar_path.startsWith("/https")
                  ? review.author_details.avatar_path.slice(1)
                  : `https://image.tmdb.org/t/p/w45${review.author_details.avatar_path}`
              }
              alt={review.author}
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={18} className="text-ab-text-muted" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-ab-text">
              {review.author}
            </span>
            {review.author_details.rating && (
              <div className="flex items-center gap-1 text-ab-star text-xs">
                <Star size={12} fill="currentColor" />
                {review.author_details.rating}/10
              </div>
            )}
          </div>
          <span className="text-xs text-ab-text-muted">
            {formatDate(review.created_at)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        <p
          className={`text-sm text-ab-text-secondary leading-relaxed whitespace-pre-line ${
            !expanded && isLong ? "line-clamp-4" : ""
          }`}
        >
          {review.content}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 mt-2 text-sm text-ab-accent hover:text-ab-accent-dark transition-colors"
          >
            {expanded ? (
              <>
                Show less <ChevronUp size={14} />
              </>
            ) : (
              <>
                Read more <ChevronDown size={14} />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
