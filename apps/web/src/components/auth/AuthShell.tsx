import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";

/**
 * Calm, centered auth layout (Apple aesthetic): soft off-white canvas,
 * generous whitespace, a single airy card, restrained accent.
 */
export function AuthShell({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="flex items-center justify-center py-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-600 text-white">
            <BrandMark className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            medicom
          </span>
        </Link>
      </header>

      <main className="flex flex-1 items-start justify-center px-6 pb-24 pt-6 sm:pt-10">
        <div className="w-full max-w-[400px]">
          <div className="rounded-3xl border border-slate-200/70 bg-white p-8 shadow-soft sm:p-10">
            {children}
          </div>
          {footer && (
            <div className="mt-6 text-center text-sm text-ink-soft">{footer}</div>
          )}
        </div>
      </main>
    </div>
  );
}
