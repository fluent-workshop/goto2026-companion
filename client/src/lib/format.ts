// "09:00" -> "9:00 AM"
export function formatTime(hhmm: string | null): string {
  if (!hhmm) return "";
  const [h, m] = hhmm.split(":").map(Number);
  if (Number.isNaN(h)) return hhmm;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export function formatTimeRange(
  start: string | null,
  end: string | null,
): string {
  const s = formatTime(start);
  const e = formatTime(end);
  if (s && e) return `${s} – ${e}`;
  return s || e;
}

// "2026-06-24" -> "Wednesday, June 24"
const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * Build the canonical session-detail path:
 *   details_url + "/" + kebab(title)
 * e.g. /accelerate-chicago-2026/masterclasses/590/from-code-assistants-to-autonomous-agents
 * Falls back to /schedule if the session has no details_url.
 */
export function sessionPath(session: {
  details_url: string | null;
  title: string;
}): string {
  if (!session.details_url) return "/schedule";
  return `${session.details_url}/${slugify(session.title)}`;
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  // Construct at noon UTC to avoid TZ rollover.
  const date = new Date(Date.UTC(y, m - 1, d, 12));
  return `${WEEKDAYS[date.getUTCDay()]}, ${MONTHS[m - 1]} ${d}`;
}
