"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Calendar, Users, FileText, Activity, HeartPulse, ClipboardList,
  Thermometer, Pill, Clock, Syringe,
} from "lucide-react";
import {
  WelcomeBanner, BannerButton, StatCard, Panel, QuickAction, PersonRow, ActivityFeed, DashboardSkeleton,
} from "@/components/dashboard/kit";
import { Badge } from "@/components/ui/Badge";

const rounds = [
  { initials: "AB", name: "Akosua Boateng", reason: "Vitals check · Ward B", time: "8:30 AM" },
  { initials: "KM", name: "Kofi Mensah", reason: "Wound dressing", time: "9:45 AM" },
  { initials: "EN", name: "Efua Nyarko", reason: "Medication round", time: "11:00 AM" },
];

const tasks = [
  { initials: "TA", name: "Record vitals — Bed 12", note: "Due in 15 min", level: "Due" },
  { initials: "SG", name: "Administer meds — Bed 7", note: "Scheduled 11:00", level: "Upcoming" },
];

const activity = [
  { icon: Thermometer, text: "Logged vitals for A. Boateng", time: "10m ago" },
  { icon: Syringe, text: "Administered medication — Bed 4", time: "45m ago" },
  { icon: FileText, text: "Updated care note — K. Mensah", time: "2h ago" },
];

export default function NurseDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading) return <DashboardSkeleton />;
  if (!user) return null;

  const name = (user.user_metadata?.full_name as string) || (user.user_metadata?.name as string) || "Nurse";
  const first = name.split(" ")[0];

  return (
    <div className="space-y-8">
      <WelcomeBanner
        name={first}
        subtitle="You have 3 patient rounds and 2 tasks due this morning."
        actions={
          <>
            <BannerButton icon={ClipboardList} label="Start rounds" onClick={() => router.push("/patients")} />
            <BannerButton icon={Thermometer} label="Log vitals" variant="outline" onClick={() => router.push("/patients")} />
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Assigned patients" value="12" hint="Ward B" />
        <StatCard icon={ClipboardList} label="Tasks due" value="2" hint="1 within 15 min" />
        <StatCard icon={Pill} label="Medication rounds" value="3" hint="Next: 11:00 AM" />
        <StatCard icon={HeartPulse} label="Vitals logged" value="18" hint="Today" trend="up" />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Panel title="Today's rounds" action={{ label: "All patients", onClick: () => router.push("/patients") }}>
            <div className="divide-y divide-slate-100">
              {rounds.map((r) => (
                <PersonRow
                  key={r.initials}
                  initials={r.initials}
                  title={r.name}
                  subtitle={r.reason}
                  badge={<Badge variant="soft" className="gap-1"><Clock className="h-3.5 w-3.5" />{r.time}</Badge>}
                  onClick={() => router.push("/patients")}
                />
              ))}
            </div>
          </Panel>

          <Panel title="Recent activity">
            <ActivityFeed items={activity} />
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Quick actions">
            <div className="grid grid-cols-2 gap-3">
              <QuickAction icon={Users} label="Patients" onClick={() => router.push("/patients")} />
              <QuickAction icon={Calendar} label="Appointments" onClick={() => router.push("/appointments")} />
              <QuickAction icon={FileText} label="Records" onClick={() => router.push("/records")} />
              <QuickAction icon={Pill} label="Prescriptions" onClick={() => router.push("/prescriptions")} />
            </div>
          </Panel>

          <Panel title="Pending tasks">
            <div className="divide-y divide-slate-100">
              {tasks.map((t) => (
                <PersonRow
                  key={t.initials}
                  initials={t.initials}
                  title={t.name}
                  subtitle={t.note}
                  badge={<Badge variant={t.level === "Due" ? "warning" : "secondary"}>{t.level}</Badge>}
                />
              ))}
            </div>
          </Panel>

          <div className="rounded-3xl border border-brand-100 bg-brand-50 p-6">
            <Activity className="h-6 w-6 text-brand-600" />
            <p className="mt-3 font-display font-semibold text-ink">Shift summary</p>
            <p className="mt-1 text-sm text-slate-600">
              Morning shift · 6h remaining. All critical vitals stable across your ward.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
