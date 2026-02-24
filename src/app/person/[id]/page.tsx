import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, MapPin, User } from "lucide-react";
import { getPersonDetails, getPersonMovieCredits } from "@/lib/tmdb";
import { getImageUrl } from "@/lib/constants";
import MovieRow from "@/components/MovieRow";

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const person = await getPersonDetails(params.id);
    return {
      title: `${person.name} — AbsoluteCinema`,
      description: person.biography?.slice(0, 160),
    };
  } catch {
    return { title: "Person — AbsoluteCinema" };
  }
}

export default async function PersonPage({ params }: PageProps) {
  let person;
  try {
    person = await getPersonDetails(params.id);
  } catch {
    notFound();
  }

  const credits = await getPersonMovieCredits(params.id).catch(() => ({
    cast: [],
    crew: [],
  }));

  // Sort by popularity/date
  const actingCredits = [...credits.cast]
    .filter((m) => m.poster_path)
    .sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));

  const directingCredits = credits.crew
    .filter((m) => m.job === "Director" && m.poster_path)
    .sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));

  const calculateAge = (birthday: string, deathday?: string | null) => {
    const end = deathday ? new Date(deathday) : new Date();
    const birth = new Date(birthday);
    let age = end.getFullYear() - birth.getFullYear();
    const m = end.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && end.getDate() < birth.getDate())) age--;
    return age;
  };

  return (
    <div className="min-h-screen pt-24 pb-20 md:pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Photo */}
          <div className="shrink-0 mx-auto md:mx-0">
            <div className="relative w-[200px] sm:w-[240px] aspect-[2/3] rounded-2xl overflow-hidden bg-ab-card poster-shadow">
              {person.profile_path ? (
                <Image
                  src={getImageUrl(person.profile_path, "w500")}
                  alt={person.name}
                  fill
                  className="object-cover"
                  sizes="240px"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User size={64} className="text-ab-text-muted" />
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-center md:text-left">
              {person.name}
            </h1>

            <p className="text-sm text-ab-accent mb-4 text-center md:text-left">
              {person.known_for_department}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6 text-sm text-ab-text-secondary">
              {person.birthday && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {new Date(person.birthday).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {" "}
                  ({calculateAge(person.birthday, person.deathday)} years
                  {person.deathday ? " at death" : " old"})
                </span>
              )}
              {person.place_of_birth && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  {person.place_of_birth}
                </span>
              )}
            </div>

            {/* Bio */}
            {person.biography && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Biography</h2>
                <p className="text-ab-text-secondary leading-relaxed whitespace-pre-line text-sm">
                  {person.biography}
                </p>
              </div>
            )}

            {/* Stats */}
            <div className="flex gap-6">
              <div>
                <p className="text-2xl font-bold text-ab-accent">{actingCredits.length}</p>
                <p className="text-xs text-ab-text-muted uppercase tracking-wider">Acting Credits</p>
              </div>
              {directingCredits.length > 0 && (
                <div>
                  <p className="text-2xl font-bold text-ab-indigo">{directingCredits.length}</p>
                  <p className="text-xs text-ab-text-muted uppercase tracking-wider">Directing Credits</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filmography */}
        {actingCredits.length > 0 && (
          <div className="mt-12">
            <MovieRow title="Known For" movies={actingCredits.slice(0, 20)} />
          </div>
        )}
        {directingCredits.length > 0 && (
          <div className="mt-4">
            <MovieRow title="Directed" movies={directingCredits.slice(0, 20)} />
          </div>
        )}
      </div>
    </div>
  );
}
