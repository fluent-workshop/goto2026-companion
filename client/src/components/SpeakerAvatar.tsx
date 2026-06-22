import { useState } from "react";
import { portraitSrc } from "@/lib/portrait";
import type { Speaker } from "@/lib/types";

interface Props {
  speaker: Pick<Speaker, "name" | "speaker_page_id" | "portrait_url">;
  className?: string;
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

/** Circular portrait with graceful fallback to initials. */
export default function SpeakerAvatar({ speaker, className = "" }: Props) {
  const [failed, setFailed] = useState(false);
  const src = portraitSrc(speaker);

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-navy-light font-semibold text-white/80 ${className}`}
      >
        {initials(speaker.name)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={speaker.name}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`rounded-full object-cover ${className}`}
    />
  );
}
