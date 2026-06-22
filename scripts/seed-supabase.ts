#!/usr/bin/env bun
/**
 * Seed the local Supabase instance with scraped GOTO Accelerate Chicago 2026 data.
 *
 * Source of truth (read-only):
 *   .cache/web-scraping/gotochgo.com/data/speakers.json  (31 speakers)
 *   .cache/web-scraping/gotochgo.com/data/sessions.json  (31 sessions)
 *
 * The cache uses a numeric `id` for each speaker (e.g. 4333 = Scott Hanselman),
 * which also matches the portrait filename. The app routes on a human slug
 * (e.g. /speakers/scott-hanselman), so we derive a slug from the name and use
 * that as the table primary key, keeping the numeric id as `speaker_page_id`.
 * Sessions reference speakers by numeric id; we remap those to slugs.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const CACHE = resolve(
  import.meta.dir,
  "../.cache/web-scraping/gotochgo.com/data",
);

const SUPABASE_URL = process.env.SUPABASE_URL ?? "http://localhost:54321";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error(
    "✗ SUPABASE_SERVICE_ROLE_KEY is required (get it from `supabase status`).",
  );
  process.exit(1);
}

const slugify = (name: string): string =>
  name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

// Cache shapes
interface RawSpeaker {
  id: number;
  name: string;
  title: string | null;
  company: string | null;
  portraitUrl: string | null;
  profileUrl: string | null;
  bio: string | null;
}
interface RawSession {
  id: string;
  title: string;
  type: string;
  date: string;
  day: string;
  startTime: string; // ISO datetime
  endTime: string;
  room: string;
  speakers: number[];
  tags: string[];
  abstract: string | null;
}

const speakers: RawSpeaker[] = JSON.parse(
  readFileSync(resolve(CACHE, "speakers.json"), "utf8"),
);
const sessions: RawSession[] = JSON.parse(
  readFileSync(resolve(CACHE, "sessions.json"), "utf8"),
);

// numeric id -> slug map for remapping session speaker references
const idToSlug = new Map<number, string>(
  speakers.map((s) => [s.id, slugify(s.name)]),
);

// "2026-06-22T09:00:00" -> "09:00"
const toHHMM = (iso: string): string => {
  const t = iso.split("T")[1] ?? "";
  return t.slice(0, 5);
};

// The live schedule API carries the canonical details URL and the full HTML
// description (richer than sessions.json's plain abstract). Match by title.
interface ScheduleSession {
  title: string;
  details_url: string | null;
  description: string | null;
}
const scheduleData = JSON.parse(
  readFileSync(resolve(CACHE, "../raw/api/schedule-data.json"), "utf8"),
) as {
  schedule_data: {
    days: { time_slots: { sessions: ScheduleSession[] }[] }[];
  };
};

const detailsByTitle = new Map<string, { details_url: string | null; description: string | null }>();
for (const day of scheduleData.schedule_data.days) {
  for (const slot of day.time_slots ?? []) {
    for (const s of slot.sessions ?? []) {
      detailsByTitle.set(s.title, {
        details_url: s.details_url ?? null,
        description: s.description ?? null,
      });
    }
  }
}

const speakerRows = speakers.map((s) => ({
  id: slugify(s.name),
  name: s.name,
  title: s.title,
  company: s.company,
  tags: [] as string[], // cache has no per-speaker tags
  speaker_page_id: s.id,
  bio: s.bio,
  portrait_url: s.portraitUrl,
  profile_url: s.profileUrl,
}));

const sessionRows = sessions.map((s) => ({
  id: s.id,
  title: s.title,
  type: s.type,
  date: s.date,
  day: s.day,
  start_time: toHHMM(s.startTime),
  end_time: toHHMM(s.endTime),
  room: s.room,
  speaker_ids: s.speakers
    .map((n) => idToSlug.get(n))
    .filter((v): v is string => Boolean(v)),
  tags: s.tags ?? [],
  abstract: s.abstract,
  details_url: detailsByTitle.get(s.title)?.details_url ?? null,
  description: detailsByTitle.get(s.title)?.description ?? null,
}));

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function main() {
  const { error: spErr } = await supabase
    .from("speakers")
    .upsert(speakerRows, { onConflict: "id" });
  if (spErr) throw spErr;

  const { error: seErr } = await supabase
    .from("sessions")
    .upsert(sessionRows, { onConflict: "id" });
  if (seErr) throw seErr;

  const { count: spCount } = await supabase
    .from("speakers")
    .select("*", { count: "exact", head: true });
  const { count: seCount } = await supabase
    .from("sessions")
    .select("*", { count: "exact", head: true });

  console.log(`✓ ${seCount} sessions, ${spCount} speakers inserted`);
}

main().catch((err) => {
  console.error("✗ Seed failed:", err.message ?? err);
  process.exit(1);
});
