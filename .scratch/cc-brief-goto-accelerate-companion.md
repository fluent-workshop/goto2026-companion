# CC Dispatch Brief: goto-accelerate-companion

**Mode:** Autonomous
**Generated:** 2026-06-22T09:46:18.335Z

## Mode: Autonomous

Execute the task independently. Explore, plan, implement, test, and commit.
Use the notification command below for progress updates and when finished.

## Task

Scrape GOTO Accelerate Chicago 2026 website and populate companion app data files per goal.md

## Communication

For mid-session updates (blockers, questions, major milestones):
```bash
openclaw message send --channel discord --to "channel:1518038524530659330" --account default --message "[CC: goto-accelerate-companion] <your message>"
```

Do NOT send a separate completion notification — the `SessionEnd` hook fires automatically when you exit and notifies the channel. Your job is to write `report.md` and go idle.

## Constraints

- Follow conventions in CLAUDE.md at the workspace root
- Use `@evie/lib` shared library for secrets, HTTP, CLI patterns
- New scripts must use Bun + TypeScript (see `skills/scripting/SKILL.md`)
- Incremental migrations only — never modify existing migration files
- Use `trash` over `rm` for deletions
- Commit with descriptive messages; reference issue numbers
