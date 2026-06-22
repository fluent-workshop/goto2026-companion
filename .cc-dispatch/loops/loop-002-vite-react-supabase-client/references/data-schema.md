# Data Schema — Sessions & Speakers

## sessions.json (31 records)

| Field | Type | Notes |
|-------|------|-------|
| id | string | slug, e.g. `masterclass-code-to-agents` |
| title | string | session title |
| type | string | `Masterclass`, `Talk`, `Keynote`, `Workshop`, `Panel`, `Lightning` etc. |
| date | string | `YYYY-MM-DD`, one of `2026-06-22`, `2026-06-23`, `2026-06-24` |
| day | string | human label, e.g. `Monday, June 22` |
| startTime | string | `HH:MM` 24h |
| endTime | string | `HH:MM` 24h |
| room | string | room name |
| speakers | string[] | array of speaker id slugs |
| tags | string[] | topic tags |
| abstract | string\|null | 3 sessions have null abstract (genuine gaps on live site) |

## speakers.json (32 records)

| Field | Type | Notes |
|-------|------|-------|
| id | string | slug, e.g. `scott-hanselman` — use as route param |
| name | string | full name |
| title | string | job title |
| company | string | employer |
| tags | string[] | topic tags |
| speakerPageId | number | numeric id from gotochgo.com (e.g. 4333) — matches portrait filename |
| bio | string\|null | 6 speakers have null bio (removed from live site or placeholder) |
| portraitUrl | string | CDN URL (live, use as fallback) |
| profileUrl | string | original speaker URL on gotochgo.com |

## Supabase migrations to write

### speakers table
```sql
CREATE TABLE speakers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT,
  company TEXT,
  tags TEXT[],
  speaker_page_id INTEGER,
  bio TEXT,
  portrait_url TEXT,
  profile_url TEXT
);
```

### sessions table
```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT,
  date DATE,
  day TEXT,
  start_time TEXT,
  end_time TEXT,
  room TEXT,
  speaker_ids TEXT[],
  tags TEXT[],
  abstract TEXT
);
```

## Notes
- sessions.speaker_ids stores the array of speaker id slugs — join to speakers.id client-side
- portrait filename: `.cache/web-scraping/gotochgo.com/assets/portraits/{speaker_page_id}.{ext}`
  where ext is png/jpg/jpeg (check what exists for each id)
