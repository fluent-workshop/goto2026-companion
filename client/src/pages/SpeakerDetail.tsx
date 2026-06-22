import { Link, useParams } from "react-router-dom";
import SpeakerAvatar from "@/components/SpeakerAvatar";
import TypeBadge from "@/components/TypeBadge";
import { ErrorState, Loading } from "@/components/States";
import {
  fetchSessionsBySpeaker,
  fetchSpeaker,
  useAsync,
} from "@/lib/data";
import { formatDate, formatTime, sessionPath } from "@/lib/format";

export default function SpeakerDetail() {
  const { id = "" } = useParams();
  const { data: speaker, loading, error } = useAsync(
    () => fetchSpeaker(id),
    [id],
  );
  const { data: sessions } = useAsync(() => fetchSessionsBySpeaker(id), [id]);

  if (loading) return <Loading label="Loading speaker…" />;
  if (error) return <div className="px-4 py-12"><ErrorState error={error} /></div>;

  if (!speaker) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-navy">Speaker not found</h1>
        <Link
          to="/speakers"
          className="mt-4 inline-block text-sm font-semibold text-magenta hover:underline"
        >
          ← Back to all speakers
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header band */}
      <div className="bg-navy text-white">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <Link
            to="/speakers"
            className="text-sm font-medium text-white/60 hover:text-white"
          >
            ← All speakers
          </Link>
          <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-end">
            <SpeakerAvatar
              speaker={speaker}
              className="h-40 w-40 shrink-0 ring-4 ring-magenta/40"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                {speaker.name}
              </h1>
              {speaker.title && (
                <p className="mt-2 text-lg text-white/80">{speaker.title}</p>
              )}
              {speaker.company && (
                <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-magenta">
                  {speaker.company}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        {/* Sessions */}
        {sessions && sessions.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 text-xl font-bold text-navy">
              Talks at Accelerate Chicago 2026
            </h2>
            <div className="space-y-3">
              {sessions.map((s) => (
                <Link
                  key={s.id}
                  to={sessionPath(s)}
                  className="block rounded-xl border border-black/5 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <TypeBadge type={s.type} />
                    <span className="text-xs text-navy/50">
                      {formatDate(s.date)} · {formatTime(s.start_time)}
                    </span>
                  </div>
                  <h3 className="mt-2 font-semibold text-navy">{s.title}</h3>
                  {s.room && (
                    <p className="mt-1 text-xs text-navy/50">{s.room}</p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Bio */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-navy">About</h2>
          {speaker.bio ? (
            <p className="whitespace-pre-line leading-relaxed text-navy/80">
              {speaker.bio}
            </p>
          ) : (
            <p className="text-sm italic text-navy/50">
              No biography available for this speaker.
            </p>
          )}
          {speaker.profile_url && (
            <a
              href={speaker.profile_url}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-block text-sm font-semibold text-magenta hover:underline"
            >
              View on gotochgo.com →
            </a>
          )}
        </section>
      </div>
    </div>
  );
}
