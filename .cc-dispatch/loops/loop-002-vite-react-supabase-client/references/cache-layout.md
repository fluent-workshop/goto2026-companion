# Cache Layout — What's Available and How to Use It

All scraped assets live at:
`.cache/web-scraping/gotochgo.com/`  (relative to repo root)

## Structured Data (source of truth for seeding)

**Absolute paths — use these exactly:**
```
/Users/openclaw/src/spantree/goto-accelerate-companion/.cache/web-scraping/gotochgo.com/data/sessions.json
/Users/openclaw/src/spantree/goto-accelerate-companion/.cache/web-scraping/gotochgo.com/data/speakers.json
```
Fields — sessions: `id, title, type, date, day, startTime, endTime, room, speakers[], tags[], abstract`
Fields — speakers: `id, name, title, company, tags[], speakerPageId, bio, portraitUrl, profileUrl`

**Do NOT use `data/sessions.json` or `data/speakers.json` in the repo root** — those are stale copies.

## Raw HTML (visual fidelity reference)
```
raw/pages/01-homepage.html       # Home page — inspect for layout, nav, hero, sections
raw/pages/02-speakers.html       # Speakers index — grid/card layout reference
raw/pages/03-schedule.html       # Schedule page — day-tab layout, session cards
raw/pages/04-partners.html       # Partners/sponsors — NOT in scope for phase 1
raw/pages/schedule.html          # Alternate schedule capture
raw/pages/speaker-{id}.html      # 30 individual speaker detail pages
```
Parse HTML with cheerio or read directly. These are the ground truth for what to recreate visually.
The live site is Phoenix/Elixir server-rendered — extract the rendered DOM structure for reference,
but write your own clean React/Tailwind markup.

## Schedule API JSON
```
raw/api/schedule-data.json       # Live API response: {schedule_data: {days: [{date, time_slots: [...]}]}}
```
Richer than sessions.json in some ways — has `time_slots` with nested sessions, room info.
Good supplementary reference for the schedule page logic.

## Portrait Images
```
assets/portraits/{speakerPageId}.{ext}    # ext is png, jpg, or jpeg depending on the speaker
```
The `speakerPageId` field on each speaker record (e.g. 4333 for Scott Hanselman) matches
the portrait filename. Copy or symlink the portraits directory into `client/public/portraits/`
so Vite serves them as `/portraits/4333.png` etc.

## Screenshots (visual reference)
```
screenshots/01-homepage.png
screenshots/02-speakers.png
screenshots/03-schedule.png
screenshots/04-partners.png
```
Use these as a quick visual reference for layout/color. The raw HTML is more precise.
