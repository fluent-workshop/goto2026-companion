import { Link } from "react-router-dom";
import TypeBadge from "./TypeBadge";
import { formatTimeRange, sessionPath } from "@/lib/format";
import type { Session, Speaker } from "@/lib/types";

interface Props {
  session: Session;
  speakers: Map<string, Speaker>;
}

export default function SessionCard({ session, speakers }: Props) {
  const people = (session.speaker_ids ?? [])
    .map((id) => speakers.get(id))
    .filter((s): s is Speaker => Boolean(s));
  const detailPath = sessionPath(session);
  const hasDetail = detailPath !== "/schedule";

  return (
    <article className="overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm">
      <div className="flex flex-col gap-4 p-5 sm:flex-row">
        {/* Time rail */}
        <div className="shrink-0 sm:w-36">
          <div className="text-sm font-bold text-navy">
            {formatTimeRange(session.start_time, session.end_time)}
          </div>
          {session.room && (
            <div className="mt-1 text-xs text-navy/50">{session.room}</div>
          )}
        </div>

        {/* Body */}
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <TypeBadge type={session.type} />
            {(session.tags ?? []).slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-full bg-mist px-2 py-0.5 text-[11px] font-medium text-navy/60"
              >
                {t}
              </span>
            ))}
          </div>

          <h3 className="text-lg font-bold leading-snug text-navy">
            {hasDetail ? (
              <Link to={detailPath} className="hover:text-magenta">
                {session.title}
              </Link>
            ) : (
              session.title
            )}
          </h3>

          {people.length > 0 && (
            <p className="mt-1.5 text-sm text-navy/60">
              {people.map((p, i) => (
                <span key={p.id}>
                  {i > 0 && ", "}
                  <Link
                    to={`/speakers/${p.id}`}
                    className="font-medium text-navy hover:text-magenta hover:underline"
                  >
                    {p.name}
                  </Link>
                </span>
              ))}
            </p>
          )}

          {hasDetail && (
            <Link
              to={detailPath}
              className="mt-3 inline-block text-sm font-semibold text-magenta hover:underline"
            >
              View session →
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
