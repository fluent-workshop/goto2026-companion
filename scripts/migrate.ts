#!/usr/bin/env bun
/**
 * Creates the database schema for goto-accelerate-companion.
 * Run: bun run migrate
 */
import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/goto_companion";
const sql = postgres(DATABASE_URL);

async function migrate() {
  console.log("Running migrations...");

  await sql`
    CREATE TABLE IF NOT EXISTS speakers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      title TEXT,
      company TEXT,
      bio TEXT,
      photo_url TEXT,
      tags TEXT[] DEFAULT '{}',
      speaker_page_id INTEGER,
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      date DATE NOT NULL,
      day TEXT,
      start_time TIME,
      end_time TIME,
      room TEXT,
      tags TEXT[] DEFAULT '{}',
      abstract TEXT,
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS session_speakers (
      session_id TEXT REFERENCES sessions(id) ON DELETE CASCADE,
      speaker_id TEXT REFERENCES speakers(id) ON DELETE CASCADE,
      PRIMARY KEY (session_id, speaker_id)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id SERIAL PRIMARY KEY,
      session_id TEXT NOT NULL DEFAULT gen_random_uuid()::text,
      role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(date)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_sessions_type ON sessions(type)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_chat_session ON chat_messages(session_id)`;

  console.log("✓ Migrations complete");
  await sql.end();
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
