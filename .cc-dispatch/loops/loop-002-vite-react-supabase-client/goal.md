---
linear_url: https://linear.app/spantree/issue/GOT-562
---

# Loop 002 — Vite+React+Supabase Client: Core Four Pages

## Objective

Scaffold and build a complete Vite+React+Supabase frontend that visually recreates the live
GOTO Accelerate Chicago 2026 site. The cached raw HTML at
`.cache/web-scraping/gotochgo.com/raw/pages/` is the visual fidelity spec. Write clean
React+Tailwind components that match the layout, colors, and content — not a DOM lift.

---

## Root Cause / Context

The `client/` directory exists but `client/src/` is empty — no Vite setup, no components.
The Bun server has `/api/sessions` and `/api/speakers` endpoints that are no longer needed
once Supabase serves data directly to the React client.

The `base44-original/` folder exists but **must not be used** — it's a redesign that never
launched. The only reference is the cached live site HTML.

---

## Phase A — Supabase Init

1. Run `supabase init` in the repo root.
2. Write `supabase/migrations/20260622000001_create_speakers.sql` — speakers table (see data-schema.md for SQL).
3. Write `supabase/migrations/20260622000002_create_sessions.sql` — sessions table (see data-schema.md for SQL).
4. Run `supabase start` to spin up local instance.
5. Run `supabase db push` (or `supabase migration up`) to apply migrations.
6. Write `scripts/seed-supabase.ts` — reads the scraped data from:
   - `/Users/openclaw/src/spantree/goto-accelerate-companion/.cache/web-scraping/gotochgo.com/data/sessions.json`
   - `/Users/openclaw/src/spantree/goto-accelerate-companion/.cache/web-scraping/gotochgo.com/data/speakers.json`
   Do NOT read from `data/sessions.json` / `data/speakers.json` in the repo root.
   Upsert into Supabase using `@supabase/supabase-js` admin client.
   Use `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from env (output by `supabase start`).
7. Run the seed script. Verify 31 sessions and 32 speakers inserted.

## Phase B — Client Scaffold

1. Scaffold a fresh Vite+React project inside `client/`:
   ```
   cd client && bun create vite . --template react
   ```
2. Install dependencies:
   ```
   bun add @supabase/supabase-js react-router-dom
   bun add -d tailwindcss @tailwindcss/vite autoprefixer
   ```
3. Configure Tailwind (tailwind.config.js, postcss.config.js, import in index.css).
4. Set up path aliases (`@/` → `src/`) in vite.config.js.
5. Add `client/.env.local` with:
   ```
   VITE_SUPABASE_URL=http://localhost:54321
   VITE_SUPABASE_ANON_KEY=<anon key from supabase start output>
   ```
6. Create `client/src/lib/supabase.ts` — exports `createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)`.
7. Copy portrait images: `cp -r .cache/web-scraping/gotochgo.com/assets/portraits client/public/portraits`.
8. Set up React Router in `client/src/main.tsx` and `client/src/App.tsx` with four routes:
   - `/` → Home
   - `/speakers` → Speakers
   - `/speakers/:id` → SpeakerDetail
   - `/schedule` → Schedule

## Phase C — Four Pages

Build each page using the corresponding cached HTML as visual spec. Parse it with your own
eyes (read the file) — match the layout, section order, color palette, typography, and card
designs. Write clean React+Tailwind. Do NOT copy their class names.

### C1 — Home (`/`)
Reference: `.cache/web-scraping/gotochgo.com/raw/pages/01-homepage.html`
Screenshot: `.cache/web-scraping/gotochgo.com/screenshots/01-homepage.png`

Sections to include:
- Navbar (conference name, nav links, register CTA button)
- Hero (headline, subhead, date/location, CTA)
- Speaker preview / "Good Company" section (grid of a few speaker portraits)
- Schedule preview (highlight a few sessions)
- Venue section
- Sponsors/partners strip
- Footer

No registration drawer — make the register CTA a stub (`<a>` tag with `href="#"` or link-out).

### C2 — Speakers index (`/speakers`)
Reference: `.cache/web-scraping/gotochgo.com/raw/pages/02-speakers.html`
Screenshot: `.cache/web-scraping/gotochgo.com/screenshots/02-speakers.png`

- Load all 32 speakers from Supabase
- Grid of speaker cards: portrait, name, title, company
- Portrait: `/portraits/{speakerPageId}.{ext}` — check `.cache/.../assets/portraits/` for the extension
  (most are .png; some are .jpeg or .jpg)
- Each card links to `/speakers/:id` using the speaker's `id` slug
- Consider a search/filter by name or tag if the live site has one (check the HTML)

### C3 — Speaker detail (`/speakers/:id`)
Reference: `.cache/web-scraping/gotochgo.com/raw/pages/speaker-4333.html` (Scott Hanselman)
Also check 1-2 others for variation.

- Load speaker by `id` slug from Supabase
- Large portrait, name, title, company, bio
- Sessions by this speaker (join sessions where speaker_ids contains this speaker id)
- Link back to `/speakers`

### C4 — Schedule (`/schedule?date=YYYY-MM-DD`)
Reference: `.cache/web-scraping/gotochgo.com/raw/pages/03-schedule.html`
Screenshot: `.cache/web-scraping/gotochgo.com/screenshots/03-schedule.png`
Also see: `.cache/web-scraping/gotochgo.com/raw/api/schedule-data.json` for structure.

- Three day-tabs: Monday Jun 22, Tuesday Jun 23, Wednesday Jun 24
- Clicking a tab updates `?date=` query param (use `useSearchParams` from react-router-dom)
- Default to `2026-06-22` if no date param
- Load sessions for the selected date from Supabase
- Session cards: time, title, type badge, room, speaker names
- Clicking a session with an abstract shows detail (inline expand or navigate to a session detail route)
- Match the color coding per session type if the live site uses it (check the HTML)

## Phase D — Server Cleanup

1. Strip `src/server.ts` to keep only:
   - `GET /api/health`
   - `POST /api/chat` (Claude AI proxy — keep as-is)
2. Remove the `/api/sessions` and `/api/speakers` endpoints.
3. Update `.env.example`:
   ```
   ANTHROPIC_API_KEY=***
   PORT=3000
   SUPABASE_URL=http://localhost:54321
   SUPABASE_ANON_KEY=<anon key>
   SUPABASE_SERVICE_ROLE_KEY=<service role key>
   ```
4. Update `package.json` scripts — add `supabase:start`, `supabase:seed` convenience scripts.

---

## Safety Rules

- **DO NOT touch or reference `base44-original/`** — it's a dead end.
- **DO NOT modify `.cache/web-scraping/`** — read-only source of truth.
- **DO NOT commit `client/.env.local`** — add to `.gitignore`.
- **DO NOT add auth** — no login, no protected routes, no Supabase auth in phase 1.
- **DO NOT build a registration flow** — stub the CTA button as a dead link.

---

## Green Gate

- [ ] `supabase status` shows local instance running
- [ ] `bun run scripts/seed-supabase.ts` exits 0 with "31 sessions, 32 speakers inserted"
- [ ] `bun run dev:client` starts Vite dev server with no errors
- [ ] `/` loads Home page visually matching the live site layout
- [ ] `/speakers` loads full speaker grid with portraits
- [ ] `/speakers/scott-hanselman` loads Scott Hanselman's detail page with bio + sessions
- [ ] `/schedule?date=2026-06-22` loads Jun 22 sessions; switching tabs updates URL param
- [ ] `bun run dev` (Bun server) starts with no errors on port 3000
- [ ] `report.md` documents: what was built, any deviations from goal, gaps, next steps

---

## Stop Condition

Write `report.md` and go idle once the green gate is satisfied (or after 50 turns — document
what's blocked). Do not start any additional features or pages beyond the core four.
