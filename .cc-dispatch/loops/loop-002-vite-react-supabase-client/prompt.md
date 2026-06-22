Scaffold and build a complete Vite+React+Supabase frontend that visually recreates the live GOTO Accelerate Chicago 2026 conference site — four core pages (Home, Speakers, Speaker Detail, Schedule) — using only the cached live-site HTML as the visual reference.

READ FIRST:
- `.cc-dispatch/loops/loop-002-vite-react-supabase-client/goal.md` — full spec, phases A–D, green gate, safety rules
- `.cc-dispatch/loops/loop-002-vite-react-supabase-client/references/INDEX.md` — then every file it lists

Mode: autonomous (--dangerously-skip-permissions), work directly on `main` in this repo.
Do NOT touch or reference `base44-original/` — it is off-limits. Visual spec is `.cache/web-scraping/gotochgo.com/raw/pages/`.
Do NOT modify anything in `.cache/web-scraping/` — read-only.

Done when: `bun run dev:client` starts clean, all four routes render with real Supabase data, portraits load from `/portraits/`, schedule day-tabs update the `?date=` query param, seed script exits 0 (31 sessions + 32 speakers), and `report.md` is written — or stop after 50 turns and report what's blocking.

Stop after the green gate passes: write `report.md`, go idle. Do not begin any additional pages or features.
