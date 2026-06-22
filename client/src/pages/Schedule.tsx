import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SessionCard from "@/components/SessionCard";
import CategoryFilter, {
  type FilterOption,
} from "@/components/CategoryFilter";
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

  // Fetch all sessions once so the filter universe is stable across days.
  const sessions = useAsync(fetchSessions, []);
  const speakers = useAsync(fetchSpeakers, []);

  const [selected, setSelected] = useState<Set<string>>(new Set());

  const speakerMap = useMemo(() => {
    const map = new Map<string, Speaker>();
    (speakers.data ?? []).forEach((s) => map.set(s.id, s));
    return map;
  }, [speakers.data]);

  // Build the filter pill list (types first, then tags) from all sessions.
  const options = useMemo<FilterOption[]>(() => {
    const all = sessions.data ?? [];
    const types: string[] = [];
    const tags: string[] = [];
    for (const s of all) {
      if (s.type && !types.includes(s.type)) types.push(s.type);
      for (const t of s.tags ?? []) if (!tags.includes(t)) tags.push(t);
    }
    tags.sort((a, b) => a.localeCompare(b));
    return [
      ...types.map((value) => ({ value, kind: "type" as const })),
      ...tags.map((value) => ({ value, kind: "tag" as const })),
    ];
  }, [sessions.data]);

  // Sessions for the selected day, narrowed by any selected pills (OR semantics).
  const daySessions = useMemo(() => {
    const all = sessions.data ?? [];
    return all
      .filter((s) => s.date === date)
      .filter((s) => {
        if (selected.size === 0) return true;
        if (s.type && selected.has(s.type)) return true;
        return (s.tags ?? []).some((t) => selected.has(t));
      });
  }, [sessions.data, date, selected]);

  const toggle = (value: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });

  const selectDay = (d: string) =>
    setParams(d === DEFAULT_DATE ? {} : { date: d });

  const activeDay = DAYS.find((d) => d.date === date)!;
  const filtersActive = selected.size > 0;

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

      {/* Category filter */}
      {options.length > 0 && (
        <CategoryFilter
          options={options}
          selected={selected}
          onToggle={toggle}
          onClear={() => setSelected(new Set())}
        />
      )}

      <p className="mt-6 text-lg font-semibold text-navy/70">
        {formatDate(activeDay.date)}
        {filtersActive && (
          <span className="ml-2 text-sm font-normal text-navy/50">
            · {daySessions.length}{" "}
            {daySessions.length === 1 ? "match" : "matches"}
          </span>
        )}
      </p>

      <div className="mt-4">
        {sessions.loading && <Loading label="Loading sessions…" />}
        {sessions.error && <ErrorState error={sessions.error} />}
        {sessions.data && daySessions.length === 0 && (
          <Empty
            message={
              filtersActive
                ? "No sessions match the selected filters for this day."
                : "No sessions scheduled for this day."
            }
          />
        )}
        {daySessions.length > 0 && (
          <div className="space-y-3">
            {daySessions.map((s) => (
              <SessionCard key={s.id} session={s} speakers={speakerMap} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
