import Link from "next/link";
import Image from "next/image";
import { Github, Heart } from "lucide-react";
import { GENRES } from "@/lib/constants";

export default function Footer() {
  const topGenres = GENRES.slice(0, 8);

  return (
    <footer className="bg-ab-secondary border-t border-ab-border mt-16 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 bg-ab-accent rounded-lg flex items-center justify-center font-extrabold text-white text-sm group-hover:bg-ab-accent-dark transition-colors">
                AB
              </div>
              <span className="text-lg font-bold">
                Absolute<span className="text-ab-accent">Cinema</span>
              </span>
            </Link>
            <p className="text-sm text-ab-text-muted leading-relaxed">
              Your ultimate guide to the world of cinema. Discover movies, read
              reviews, watch trailers, and build your personal watchlist.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-ab-text uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: "Home" },
                { href: "/browse", label: "Browse Movies" },
                { href: "/my-lists", label: "My Lists" },
                { href: "/search?q=popular", label: "Search" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ab-text-secondary hover:text-ab-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h3 className="text-sm font-semibold text-ab-text uppercase tracking-wider mb-4">
              Genres
            </h3>
            <ul className="space-y-2.5">
              {topGenres.map((genre: { id: number; name: string }) => (
                <li key={genre.id}>
                  <Link
                    href={`/browse?genre=${genre.id}`}
                    className="text-sm text-ab-text-secondary hover:text-ab-accent transition-colors"
                  >
                    {genre.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* APIs */}
          <div>
            <h3 className="text-sm font-semibold text-ab-text uppercase tracking-wider mb-4">
              Powered By
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://www.themoviedb.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ab-text-secondary hover:text-ab-accent transition-colors"
                >
                  The Movie Database (TMDB)
                </a>
              </li>
              <li>
                <a
                  href="https://www.omdbapi.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ab-text-secondary hover:text-ab-accent transition-colors"
                >
                  OMDb API
                </a>
              </li>
              <li>
                <a
                  href="https://nextjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ab-text-secondary hover:text-ab-accent transition-colors"
                >
                  Next.js
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-ab-border mt-10 pt-6">
          {/* Developer Credits */}
          <div className="flex flex-col items-center gap-4 mb-6">
            <span className="text-xs uppercase tracking-wider text-ab-text-muted font-medium">Built by</span>
            <div className="flex items-center gap-6">
              {/* larrjp28 — Lead Dev (first) */}
              <a
                href="https://github.com/larrjp28"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-ab-accent/40 group-hover:ring-ab-accent transition-all duration-200">
                    <Image
                      src="https://avatars.githubusercontent.com/larrjp28"
                      alt="larrjp28"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] px-1.5 py-0.5 rounded-full bg-ab-accent text-white font-bold uppercase tracking-wider whitespace-nowrap">
                    Lead Dev
                  </span>
                </div>
                <span className="flex items-center gap-1 text-sm font-semibold text-ab-text group-hover:text-ab-accent transition-colors mt-1">
                  <Github size={13} />
                  larrjp28
                </span>
              </a>

              {/* httpsdave */}
              <a
                href="https://github.com/httpsdave"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-white/30 transition-all duration-200">
                  <Image
                    src="https://avatars.githubusercontent.com/httpsdave"
                    alt="httpsdave"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="flex items-center gap-1 text-sm font-semibold text-ab-text group-hover:text-ab-accent transition-colors">
                  <Github size={13} />
                  httpsdave
                </span>
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-ab-text-muted">
              &copy; {new Date().getFullYear()} AbsoluteCinema. This product uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
            <p className="flex items-center gap-1 text-xs text-ab-text-muted">
              Made with <Heart size={12} className="text-red-400" fill="currentColor" /> for cinema lovers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
