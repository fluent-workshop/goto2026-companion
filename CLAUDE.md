# GOTO Accelerate Chicago 2026 — Companion App

You are building a conference companion app for GOTO Accelerate Chicago 2026.

## What we're building

An AI-powered web app that helps conference attendees:
- Browse sessions by day, type, and topic
- Explore speaker profiles
- Chat with an AI assistant that knows the full schedule
- Build a personalized schedule

## Stack

- **Backend:** Bun HTTP server (`src/server.ts`) + Postgres
- **Frontend:** React + Vite (`client/`)
- **AI:** Claude (via `@anthropic-ai/sdk`)
- **Database:** Postgres — schema managed in `scripts/migrate.ts`

## Data

- `data/speakers.json` — 32 speakers with id, name, title, company, tags
- `data/sessions.json` — 31 sessions across Jun 22–24, with speaker references

## Development commands

```bash
bun run migrate     # Create/update DB schema
bun run seed        # Load speakers + sessions into Postgres
bun run dev         # Start Bun server with hot reload (port 3000)
bun run dev:client  # Start Vite dev server (port 5173)
```

## Environment variables

- `DATABASE_URL` — Postgres connection string (default: `postgresql://postgres:postgres@localhost:5432/goto_companion`)
- `ANTHROPIC_API_KEY` — Claude API key (required for /api/chat)
- `PORT` — Server port (default: 3000)

## API

- `GET  /api/sessions` — list sessions; optional `?date=2026-06-23&type=Talk`
- `GET  /api/speakers` — list all speakers
- `GET  /api/speakers/:id` — speaker detail + their sessions
- `POST /api/chat` — chat with AI; body: `{ message: string, history: [] }`
- `GET  /api/health` — health check

## Client

The React client lives in `client/`. Run `bun run build:client` to build; the server serves it from `client/dist`. During development, use the Vite dev server (port 5173) which proxies API calls to port 3000.

## What to build next

The basic server skeleton is here. The client is empty — build it. Priority order:
1. Session browser (filter by date/type/tag)
2. Speaker profiles
3. Chat interface
4. Schedule builder (pick sessions, detect conflicts)

Design should be clean and mobile-friendly. Tailwind CSS preferred.
