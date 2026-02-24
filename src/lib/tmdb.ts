import {
  TMDBMovie,
  TMDBMovieDetail,
  TMDBCastMember,
  TMDBCrewMember,
  TMDBVideo,
  TMDBReview,
  TMDBPaginatedResponse,
  TMDBPersonDetail,
} from "@/types";
import { TMDB_API_BASE, TMDB_API_KEY } from "./constants";

async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const searchParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    ...params,
  });

  const res = await fetch(`${TMDB_API_BASE}${endpoint}?${searchParams}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/* ── Trending / Popular / Lists ── */

export async function getTrending(): Promise<TMDBMovie[]> {
  const data = await tmdbFetch<TMDBPaginatedResponse<TMDBMovie>>("/trending/movie/week");
  return data.results;
}

export async function getPopular(page = 1): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  return tmdbFetch<TMDBPaginatedResponse<TMDBMovie>>("/movie/popular", {
    page: String(page),
  });
}

export async function getTopRated(page = 1): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  return tmdbFetch<TMDBPaginatedResponse<TMDBMovie>>("/movie/top_rated", {
    page: String(page),
  });
}

export async function getUpcoming(page = 1): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  return tmdbFetch<TMDBPaginatedResponse<TMDBMovie>>("/movie/upcoming", {
    page: String(page),
  });
}

export async function getNowPlaying(page = 1): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  return tmdbFetch<TMDBPaginatedResponse<TMDBMovie>>("/movie/now_playing", {
    page: String(page),
  });
}

/* ── Movie Details ── */

export async function getMovieDetails(id: number | string): Promise<TMDBMovieDetail> {
  return tmdbFetch<TMDBMovieDetail>(`/movie/${id}`);
}

export async function getMovieCredits(
  id: number | string
): Promise<{ cast: TMDBCastMember[]; crew: TMDBCrewMember[] }> {
  return tmdbFetch<{ cast: TMDBCastMember[]; crew: TMDBCrewMember[] }>(`/movie/${id}/credits`);
}

export async function getMovieVideos(id: number | string): Promise<TMDBVideo[]> {
  const data = await tmdbFetch<{ results: TMDBVideo[] }>(`/movie/${id}/videos`);
  return data.results;
}

export async function getMovieReviews(
  id: number | string,
  page = 1
): Promise<TMDBPaginatedResponse<TMDBReview>> {
  return tmdbFetch<TMDBPaginatedResponse<TMDBReview>>(`/movie/${id}/reviews`, {
    page: String(page),
  });
}

export async function getSimilarMovies(id: number | string): Promise<TMDBMovie[]> {
  const data = await tmdbFetch<TMDBPaginatedResponse<TMDBMovie>>(`/movie/${id}/similar`);
  return data.results;
}

export async function getRecommendedMovies(id: number | string): Promise<TMDBMovie[]> {
  const data = await tmdbFetch<TMDBPaginatedResponse<TMDBMovie>>(`/movie/${id}/recommendations`);
  return data.results;
}

/* ── Search ── */

export async function searchMovies(
  query: string,
  page = 1,
  year?: string
): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  const params: Record<string, string> = {
    query,
    page: String(page),
    include_adult: "false",
  };
  if (year) params.year = year;

  return tmdbFetch<TMDBPaginatedResponse<TMDBMovie>>("/search/movie", params);
}

/* ── Discover ── */

export async function discoverMovies(
  genreId?: number,
  sortBy = "popularity.desc",
  page = 1,
  year?: string
): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  const params: Record<string, string> = {
    sort_by: sortBy,
    page: String(page),
    include_adult: "false",
    "vote_count.gte": "50",
  };
  if (genreId) params.with_genres = String(genreId);
  if (year) params.primary_release_year = year;

  return tmdbFetch<TMDBPaginatedResponse<TMDBMovie>>("/discover/movie", params);
}

/* ── Person ── */

export async function getPersonDetails(id: number | string): Promise<TMDBPersonDetail> {
  return tmdbFetch<TMDBPersonDetail>(`/person/${id}`);
}

export async function getPersonMovieCredits(id: number | string): Promise<{
  cast: (TMDBMovie & { character: string })[];
  crew: (TMDBMovie & { job: string })[];
}> {
  return tmdbFetch(`/person/${id}/movie_credits`);
}
