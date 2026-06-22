Scrape the live GOTO Accelerate Chicago 2026 website and populate the companion app data files with full session abstracts, speaker bios, portrait images, and screenshots.

READ FIRST:
- `.cc-dispatch/loops/loop-001-live-site-scrape/goal.md` — full spec, phases, safety rules
- `.cc-dispatch/loops/loop-001-live-site-scrape/references/INDEX.md` — then everything it lists

Mode: autonomous (--dangerously-skip-permissions), work directly in the repo root.
Seed URL: https://gotochgo.com/accelerate-chicago-2026
Follow the website-scraping skill phases in order. Do NOT skip Phase 2 (structured data probe) or Phase 4 (canary test).

Done when: all sessions in `data/sessions.json` have non-null abstracts (or gaps documented), all speakers have `bio` + `portraitUrl`, portrait images are saved to `output/assets/portraits/`, screenshots saved to `output/screenshots/`, and `report.md` is written — or stop after 50 turns and report what's blocking.

Stop after data files are updated: write `report.md`, go idle. Do not touch any application source code.
