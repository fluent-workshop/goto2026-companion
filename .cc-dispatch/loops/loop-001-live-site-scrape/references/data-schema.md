# Data Schema Reference

## data/sessions.json

Array of session objects. **Only patch `abstract` — do not change any other fields.**

```json
{
  "id": "string (slug, e.g. 'scott-hanselman-eic-problem')",
  "title": "string",
  "type": "Masterclass | Keynote | Session | Lightning Talk",
  "date": "YYYY-MM-DD",
  "day": "string (e.g. 'Monday, June 22')",
  "startTime": "HH:MM (24h)",
  "endTime": "HH:MM (24h)",
  "room": "string (e.g. 'The Hall', 'Forum', 'Hub')",
  "speakers": ["array of speaker id slugs"],
  "tags": ["array of tag strings"],
  "abstract": "string | null  ← PATCH THIS"
}
```

Currently 31 sessions. 4 have null abstracts — these may not exist on the live site
or may genuinely have no description. Document which case applies for each.

## data/speakers.json

Array of speaker objects. **Only patch `bio` and `portraitUrl` — do not change other fields.**

```json
{
  "id": "string (slug, e.g. 'scott-hanselman')",
  "name": "string",
  "title": "string",
  "company": "string | null",
  "tags": ["array of topic tag strings"],
  "speakerPageId": 4333,  // ← numeric ID matching the site URL: /speakers/4333
  "bio": "string | null  ← PATCH THIS",
  "portraitUrl": "string | null  ← PATCH THIS",
  "profileUrl": "string | null  ← may also patch if missing"
}
```

Currently 32 speakers. Use `speakerPageId` to match against the site's speaker URLs:
`https://gotochgo.com/accelerate-chicago-2026/speakers/{speakerPageId}`

## Matching sessions to live site

Session titles in the data file may differ slightly from the live site:
- "Lightning Talks - " prefix may be stripped in the data file
- Case differences ("Fast code..." vs "Fast Code...")
- Minor wording variations

Use normalized fuzzy matching (lowercase, strip punctuation, strip "Lightning Talks -" prefix).
