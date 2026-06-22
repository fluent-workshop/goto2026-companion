import { Link } from "react-router-dom";
import SpeakerAvatar from "./SpeakerAvatar";
import type { Speaker } from "@/lib/types";

export default function SpeakerCard({ speaker }: { speaker: Speaker }) {
  return (
    <Link
      to={`/speakers/${speaker.id}`}
      className="group flex flex-col items-center rounded-xl border border-black/5 bg-white p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <SpeakerAvatar
        speaker={speaker}
        className="h-28 w-28 ring-4 ring-mist transition group-hover:ring-magenta/20"
      />
      <h3 className="mt-4 text-base font-bold text-navy">{speaker.name}</h3>
      {speaker.title && (
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-navy/60">
          {speaker.title}
        </p>
      )}
      {speaker.company && (
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-magenta/80">
          {speaker.company}
        </p>
      )}
    </Link>
  );
}
