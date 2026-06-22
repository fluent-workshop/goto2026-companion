import { useMemo, useState } from "react";
import SpeakerCard from "@/components/SpeakerCard";
import { Empty, ErrorState, Loading } from "@/components/States";
import { fetchSpeakers, useAsync } from "@/lib/data";

export default function Speakers() {
  const { data, loading, error } = useAsync(fetchSpeakers, []);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((s) =>
      [s.name, s.title, s.company]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(q)),
    );
  }, [data, query]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-navy">
          Speakers
        </h1>
        <p className="mt-2 max-w-2xl text-navy/60">
          The minds taking the stage in Chicago — engineers, architects, and
          practitioners shaping how software gets built.
        </p>
        <div className="mt-6 max-w-md">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, title, or company…"
            className="w-full rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm shadow-sm outline-none transition focus:border-magenta focus:ring-2 focus:ring-magenta/20"
          />
        </div>
      </header>

      {loading && <Loading label="Loading speakers…" />}
      {error && <ErrorState error={error} />}
      {data && filtered.length === 0 && (
        <Empty message={`No speakers match “${query}”.`} />
      )}

      {data && filtered.length > 0 && (
        <>
          <p className="mb-4 text-sm text-navy/50">
            {filtered.length} {filtered.length === 1 ? "speaker" : "speakers"}
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => (
              <SpeakerCard key={s.id} speaker={s} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
