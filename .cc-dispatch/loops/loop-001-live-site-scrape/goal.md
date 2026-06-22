# Loop 001 — Live Site Scrape

## Objective

Scrape the live GOTO Accelerate Chicago 2026 conference website and populate the
companion app's data files with complete speaker bios, session abstracts, portrait
images, and screenshots.

This is a dry run of the `website-scraping` skill. Follow the skill phases exactly.
The skill is in `references/website-scraping-skill.md`.

---

## Site

**Seed URL:** https://gotochgo.com/accelerate-chicago-2026

---

## Phases (follow the skill)

### Phase 1 — Browser Exploration
- Open the site. Screenshot the homepage, speakers page, and schedule page.
- Save screenshots to `output/screenshots/`.
- Save raw HTML for each page via JS evaluate to `output/raw/pages/`.
- Note: the schedule has 3 date tabs (June 22, 23, 24) — screenshot and save each.

### Phase 2 — Probe for Structured Data
- Test server-render status with curl on the main URL and a speaker detail page.
- Inspect the DOM for `data-*` attributes, JSON-LD, embedded JSON blobs, and network calls.
- Check whether any auth/cookies are needed.
- **Important:** even if a page appears JS-rendered, check the raw HTML carefully
  before concluding curl won't work.

### Phase 3 — Extraction Strategy
- Based on Phase 2 findings, decide the extraction approach for:
  - Schedule data (all 3 days: sessions, times, rooms, abstracts, tags)
  - Speaker list (all speakers: name, title, company, portrait URL, bio)
- Prefer curl over browser automation once a repeatable pattern exists.

### Phase 4 — Canary Test
- Test your approach on 2-3 URLs before batching.

### Phase 5 — Batch Extraction

**5a. Extract structured data:**
- All sessions across all 3 days with: title, type, date, startTime, endTime,
  room, abstract (full text, HTML stripped), speakers (array of IDs), tags
- All speakers with: name, title, company, bio, portraitUrl, profileUrl

Save raw HTML and any API responses to `output/raw/`.

**5b. Download media assets:**
- Download all speaker portrait images to `output/assets/portraits/`
- Any other prominent images (hero, sponsor logos) to `output/assets/misc/`

### Phase 6 — Populate data files

Using your scraped data, update the existing JSON files:

**`data/sessions.json`:** Patch `abstract` field for any session where it's null or missing.
  Match by title (fuzzy-ok — titles may differ slightly between the site and the
  existing data). Do NOT change IDs, types, or other fields.

**`data/speakers.json`:** Patch `bio` and `portraitUrl` fields where missing.
  Match using `speakerPageId` — each speaker has a numeric ID that matches
  the site's speaker URL pattern (e.g. speakerPageId 4333 →
  https://gotochgo.com/accelerate-chicago-2026/speakers/4333).

---

## Output layout

```
output/
  screenshots/     # named descriptively: 01-homepage.png, 02-speakers.png, etc.
  raw/
    pages/         # one .html file per URL fetched
    api/           # any JSON API responses
  assets/
    portraits/     # speaker portrait images
    misc/          # other media
  data/            # any intermediate JSON before writing to data/
```

---

## Completion criteria

- [ ] Screenshots saved for homepage, speakers page, and all 3 schedule tabs
- [ ] Raw HTML cached for all scraped pages
- [ ] All sessions have non-null `abstract` fields (or clearly documented why not)
- [ ] All speakers have `bio` and `portraitUrl` (or documented as unavailable)
- [ ] Portrait images downloaded to `output/assets/portraits/`
- [ ] `data/sessions.json` and `data/speakers.json` updated in place
- [ ] `report.md` written with: approach used, counts, any gaps, screenshots noted

---

## Safety rules

- Do NOT modify `data/sessions.json` or `data/speakers.json` structure beyond patching
  `abstract`, `bio`, and `portraitUrl` fields.
- Do NOT add, remove, or rename sessions or speakers.
- Do NOT touch `src/`, `client/`, or any application code.
- Add a small delay (0.25–0.5s) between HTTP requests.

---

## Stop condition

Write `report.md` covering what was found, what approach worked, coverage stats,
and any gaps. Go idle. Do not start any application code changes.
