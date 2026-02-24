"use client";

import Image from "next/image";
import Link from "next/link";
import { TMDBCastMember } from "@/types";
import { getImageUrl } from "@/lib/constants";
import { User } from "lucide-react";

interface CastCardProps {
  member: TMDBCastMember;
}

export default function CastCard({ member }: CastCardProps) {
  return (
    <Link
      href={`/person/${member.id}`}
      className="shrink-0 w-[120px] sm:w-[140px] group"
    >
      <div className="relative w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] rounded-2xl overflow-hidden bg-ab-card">
        {member.profile_path ? (
          <Image
            src={getImageUrl(member.profile_path, "w185")}
            alt={member.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="140px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-ab-card">
            <User size={40} className="text-ab-text-muted" />
          </div>
        )}
      </div>
      <div className="mt-2 px-0.5">
        <p className="text-sm font-medium text-ab-text truncate group-hover:text-ab-accent transition-colors">
          {member.name}
        </p>
        <p className="text-xs text-ab-text-muted truncate mt-0.5">
          {member.character}
        </p>
      </div>
    </Link>
  );
}
