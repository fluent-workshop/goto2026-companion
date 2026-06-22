-- sessions: conference schedule entries
-- speaker_ids holds an array of speakers.id slugs; joined client-side
CREATE TABLE sessions (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  type        TEXT,
  date        DATE,
  day         TEXT,
  start_time  TEXT,
  end_time    TEXT,
  room        TEXT,
  speaker_ids TEXT[],
  tags        TEXT[],
  abstract    TEXT
);

CREATE INDEX sessions_date_idx ON sessions (date);

-- Public read-only access (no auth in phase 1)
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sessions are publicly readable"
  ON sessions FOR SELECT
  USING (true);
