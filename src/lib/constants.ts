export const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "";
export const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY || "42b62f24";
export const TMDB_API_BASE = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";
export const OMDB_API_BASE = "https://www.omdbapi.com";

export const GENRES: { id: number; name: string }[] = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

export const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "popularity.asc", label: "Least Popular" },
  { value: "vote_average.desc", label: "Highest Rated" },
  { value: "vote_average.asc", label: "Lowest Rated" },
  { value: "vote_count.desc", label: "Most Voted" },
  { value: "primary_release_date.desc", label: "Newest First" },
  { value: "primary_release_date.asc", label: "Oldest First" },
  { value: "revenue.desc", label: "Highest Revenue" },
  { value: "revenue.asc", label: "Lowest Revenue" },
  { value: "original_title.asc", label: "Title A–Z" },
  { value: "original_title.desc", label: "Title Z–A" },
];

export function getGenreName(id: number): string {
  return GENRES.find((g) => g.id === id)?.name || "Unknown";
}

export function getImageUrl(
  path: string | null,
  size: "w92" | "w185" | "w342" | "w500" | "w780" | "original" = "w500"
): string {
  if (!path) return "/no-poster.svg";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}
