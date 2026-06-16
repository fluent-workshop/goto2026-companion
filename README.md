# GOTO Accelerate Chicago 2026 — Companion App

AI-powered conference companion built live during the masterclass **"From Code Assistants to Autonomous Agents"** at GOTO Accelerate Chicago 2026.

## The Exercise

This app was built by an autonomous agent (OpenClaw + Claude Code), directed by voice commands through Discord. Starting with the pre-seeded conference data and a blank frontend, teams steered the agent to build a working app in real time.

## Stack

| Layer | Tech |
|---|---|
| Backend | Bun + TypeScript |
| Database | Postgres |
| Frontend | React + Vite + Tailwind |
| AI | Claude (Anthropic) |
| Agent | OpenClaw + Claude Code |

## Quick start

```bash
# 1. Install deps
bun install
cd client && bun install && cd ..

# 2. Set up DB
createdb goto_companion
bun run migrate
bun run seed

# 3. Configure env
cp .env.example .env
# edit .env — add ANTHROPIC_API_KEY

# 4. Run dev servers
bun run dev          # API on :3000
bun run dev:client   # React on :5173
```

## Data

32 speakers and 31 sessions from GOTO Accelerate Chicago 2026 are pre-loaded in `data/`. Run `bun run seed` to populate the DB.
