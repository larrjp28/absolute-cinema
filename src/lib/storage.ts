import { UserListItem, ListType } from "@/types";
import { TMDBMovie } from "@/types";

const STORAGE_KEYS: Record<ListType, string> = {
  favorites: "ab_favorites",
  watchlist: "ab_watchlist",
  watched: "ab_watched",
};

function getList(type: ListType): UserListItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS[type]);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveList(type: ListType, items: UserListItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS[type], JSON.stringify(items));
}

export function getFavorites(): UserListItem[] {
  return getList("favorites");
}

export function getWatchlist(): UserListItem[] {
  return getList("watchlist");
}

export function getWatched(): UserListItem[] {
  return getList("watched");
}

export function isInList(type: ListType, movieId: number): boolean {
  return getList(type).some((item) => item.id === movieId);
}

export function addToList(type: ListType, movie: TMDBMovie | UserListItem): void {
  const list = getList(type);
  if (list.some((item) => item.id === movie.id)) return;

  const newItem: UserListItem = {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    vote_average: movie.vote_average,
    release_date: movie.release_date || "",
    addedAt: new Date().toISOString(),
  };

  list.unshift(newItem);
  saveList(type, list);
}

export function removeFromList(type: ListType, movieId: number): void {
  const list = getList(type).filter((item) => item.id !== movieId);
  saveList(type, list);
}

export function toggleList(type: ListType, movie: TMDBMovie | UserListItem): boolean {
  if (isInList(type, movie.id)) {
    removeFromList(type, movie.id);
    return false;
  } else {
    addToList(type, movie);
    return true;
  }
}

export function getListCounts(): Record<ListType, number> {
  return {
    favorites: getList("favorites").length,
    watchlist: getList("watchlist").length,
    watched: getList("watched").length,
  };
}
