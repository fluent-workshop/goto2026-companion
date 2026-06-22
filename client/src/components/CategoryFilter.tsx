export interface FilterOption {
  value: string;
  kind: "type" | "tag";
}

interface Props {
  options: FilterOption[];
  selected: Set<string>;
  onToggle: (value: string) => void;
  onClear: () => void;
}

/**
 * Horizontally scrolling row of toggleable filter pills (session types + tags).
 * Types render first, then a divider, then tags. No selection = no filtering.
 */
export default function CategoryFilter({
  options,
  selected,
  onToggle,
  onClear,
}: Props) {
  const types = options.filter((o) => o.kind === "type");
  const tags = options.filter((o) => o.kind === "tag");
  const hasSelection = selected.size > 0;

  const Pill = ({ value }: { value: string }) => {
    const active = selected.has(value);
    return (
      <button
        type="button"
        onClick={() => onToggle(value)}
        aria-pressed={active}
        className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
          active
            ? "border-navy bg-navy text-white shadow-sm"
            : "border-black/10 bg-white text-navy/70 hover:border-navy/30 hover:text-navy"
        }`}
      >
        {value}
      </button>
    );
  };

  return (
    <div className="mt-4 flex items-center gap-3">
      <div className="flex flex-1 items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
        {types.map((o) => (
          <Pill key={o.value} value={o.value} />
        ))}
        {types.length > 0 && tags.length > 0 && (
          <span className="mx-1 h-6 w-px shrink-0 bg-black/10" aria-hidden />
        )}
        {tags.map((o) => (
          <Pill key={o.value} value={o.value} />
        ))}
      </div>

      {hasSelection && (
        <button
          type="button"
          onClick={onClear}
          className="shrink-0 text-sm font-semibold text-magenta hover:underline"
        >
          Clear
        </button>
      )}
    </div>
  );
}
