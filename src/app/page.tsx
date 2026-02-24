import { getTrending, getPopular, getTopRated, getUpcoming, getNowPlaying } from "@/lib/tmdb";
import { GENRES } from "@/lib/constants";
import Hero from "@/components/Hero";
import MovieRow from "@/components/MovieRow";

export const revalidate = 3600; // Revalidate every hour

export default async function HomePage() {
  let trending, popular, topRated, upcoming, nowPlaying;

  try {
    [trending, popular, topRated, upcoming, nowPlaying] = await Promise.all([
      getTrending(),
      getPopular(),
      getTopRated(),
      getUpcoming(),
      getNowPlaying(),
    ]);
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-ab-accent rounded-2xl flex items-center justify-center font-extrabold text-ab-primary text-2xl mx-auto mb-6">
            AB
          </div>
          <h1 className="text-2xl font-bold mb-3">Configuration Needed</h1>
          <p className="text-ab-text-secondary mb-6 leading-relaxed">
            To get started, you need a free TMDB API key. Visit{" "}
            <a
              href="https://www.themoviedb.org/settings/api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ab-accent hover:underline"
            >
              themoviedb.org/settings/api
            </a>{" "}
            to create your free account and get an API key.
          </p>
          <div className="bg-ab-card border border-ab-border rounded-xl p-4 text-left">
            <p className="text-xs text-ab-text-muted mb-2 font-medium uppercase tracking-wider">
              .env.local
            </p>
            <code className="text-sm text-ab-accent">
              NEXT_PUBLIC_TMDB_API_KEY=your_key_here
            </code>
          </div>
        </div>
      </div>
    );
  }

  const heroMovie = trending[0];
  const heroGenres = heroMovie?.genre_ids
    ?.map((id: number) => GENRES.find((g) => g.id === id)?.name)
    .filter(Boolean) as string[];

  return (
    <div className="pb-20 md:pb-0">
      {heroMovie && <Hero movie={heroMovie} genreNames={heroGenres} />}

      <div className="space-y-2 -mt-16 relative z-10">
        <MovieRow
          title="Trending This Week"
          movies={trending.slice(1)}
          seeAllHref="/browse?sort=popularity.desc"
        />
        <MovieRow
          title="Now Playing"
          movies={nowPlaying.results}
          seeAllHref="/browse?sort=primary_release_date.desc"
        />
        <MovieRow
          title="Popular"
          movies={popular.results}
          seeAllHref="/browse?sort=popularity.desc"
        />
        <MovieRow
          title="Top Rated"
          movies={topRated.results}
          seeAllHref="/browse?sort=vote_average.desc"
        />
        <MovieRow
          title="Upcoming"
          movies={upcoming.results}
          seeAllHref="/browse?sort=primary_release_date.desc"
        />
      </div>
    </div>
  );
}
