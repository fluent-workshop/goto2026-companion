export function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-20 text-navy/60">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-navy/20 border-t-magenta" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export function ErrorState({ error }: { error: Error }) {
  return (
    <div className="mx-auto max-w-lg rounded-lg border border-red-200 bg-red-50 p-6 text-center">
      <p className="font-semibold text-red-800">Something went wrong</p>
      <p className="mt-1 text-sm text-red-600">{error.message}</p>
      <p className="mt-3 text-xs text-red-500">
        Is Supabase running? Try <code>bun run supabase:start</code>.
      </p>
    </div>
  );
}

export function Empty({ message }: { message: string }) {
  return (
    <div className="py-20 text-center text-sm text-navy/50">{message}</div>
  );
}
