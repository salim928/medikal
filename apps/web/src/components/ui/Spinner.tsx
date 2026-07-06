import { cn } from "@/lib/utils";

/** Brand loading spinner. */
export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn("h-10 w-10 animate-spin rounded-full border-b-2 border-brand-600", className)}
      role="status"
      aria-label="Loading"
    />
  );
}

/** Full-area loading state for pages waiting on auth/data. */
export function PageSpinner({ label }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <Spinner className="h-12 w-12" />
      {label && <p className="text-slate-600">{label}</p>}
    </div>
  );
}
