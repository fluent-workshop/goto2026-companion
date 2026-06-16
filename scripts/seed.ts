#!/usr/bin/env bun
/**
 * Seeds the database from data/speakers.json and data/sessions.json
 * Run: bun run seed
 */
import postgres from "postgres";
import { readFileSync } from "fs";
import { join } from "path";

const DATABASE_URL = process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/goto_companion";
const sql = postgres(DATABASE_URL);
const ROOT = join(import.meta.dir, "..");

async function seed() {
  console.log("Seeding speakers...");
  const speakers = JSON.parse(readFileSync(join(ROOT, "data/speakers.json"), "utf8"));
  for (const speaker of speakers) {
    await sql`
      INSERT INTO speakers (id, name, title, company, tags, speaker_page_id)
      VALUES (${speaker.id}, ${speaker.name}, ${speaker.title}, ${speaker.company}, ${speaker.tags}, ${speaker.speakerPageId ?? null})
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        title = EXCLUDED.title,
        company = EXCLUDED.company,
        tags = EXCLUDED.tags
    `;
  }
  console.log(`✓ Seeded ${speakers.length} speakers`);

  console.log("Seeding sessions...");
  const sessions = JSON.parse(readFileSync(join(ROOT, "data/sessions.json"), "utf8"));
  for (const session of sessions) {
    await sql`
      INSERT INTO sessions (id, title, type, date, day, start_time, end_time, room, tags, abstract)
      VALUES (
        ${session.id}, ${session.title}, ${session.type},
        ${session.date}, ${session.day},
        ${session.startTime + ":00"}, ${session.endTime + ":00"},
        ${session.room}, ${session.tags}, ${session.abstract}
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        type = EXCLUDED.type,
        date = EXCLUDED.date,
        start_time = EXCLUDED.start_time,
        end_time = EXCLUDED.end_time,
        room = EXCLUDED.room,
        tags = EXCLUDED.tags,
        abstract = EXCLUDED.abstract
    `;

    // Link speakers
    await sql`DELETE FROM session_speakers WHERE session_id = ${session.id}`;
    for (const speakerId of session.speakers) {
      await sql`
        INSERT INTO session_speakers (session_id, speaker_id)
        VALUES (${session.id}, ${speakerId})
        ON CONFLICT DO NOTHING
      `;
    }
  }
  console.log(`✓ Seeded ${sessions.length} sessions`);

  await sql.end();
  console.log("Done.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
