# References Index — Loop 002

| File | What it is | Why CC needs it |
|------|-----------|-----------------|
| `decisions.md` | Cedric's design decisions from planning: fidelity level, page scope, routing, data strategy, portrait approach, what to ignore | **Read first.** Defines the hard constraints for this loop — especially "do NOT use base44-original, use only cache assets." |
| `cache-layout.md` | Full map of `.cache/web-scraping/gotochgo.com/` — raw HTML per page, portrait images, schedule API JSON, data files, screenshots | Tells CC exactly which files to use as visual reference and data source for each page. Raw HTML is the fidelity spec. |
| `data-schema.md` | Session and speaker field definitions, null counts, Supabase migration SQL, portrait filename pattern | Defines the Supabase schema to write and how to join sessions→speakers for rendering. |
