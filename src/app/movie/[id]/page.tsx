import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock,
  Calendar,
  Globe,
  Award,
  DollarSign,
  Star,
  Play,
  Film,
} from "lucide-react";
import { TMDBMovie, TMDBCastMember, TMDBCrewMember, TMDBVideo, TMDBReview } from "@/types";
import { getMovieDetails, getMovieCredits, getMovieVideos, getMovieReviews, getSimilarMovies } from "@/lib/tmdb";
import { getOMDbByImdbId, parseOMDbRating } from "@/lib/omdb";
import { getImageUrl } from "@/lib/constants";
import RatingBadge from "@/components/RatingBadge";
import CastCard from "@/components/CastCard";
import ReviewCard from "@/components/ReviewCard";
import MovieRow from "@/components/MovieRow";
import MovieDetailClient from "./MovieDetailClient";

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const movie = await getMovieDetails(params.id);
    return {
      title: `${movie.title} (${movie.release_date?.split("-")[0]}) — AbsoluteCinema`,
      description: movie.overview,
    };
  } catch {
    return { title: "Movie — AbsoluteCinema" };
  }
}

export default async function MoviePage({ params }: PageProps) {
  let details;
  try {
    details = await getMovieDetails(params.id);
  } catch {
    notFound();
  }

  const [credits, videos, reviewsData, similar, omdb] = await Promise.all([
    getMovieCredits(params.id).catch(() => ({ cast: [] as TMDBCastMember[], crew: [] as TMDBCrewMember[] })),
    getMovieVideos(params.id).catch(() => [] as TMDBVideo[]),
    getMovieReviews(params.id).catch(() => ({ results: [] as TMDBReview[], total_results: 0, page: 1, total_pages: 0 })),
    getSimilarMovies(params.id).catch(() => [] as TMDBMovie[]),
    details.imdb_id ? getOMDbByImdbId(details.imdb_id) : null,
  ]);

  const trailer = videos.find(
    (v) => v.type === "Trailer" && v.site === "YouTube" && v.official
  ) || videos.find((v) => v.type === "Trailer" && v.site === "YouTube") || videos.find((v) => v.site === "YouTube");

  const director = credits.crew.find((c) => c.job === "Director");
  const writers = credits.crew
    .filter((c) => c.department === "Writing")
    .slice(0, 3);

  const omdbRatings = omdb ? parseOMDbRating(omdb.Ratings) : null;

  const formatCurrency = (val: number) =>
    val > 0 ? `$${(val / 1_000_000).toFixed(1)}M` : "N/A";

  const formatRuntime = (min: number) => {
    if (!min) return "N/A";
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div className="pb-20 md:pb-0">
      {/* ── Backdrop ── */}
      <div className="relative w-full h-[50vh] md:h-[65vh]">
        {details.backdrop_path ? (
          <Image
            src={getImageUrl(details.backdrop_path, "original")}
            alt={details.title}
            fill
            className="object-cover"
            priority
            quality={90}
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-ab-secondary" />
        )}
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 hero-gradient-bottom" />
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 md:-mt-64 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="shrink-0 mx-auto md:mx-0">
            <div className="relative w-[200px] sm:w-[240px] md:w-[280px] aspect-[2/3] rounded-2xl overflow-hidden poster-shadow">
              <Image
                src={getImageUrl(details.poster_path, "w500")}
                alt={details.title}
                fill
                className="object-cover"
                sizes="280px"
                priority
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pt-2">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 leading-tight text-center md:text-left">
              {details.title}
            </h1>

            {details.tagline && (
              <p className="text-ab-text-muted italic mb-4 text-center md:text-left">
                &ldquo;{details.tagline}&rdquo;
              </p>
            )}

            {/* Metadata pills */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-5 text-sm text-ab-text-secondary">
              {details.release_date && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {details.release_date.split("-")[0]}
                </span>
              )}
              {details.runtime > 0 && (
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {formatRuntime(details.runtime)}
                </span>
              )}
              {omdb?.Rated && omdb.Rated !== "N/A" && (
                <span className="px-2 py-0.5 rounded border border-ab-border text-xs font-medium">
                  {omdb.Rated}
                </span>
              )}
              {details.original_language && (
                <span className="flex items-center gap-1.5">
                  <Globe size={14} />
                  {details.spoken_languages?.[0]?.english_name || details.original_language.toUpperCase()}
                </span>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
              {details.genres.map((g) => (
                <Link
                  key={g.id}
                  href={`/browse?genre=${g.id}`}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-ab-text-secondary border border-ab-border hover:bg-ab-accent/10 hover:text-ab-accent hover:border-ab-accent/30 transition-colors"
                >
                  {g.name}
                </Link>
              ))}
            </div>

            {/* Ratings */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
              {details.vote_average > 0 && (
                <RatingBadge source="tmdb" value={details.vote_average.toFixed(1)} />
              )}
              {omdbRatings?.imdb && (
                <RatingBadge source="imdb" value={omdbRatings.imdb} />
              )}
              {omdbRatings?.rt && (
                <RatingBadge source="rt" value={omdbRatings.rt} />
              )}
              {omdbRatings?.metacritic && (
                <RatingBadge source="metacritic" value={omdbRatings.metacritic} />
              )}
            </div>

            {/* Action buttons (client component) */}
            <MovieDetailClient movie={details} trailerId={trailer?.key || null} />

            {/* Overview */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Overview</h2>
              <p className="text-ab-text-secondary leading-relaxed">
                {details.overview || omdb?.Plot || "No overview available."}
              </p>
            </div>

            {/* Credits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {director && (
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-ab-text-muted font-medium mb-1">
                    Director
                  </h3>
                  <p className="text-sm font-medium">{director.name}</p>
                </div>
              )}
              {writers.length > 0 && (
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-ab-text-muted font-medium mb-1">
                    Writers
                  </h3>
                  <p className="text-sm font-medium">
                    {writers.map((w) => w.name).join(", ")}
                  </p>
                </div>
              )}
              {omdb?.Awards && omdb.Awards !== "N/A" && (
                <div className="sm:col-span-2">
                  <h3 className="text-xs uppercase tracking-wider text-ab-text-muted font-medium mb-1 flex items-center gap-1.5">
                    <Award size={12} />
                    Awards
                  </h3>
                  <p className="text-sm font-medium text-ab-star">{omdb.Awards}</p>
                </div>
              )}
            </div>

            {/* Box Office */}
            {(details.budget > 0 || details.revenue > 0 || (omdb?.BoxOffice && omdb.BoxOffice !== "N/A")) && (
              <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-ab-border">
                {details.budget > 0 && (
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-ab-text-muted font-medium mb-1">
                      Budget
                    </h3>
                    <p className="text-sm font-medium flex items-center gap-1.5">
                      <DollarSign size={14} className="text-ab-text-muted" />
                      {formatCurrency(details.budget)}
                    </p>
                  </div>
                )}
                {details.revenue > 0 && (
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-ab-text-muted font-medium mb-1">
                      Revenue
                    </h3>
                    <p className="text-sm font-medium flex items-center gap-1.5">
                      <DollarSign size={14} className="text-ab-accent" />
                      {formatCurrency(details.revenue)}
                    </p>
                  </div>
                )}
                {omdb?.BoxOffice && omdb.BoxOffice !== "N/A" && (
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-ab-text-muted font-medium mb-1">
                      Box Office
                    </h3>
                    <p className="text-sm font-medium">{omdb.BoxOffice}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Cast ── */}
        {credits.cast.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold mb-4">Cast</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
              {credits.cast.slice(0, 20).map((member) => (
                <CastCard key={member.id} member={member} />
              ))}
            </div>
          </section>
        )}

        {/* ── Trailer ── */}
        {trailer && (
          <section className="mt-12">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Play size={20} className="text-ab-accent" />
              Trailer
            </h2>
            <div className="relative aspect-video max-w-4xl rounded-2xl overflow-hidden bg-ab-card poster-shadow">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}?rel=0&modestbranding=1`}
                className="w-full h-full"
                allow="encrypted-media; fullscreen"
                allowFullScreen
                title={`${details.title} Trailer`}
              />
            </div>
          </section>
        )}

        {/* ── Reviews ── */}
        {reviewsData.results.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold mb-4">
              Reviews{" "}
              <span className="text-sm font-normal text-ab-text-muted">
                ({reviewsData.total_results})
              </span>
            </h2>
            <div className="grid gap-4 max-w-4xl">
              {reviewsData.results.slice(0, 5).map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── Similar Movies ── */}
      {similar.length > 0 && (
        <div className="mt-12">
          <MovieRow title="Similar Movies" movies={similar} />
        </div>
      )}
    </div>
  );
}
