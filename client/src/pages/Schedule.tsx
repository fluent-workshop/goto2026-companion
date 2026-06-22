import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import SessionCard from "@/components/SessionCard";
import { Empty, ErrorState, Loading } from "@/components/States";
import { fetchSessions, fetchSpeakers, useAsync } from "@/lib/data";
import { DAYS } from "@/lib/copy";
import { formatDate } from "@/lib/format";
import type { Speaker } from "@/lib/types";

const DEFAULT_DATE = DAYS[0].date;
const VALID = new Set(DAYS.map((d) => d.date));

export default function Schedule() {
  const [params, setParams] = useSearchParams();
  const raw = params.get("date");
  const date = raw && VALID.has(raw) ? raw : DEFAULT_DATE;

  const sessions = useAsync(() => fetchSessions(date), [date]);
  const speakers = useAsync(fetchSpeakers, []);

  const speakerMap = useMemo(() => {
    const map = new Map<string, Speaker>();
    (speakers.data ?? []).forEach((s) => map.set(s.id, s));
    return map;
  }, [speakers.data]);

  const selectDay = (d: string) =>
    setParams(d === DEFAULT_DATE ? {} : { date: d });

  const activeDay = DAYS.find((d) => d.date === date)!;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-4xl font-extrabold tracking-tight text-navy">
        Schedule
      </h1>

      {/* Day tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {DAYS.map((d) => {
          const active = d.date === date;
          return (
            <button
              key={d.date}
              type="button"
              onClick={() => selectDay(d.date)}
              className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                active
                  ? "bg-navy text-white shadow"
                  : "bg-white text-navy/70 hover:bg-white hover:text-navy"
              }`}
            >
              <span className="block">{d.weekday}</span>
              <span
                className={`block text-xs font-normal ${
                  active ? "text-white/70" : "text-navy/50"
                }`}
              >
                {d.label}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-lg font-semibold text-navy/70">
        {formatDate(activeDay.date)}
      </p>

      <div className="mt-4">
        {sessions.loading && <Loading label="Loading sessions…" />}
        {sessions.error && <ErrorState error={sessions.error} />}
        {sessions.data && sessions.data.length === 0 && (
          <Empty message="No sessions scheduled for this day." />
        )}
        {sessions.data && sessions.data.length > 0 && (
          <div className="space-y-3">
            {sessions.data.map((s) => (
              <SessionCard key={s.id} session={s} speakers={speakerMap} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
