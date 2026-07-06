"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, Bell, ArrowLeft } from "lucide-react";

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  // Show a back button everywhere except the dashboard home.
  const isHome = pathname === "/dashboard" || /^\/dashboard\/[^/]+$/.test(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <button
        onClick={onMenu}
        className="rounded-lg p-2 text-slate-500 transition hover:bg-mist hover:text-ink lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {!isHome && (
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-mist hover:text-ink"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back</span>
        </button>
      )}

      {/* Search */}
      <div className="relative hidden max-w-md flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Search patients, records, appointments…"
          className="h-10 w-full rounded-xl border border-slate-200 bg-mist pl-9 pr-3 text-sm text-ink placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/15"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <Link
          href="/notifications"
          className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-mist hover:text-ink"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </Link>
      </div>
    </header>
  );
}
