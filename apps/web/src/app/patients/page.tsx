"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Search, Users, Activity, UserPlus, CalendarClock, MessageSquare,
  FileText, Phone, Mail, ChevronRight,
} from "lucide-react";
import { StatCard, Panel, DashboardSkeleton } from "@/components/dashboard/kit";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { patients, type PatientStatus } from "@/lib/data";

const filters: { id: "all" | PatientStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "new", label: "New" },
  { id: "inactive", label: "Inactive" },
];

const statusVariant: Record<PatientStatus, "success" | "soft" | "secondary"> = {
  active: "success",
  new: "soft",
  inactive: "secondary",
};

export default function PatientsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | PatientStatus>("all");

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  const results = useMemo(() => {
    return patients.filter((p) => {
      const matchesFilter = filter === "all" || p.status === filter;
      const q = query.toLowerCase();
      const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.condition.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [query, filter]);

  if (loading) return <DashboardSkeleton />;
  if (!user) return null;

  const active = patients.filter((p) => p.status === "active").length;
  const isNew = patients.filter((p) => p.status === "new").length;
  const upcoming = patients.reduce((n, p) => n + p.upcoming, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink">Patients</h1>
        <p className="mt-1 text-slate-600">Manage your patient list, records, and follow-ups.</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total patients" value={String(patients.length)} hint="Under your care" />
        <StatCard icon={Activity} label="Active" value={String(active)} hint="Seen recently" />
        <StatCard icon={UserPlus} label="New" value={String(isNew)} hint="This month" trend="up" />
        <StatCard icon={CalendarClock} label="Upcoming visits" value={String(upcoming)} hint="Scheduled" />
      </section>

      <Panel title={`All patients (${results.length})`}>
        {/* Search + filters */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative sm:max-w-xs sm:flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or condition…"
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-ink placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
            />
          </div>
          <div className="flex gap-1.5">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition",
                  filter === f.id ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-mist"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {results.length === 0 ? (
          <div className="py-12 text-center">
            <Users className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 text-slate-500">No patients match your search.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {results.map((p) => (
              <div key={p.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center">
                <button
                  onClick={() => router.push(`/patients/${p.id}`)}
                  className="flex flex-1 items-center gap-3 text-left"
                >
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 font-semibold text-brand-700">
                    {p.initials}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-semibold text-ink transition group-hover:text-brand-700">{p.name}</p>
                      <Badge variant={statusVariant[p.status]} className="capitalize">{p.status}</Badge>
                    </div>
                    <p className="truncate text-sm text-slate-500">
                      {p.age} · {p.gender} · {p.condition}
                    </p>
                  </div>
                </button>

                <div className="hidden items-center gap-8 text-sm lg:flex">
                  <div className="text-right">
                    <p className="text-slate-400">Last visit</p>
                    <p className="font-medium text-ink">{p.lastVisit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400">Records</p>
                    <p className="font-medium text-ink">{p.records}</p>
                  </div>
                  {p.upcoming > 0 && (
                    <Badge variant="soft" className="gap-1"><CalendarClock className="h-3.5 w-3.5" />{p.upcoming} upcoming</Badge>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button title="Message" className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-mist hover:text-brand-600"><MessageSquare className="h-4 w-4" /></button>
                  <button title="Call" className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-mist hover:text-brand-600"><Phone className="h-4 w-4" /></button>
                  <button
                    onClick={() => router.push(`/patients/${p.id}`)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
                  >
                    <span className="hidden sm:inline">View</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
