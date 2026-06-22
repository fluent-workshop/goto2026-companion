/**
 * goto-accelerate-companion — Bun HTTP server
 * Serves the built React client and the Claude chat proxy.
 *
 * Session/speaker data is served directly to the client from Supabase
 * (see client/src/lib/supabase.ts), so this server only handles:
 *   GET  /api/health           — health check
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
    if (path === "/api/chat" && req.method === "POST") return handleChat(req);
    if (path === "/api/health") return json({ status: "ok", ts: new Date().toISOString() });

    // Static files
    if (!path.startsWith("/api/")) return serveStatic(path);

    return notFound();
  },
});

console.log(`🚀 Server running at http://localhost:${PORT}`);
