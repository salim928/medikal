import { cn } from "@/lib/utils";

/** The medicom cross mark. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-6 w-6", className)} fill="currentColor" aria-hidden>
      <rect x="9.4" y="2.6" width="5.2" height="18.8" rx="2.4" />
      <rect x="2.6" y="9.4" width="18.8" height="5.2" rx="2.4" />
    </svg>
  );
}

/**
 * Full medicom logo: cross mark + wordmark.
 * `variant="plain"` shows the blue mark on transparent bg (landing/nav);
 * `variant="badge"` shows a white mark inside a blue rounded square (app shell).
 */
export function BrandLogo({
  light = false,
  variant = "plain",
}: {
  light?: boolean;
  variant?: "plain" | "badge";
}) {
  return (
    <span className="flex items-center gap-2">
      {variant === "badge" ? (
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-600 text-white">
          <BrandMark className="h-[18px] w-[18px]" />
        </span>
      ) : (
        <BrandMark className={cn("h-7 w-7", light ? "text-white" : "text-brand-600")} />
      )}
      <span className={cn("font-display text-lg font-bold tracking-tight", light ? "text-white" : "text-slate-900")}>
        medicom
      </span>
    </span>
  );
}
