# Loop 002 — Report: Vite+React+Supabase Client

**Status:** ✅ Green gate passed.
**Date:** 2026-06-22

A complete Vite + React + Supabase frontend recreating the GOTO Accelerate
Chicago 2026 site (four core pages) was built, seeded from the cached scrape,
and verified end-to-end with a headless browser.

---

## What was built

### Phase A — Supabase

- Local Supabase instance running (migrations already present, applied on start).
- `scripts/seed-supabase.ts` — reads the cached scrape
  (`.cache/web-scraping/gotochgo.com/data/{speakers,sessions}.json`), transforms,
  and upserts via the `@supabase/supabase-js` admin client.
- Seed result: **31 sessions, 31 speakers** (see deviation #1 below re: "32").

### Phase B — Client scaffold (`client/`)

- Vite 5 + React 18 + TypeScript, React Router 6, Tailwind **v4** (via
  `@tailwindcss/vite`), `@supabase/supabase-js`.
- `@/` → `src/` path alias in `vite.config.ts` + `tsconfig.json`.
- `client/.env.local` (gitignored) with `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`.
- `src/lib/supabase.ts` exports the browser client.
- Portraits copied to `client/public/portraits/` (31 files: 26 png, 3 jpeg, 2 jpg).
  A generated `src/lib/portraits.json` manifest maps `speaker_page_id → /portraits/<file>`
  so the mixed extensions resolve correctly; `portrait_url` (CDN) is the fallback.

### Phase C — Four pages

- **`/` Home** — navy/magenta hero, "In good company" speaker grid (9), "What's
  on" session preview, venue, sponsors strip. Register CTA is a stub link-out.
- **`/speakers`** — full 31-speaker grid with live search (name/title/company).
- **`/speakers/:id`** — navy header band, large portrait, title/company, "Talks at
  Accelerate Chicago 2026" sessions, bio, gotochgo.com link. `:id` is the name slug.
- **`/schedule`** — three day-tabs (Jun 22/23/24); clicking updates `?date=` via
  `useSearchParams`; default `2026-06-22`. Session cards show time, type badge,
  tags, speaker links, and an expandable abstract.

### Phase D — Server cleanup

- `src/server.ts` stripped to `GET /api/health` + `POST /api/chat` (chat kept
  as-is, including its legacy Postgres RAG context). `/api/sessions` and
  `/api/speakers` removed (now return 404).
- `.env.example` updated with Supabase vars; `package.json` gained
  `supabase:start`, `supabase:stop`, `supabase:seed` scripts.

---

## Green gate verification

| Check                                      | Result                                                                             |
| ------------------------------------------ | ---------------------------------------------------------------------------------- |
| `supabase status` running                  | ✅ running                                                                         |
| seed exits 0                               | ✅ `✓ 31 sessions, 31 speakers inserted`, exit 0 (31 accepted as correct — see #1) |
| `bun run dev:client` starts clean          | ✅ Vite ready, no errors                                                           |
| `/` loads                                  | ✅ headless render, 0 console errors, 9 portraits load                             |
| `/speakers` grid + portraits               | ✅ 31 portraits, 0 broken                                                          |
| `/speakers/scott-hanselman` bio + sessions | ✅ bio + "The EiC Problem" session                                                 |
| `/schedule?date=…` + tab→URL               | ✅ Wed→`?date=2026-06-24` (15 cards), Tue→`…06-23`                                 |
| `bun run dev` (Bun server) on :3000        | ✅ health 200, removed endpoints 404                                               |
| production `vite build`                    | ✅ builds (extra confidence)                                                       |
| `tsc --noEmit`                             | ✅ clean                                                                           |

Verification artifacts: `.scratch/scripts/render-check.mjs`, screenshots in `.scratch/shot_*.png`.

---

## Deviations from the goal

1. **31 speakers, not 32 — confirmed unsatisfiable from real data.** The green
   gate requires "32 speakers," but the cache contains exactly **31**, verified
   across four independent sources that all yield the _identical_ set of 31 IDs:

   | Source                                                     | Count |
   | ---------------------------------------------------------- | ----- |
   | `assets/portraits/*` (image files)                         | 31    |
   | `data/speakers.json` records                               | 31    |
   | distinct speaker IDs referenced across all `sessions.json` | 31    |
   | `raw/pages/speaker-*.html` detail pages                    | 31    |

   The ID sets are byte-for-byte equal (4318 … 4536). No session references a
   speaker absent from `speakers.json`, and no portrait or detail page exists for
   an unknown 32nd speaker. Since the loop designates `.cache/web-scraping/` as the
   read-only source of truth and forbids touching it, **the only way to reach 32
   would be to fabricate a speaker record** — which would corrupt the dataset and
   misreport reality, so I did not. The "32" is an off-by-one in the spec; the seed
   honestly reports the 31 speakers that exist. **This was the one green-gate
   criterion that could not be met without fabricated data, so it was escalated;
   the user accepted 31 as correct** (2026-06-22). No record was fabricated.

2. **Speaker `id` is numeric in the cache, not a slug.** `data-schema.md` describes
   `id` as a slug (`scott-hanselman`) with a separate `speakerPageId`. The actual
   cache uses a numeric `id` (4333) and has no slug or `speakerPageId` field. I
   derive the slug from the name at seed time and store it as the table PK (so
   `/speakers/scott-hanselman` works), keeping the numeric id as `speaker_page_id`
   (which matches the portrait filename). Session `speakers` (numeric) are remapped
   to slugs in `speaker_ids`.

3. **Supabase port is 54421, not 54321.** The installed CLI (v2.75) defaults the
   API to `54421` and emits new-style `sb_publishable_…` / `sb_secret_…` keys
   instead of the legacy JWT anon/service keys. `.env.local` and `.env.example`
   reflect the real values.

4. **Analytics disabled in `supabase/config.toml`** (`[analytics] enabled = false`).
   The `vector`/`analytics` container failed to start under the colima Docker
   runtime (`mount source path … operation not supported` on `docker.sock`).
   Disabling analytics is the standard fix and is unrelated to app data.

5. **Speakers have no `tags`.** The cache has no per-speaker tags, so the speaker
   index filters by name/title/company instead of tag. `tags` is seeded as `[]`.

6. **Tailwind v4 (Vite plugin)** instead of the v3-style `tailwind.config.js` +
   `postcss.config.js` the goal sketches. v4's `@tailwindcss/vite` needs no
   PostCSS/autoprefixer config; theme tokens live in `src/index.css` under `@theme`.

7. **Session types** in the data are only `Workshop` and `Session` (not the richer
   Keynote/Talk/Panel set). `TypeBadge` still color-codes the broader set for
   forward-compat; only the two present types render in practice.

---

## Gaps / not done (intentionally out of scope)

- No chat UI page (Phase 1 scope is the core four pages; `/api/chat` backend kept).
- No schedule-builder / personal agenda (not in this loop's scope).
- `/api/chat` still reads its RAG context from the legacy local Postgres
  (`session_speakers` join), per "keep as-is." It is **not** wired to Supabase and
  would need that DB seeded (`bun run migrate && bun run seed`) + `ANTHROPIC_API_KEY`
  to function. Server boot does not require it (Postgres connection is lazy).

## Next steps

1. Reconcile the chat backend onto Supabase (drop the legacy Postgres path) so a
   single data source feeds both the client and chat.
2. Build the chat interface and schedule-builder pages (next loop).
3. Add a root `.gitignore` (node_modules/dist) and commit; wire a real favicon/logo.
4. Consider remote Supabase + `supabase db push` for a deployable environment.
