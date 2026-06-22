interface Props {
  type: string | null;
}

// Color-code by session type (the live site color-codes sessions).
const STYLES: Record<string, string> = {
  Keynote: "bg-magenta/15 text-magenta",
  Workshop: "bg-amber-100 text-amber-800",
  Masterclass: "bg-amber-100 text-amber-800",
  Session: "bg-sky-100 text-sky-800",
  Talk: "bg-sky-100 text-sky-800",
  Panel: "bg-violet-100 text-violet-800",
  Break: "bg-slate-100 text-slate-600",
};

export default function TypeBadge({ type }: Props) {
  if (!type) return null;
  const cls = STYLES[type] ?? "bg-slate-100 text-slate-700";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${cls}`}
    >
      {type}
    </span>
  );
}
