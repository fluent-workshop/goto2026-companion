-- Session detail pages need the canonical details URL and the full HTML
-- description (richer than the plain-text abstract) from the live schedule API.
ALTER TABLE sessions
  ADD COLUMN details_url TEXT,
  ADD COLUMN description TEXT;
