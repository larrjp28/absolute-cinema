import { OMDbMovie } from "@/types";
import { OMDB_API_BASE, OMDB_API_KEY } from "./constants";

export async function getOMDbByImdbId(imdbId: string): Promise<OMDbMovie | null> {
  try {
    const res = await fetch(
      `${OMDB_API_BASE}/?i=${imdbId}&apikey=${OMDB_API_KEY}&plot=full`,
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) return null;

    const data = await res.json();
    if (data.Response === "False") return null;

    return data as OMDbMovie;
  } catch {
    return null;
  }
}

export async function searchOMDb(
  query: string,
  page = 1,
  type?: "movie" | "series" | "episode",
  year?: string
): Promise<{ Search?: OMDbMovie[]; totalResults?: string; Response: string }> {
  const params = new URLSearchParams({
    apikey: OMDB_API_KEY,
    s: query,
    page: String(page),
  });
  if (type) params.set("type", type);
  if (year) params.set("y", year);

  const res = await fetch(`${OMDB_API_BASE}/?${params}`);
  return res.json();
}

export function parseOMDbRating(ratings: { Source: string; Value: string }[] | undefined) {
  if (!ratings) return { imdb: null, rt: null, metacritic: null };

  const imdb = ratings.find((r) => r.Source === "Internet Movie Database");
  const rt = ratings.find((r) => r.Source === "Rotten Tomatoes");
  const metacritic = ratings.find((r) => r.Source === "Metacritic");

  return {
    imdb: imdb?.Value || null,
    rt: rt?.Value || null,
    metacritic: metacritic?.Value || null,
  };
}
