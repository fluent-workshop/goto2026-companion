import { createClient } from "@supabase/supabase-js";

const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!anonKey) {
  throw new Error(
    "Missing VITE_SUPABASE_ANON_KEY. Did you create client/.env.local?",
  );
}

// Use a proxied relative path when accessed from outside localhost
// so Supabase calls route through Vite → local Supabase instead of
// hitting the visitor's own localhost.
const isLocal =
  typeof window === "undefined" ||
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const url = isLocal
  ? (import.meta.env.VITE_SUPABASE_URL ?? "http://127.0.0.1:54421")
  : (typeof window !== "undefined" ? `${window.location.origin}/supabase` : "/supabase");

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false },
});
