-- speakers: conference speaker profiles
-- id is the slug used as the /speakers/:id route param (e.g. scott-hanselman)
CREATE TABLE speakers (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  title           TEXT,
  company         TEXT,
  tags            TEXT[],
  speaker_page_id INTEGER,
  bio             TEXT,
  portrait_url    TEXT,
  profile_url     TEXT
);

-- Public read-only access (no auth in phase 1)
ALTER TABLE speakers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "speakers are publicly readable"
  ON speakers FOR SELECT
  USING (true);
