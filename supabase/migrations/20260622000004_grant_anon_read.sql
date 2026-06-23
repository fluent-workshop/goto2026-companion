-- Grant anon role read access to all public tables so the Supabase JS client
-- can query speakers/sessions from the browser without a service role key.
-- This migration runs as part of `supabase start` (or `supabase db reset`).
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Ensure future tables created in this schema also grant anon read access.
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO anon;
