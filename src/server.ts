/**
 * goto-accelerate-companion — Bun HTTP server
 * Serves the React client and exposes JSON API endpoints.
 *
 * Routes:
 *   GET  /api/sessions         — all sessions (optional ?date=YYYY-MM-DD&type=Talk)
 *   GET  /api/speakers         — all speakers
 *   GET  /api/speakers/:id     — single speaker + their sessions
 *   POST /api/chat             — RAG chat with Claude
 */
import postgres from "postgres";
import Anthropic from "@anthropic-ai/sdk";
import { join } from "path";
import { existsSync } from "fs";

const PORT = parseInt(process.env.PORT ?? "3000");
const DATABASE_URL = process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/goto_companion";
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const CLIENT_DIST = join(import.meta.dir, "../client/dist");

const sql = postgres(DATABASE_URL);
const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

// ── helpers ──────────────────────────────────────────────────────────────────

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function notFound(msg = "Not found") {
  return json({ error: msg }, 404);
}

// ── routes ───────────────────────────────────────────────────────────────────

async function handleSessions(url: URL) {
  const date = url.searchParams.get("date");
  const type = url.searchParams.get("type");

  const sessions = await sql`
    SELECT
      s.*,
      COALESCE(
        json_agg(json_build_object('id', sp.id, 'name', sp.name, 'title', sp.title, 'company', sp.company))
        FILTER (WHERE sp.id IS NOT NULL), '[]'
      ) AS speakers
    FROM sessions s
    LEFT JOIN session_speakers ss ON ss.session_id = s.id
    LEFT JOIN speakers sp ON sp.id = ss.speaker_id
    WHERE 1=1
      ${date ? sql`AND s.date = ${date}` : sql``}
      ${type ? sql`AND s.type = ${type}` : sql``}
    GROUP BY s.id
    ORDER BY s.date, s.start_time
  `;
  return json(sessions);
}

async function handleSpeakers() {
  const speakers = await sql`SELECT * FROM speakers ORDER BY name`;
  return json(speakers);
}

async function handleSpeaker(id: string) {
  const [speaker] = await sql`SELECT * FROM speakers WHERE id = ${id}`;
  if (!speaker) return notFound();

  const sessions = await sql`
    SELECT s.* FROM sessions s
    JOIN session_speakers ss ON ss.session_id = s.id
    WHERE ss.speaker_id = ${id}
    ORDER BY s.date, s.start_time
  `;
  return json({ ...speaker, sessions });
}

async function handleChat(req: Request) {
  const body = await req.json() as { message: string; history?: { role: string; content: string }[] };
  const { message, history = [] } = body;

  // Fetch relevant context from DB
  const sessionContext = await sql`
    SELECT
      s.title, s.type, s.date, s.start_time, s.end_time, s.room, s.tags, s.abstract,
      string_agg(sp.name, ', ') AS speaker_names
    FROM sessions s
    LEFT JOIN session_speakers ss ON ss.session_id = s.id
    LEFT JOIN speakers sp ON sp.id = ss.speaker_id
    GROUP BY s.id
    ORDER BY s.date, s.start_time
  `;

  const systemPrompt = `You are the AI assistant for GOTO Accelerate Chicago 2026, a software conference running June 22–24, 2026 at the Slalom Office, Aon Center, 37th Floor, 200 E Randolph St, Chicago.

Here is the complete schedule:

${sessionContext.map(s =>
  `[${s.date} ${s.start_time}–${s.end_time}] ${s.type}: "${s.title}"${s.speaker_names ? ` — ${s.speaker_names}` : ''} (${s.room})${s.abstract ? `\n  ${s.abstract}` : ''}`
).join("\n")}

Help attendees discover sessions, find speakers, plan their schedule, and get the most out of the conference. Be concise and conversational.`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      ...history.map(h => ({ role: h.role as "user" | "assistant", content: h.content })),
      { role: "user", content: message },
    ],
  });

  const reply = response.content[0].type === "text" ? response.content[0].text : "";
  return json({ reply });
}

// ── static file serving ───────────────────────────────────────────────────────

async function serveStatic(path: string) {
  if (!existsSync(CLIENT_DIST)) {
    return new Response("Client not built. Run: bun run build:client", { status: 503 });
  }
  const filePath = join(CLIENT_DIST, path === "/" ? "index.html" : path);
  const file = Bun.file(filePath);
  if (await file.exists()) return new Response(file);
  // SPA fallback
  return new Response(Bun.file(join(CLIENT_DIST, "index.html")));
}

// ── server ───────────────────────────────────────────────────────────────────

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    // API routes
    if (path === "/api/sessions" && req.method === "GET") return handleSessions(url);
    if (path === "/api/speakers" && req.method === "GET") return handleSpeakers();
    if (path.startsWith("/api/speakers/") && req.method === "GET") {
      return handleSpeaker(path.replace("/api/speakers/", ""));
    }
    if (path === "/api/chat" && req.method === "POST") return handleChat(req);
    if (path === "/api/health") return json({ status: "ok", ts: new Date().toISOString() });

    // Static files
    if (!path.startsWith("/api/")) return serveStatic(path);

    return notFound();
  },
});

console.log(`🚀 Server running at http://localhost:${PORT}`);
