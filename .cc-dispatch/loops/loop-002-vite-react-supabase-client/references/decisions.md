# Design Decisions — Loop 002

These decisions were made by Cedric during planning. Follow them exactly.

## Fidelity
**Visual re-creation using our own React components.** Match the look and layout of the live
gotochgo.com site closely (using cached HTML + screenshots as spec), but write clean React/Tailwind
components — do NOT lift their Phoenix/server-rendered HTML or CSS class names verbatim.

## Scope — Core Four Pages Only
1. **Home** — `raw/pages/01-homepage.html` is the reference
2. **Speakers index** — `raw/pages/02-speakers.html` is the reference
3. **Speaker detail** — `raw/pages/speaker-4333.html` (Scott Hanselman) as primary reference;
   any speaker detail page works as the template
4. **Schedule** — `raw/pages/03-schedule.html` is the reference (3 day-tabs: Jun 22/23/24)

No registration form, no lead capture, no auth, no partners page in phase 1.

## Routes
Use React Router with these routes:
- `/` → Home
- `/speakers` → Speakers index
- `/speakers/:id` → Speaker detail (`:id` is the speaker `id` slug from data, e.g. `scott-hanselman`)
- `/schedule` → Schedule, default to first day (Jun 22)
- `/schedule?date=2026-06-23` → Schedule filtered to that day (query param routing)

Day-tabs on the schedule page update the query param — deep-linkable, survives refresh.

## Data — Supabase
- `speakers` and `sessions` tables in Supabase (local instance, `supabase start`)
- Seed from `.cache/web-scraping/gotochgo.com/data/sessions.json` and `speakers.json`
- React client reads data via `@supabase/supabase-js` directly (no Bun server proxy for data)
- One-off static copy (hero taglines, nav labels, footer text) can live in TSX constants or a
  simple `src/lib/copy.ts` file — no i18n library needed for phase 1

## Portraits
Portrait images are cached at `.cache/web-scraping/gotochgo.com/assets/portraits/{speakerPageId}.{ext}`
where `speakerPageId` matches the numeric field on each speaker record.
The portrait filenames use the speakerPageId (e.g. `4333.png` for Scott Hanselman).
Serve them from the Vite dev server by copying to `client/public/portraits/` or symlinking.
The `portraitUrl` field on each speaker also points to the live CDN URL — use that as fallback.

## Bun Server
Keep `src/server.ts` but strip it to `/api/chat` and `/api/health` only.
Remove `/api/sessions` and `/api/speakers` — data comes from Supabase JS client directly.

## Do NOT use
- `base44-original/` — ignore entirely
- The live site CSS classes or Phoenix template markup
- Any base44 SDK
