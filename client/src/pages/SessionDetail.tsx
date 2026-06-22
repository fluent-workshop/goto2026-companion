import { Link, useParams } from "react-router-dom";
import SpeakerAvatar from "@/components/SpeakerAvatar";
import TypeBadge from "@/components/TypeBadge";
import { ErrorState, Loading } from "@/components/States";
import {
  fetchSessionByDetailsUrl,
  fetchSpeakersByIds,
  useAsync,
} from "@/lib/data";
import { CONFERENCE } from "@/lib/copy";
import { formatDate, formatTimeRange } from "@/lib/format";

interface Props {
  kind: "masterclasses" | "sessions";
}

export default function SessionDetail({ kind }: Props) {
  const { id = "" } = useParams();
  const detailsUrl = `/accelerate-chicago-2026/${kind}/${id}`;

  const {
    data: session,
    loading,
    error,
  } = useAsync(() => fetchSessionByDetailsUrl(detailsUrl), [detailsUrl]);

  const { data: speakers } = useAsync(
    () => fetchSpeakersByIds(session?.speaker_ids ?? []),
    [session?.id],
  );

  if (loading) return <Loading label="Loading session…" />;
  if (error)
    return (
      <div className="px-4 py-12">
        <ErrorState error={error} />
      </div>
    );

  if (!session) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-navy">Session not found</h1>
        <Link
          to="/schedule"
          className="mt-4 inline-block text-sm font-semibold text-magenta hover:underline"
        >
          ← Back to schedule
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Dark navy header */}
      <div className="bg-navy text-white">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <Link
            to="/schedule"
            className="text-sm font-medium text-white/60 hover:text-white"
          >
            ← Back to schedule
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <TypeBadge type={session.type} />
            {(session.tags ?? []).slice(0, 4).map((t) => (
              <span
                key={t}
                className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white/70"
              >
                {t}
              </span>
            ))}
          </div>

          <h1 className="mt-4 max-w-4xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            {session.title}
          </h1>

          {/* Metadata row */}
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/80">
            <Meta label="Date" value={formatDate(session.date)} />
            <Meta
              label="Time"
              value={formatTimeRange(session.start_time, session.end_time)}
            />
            {session.room && <Meta label="Location" value={session.room} />}
          </div>
        </div>
      </div>

      {/* Body: description (left) + speakers (right) */}
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
          <article>
            <h2 className="mb-4 text-xl font-bold text-navy">About this session</h2>
            {session.description ? (
              <div
                className="session-prose max-w-none leading-relaxed text-navy/80"
                dangerouslySetInnerHTML={{ __html: session.description }}
              />
            ) : session.abstract ? (
              <p className="whitespace-pre-line leading-relaxed text-navy/80">
                {session.abstract}
              </p>
            ) : (
              <p className="text-sm italic text-navy/50">
                No description available for this session.
              </p>
            )}
          </article>

          {speakers && speakers.length > 0 && (
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-navy/50">
                {speakers.length === 1 ? "Speaker" : "Speakers"}
              </h2>
              <div className="space-y-3">
                {speakers.map((sp) => (
                  <Link
                    key={sp.id}
                    to={`/speakers/${sp.id}`}
                    className="flex items-center gap-3 rounded-xl border border-black/5 bg-white p-4 shadow-sm transition hover:shadow-md"
                  >
                    <SpeakerAvatar
                      speaker={sp}
                      className="h-14 w-14 shrink-0 ring-2 ring-mist"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-navy">{sp.name}</div>
                      {sp.title && (
                        <div className="line-clamp-2 text-xs text-navy/60">
                          {sp.title}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </aside>
          )}
        </div>

        <div className="mt-12">
          <a
            href={CONFERENCE.registerUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block rounded-lg bg-magenta px-6 py-3 text-sm font-semibold text-white transition hover:bg-magenta-dark"
          >
            Get your ticket
          </a>
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-magenta">{label}</div>
      <div className="mt-0.5 font-medium">{value}</div>
    </div>
  );
}
