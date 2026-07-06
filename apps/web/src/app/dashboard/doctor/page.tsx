
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Calendar, Users, FileText, Clock, Video, Pill,
  AlertTriangle, Activity, ClipboardList, ShieldCheck,
} from "lucide-react";
import {
  WelcomeBanner, BannerButton, StatCard, Panel, QuickAction, PersonRow, ActivityFeed, DashboardSkeleton,
} from "@/components/dashboard/kit";
import { Badge } from "@/components/ui/Badge";

const schedule = [
  { initials: "JP", name: "John Parker", reason: "Follow-up · Hypertension", time: "9:00 AM", mode: "Video" },
  { initials: "MA", name: "Mariam Ahmed", reason: "New patient · Migraine", time: "10:30 AM", mode: "In-person" },
  { initials: "LT", name: "Louis Tanoh", reason: "Lab review", time: "1:15 PM", mode: "Video" },
];

const triage = [
  { initials: "RB", name: "Rita Boateng", note: "Chest pain · flagged high", level: "High" },
  { initials: "SK", name: "Sam Kofi", note: "Persistent cough", level: "Medium" },
];

const activity = [
  { icon: Pill, text: "Signed prescription for M. Ahmed", time: "20m ago" },
  { icon: FileText, text: "Completed clinical note — J. Parker", time: "1h ago" },
  { icon: Video, text: "Consultation completed with L. Tanoh", time: "Yesterday" },
];

export default function DoctorDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading) return <DashboardSkeleton />;
  if (!user) return null;

  const name = (user.user_metadata?.full_name as string) || (user.user_metadata?.name as string) || "Doctor";
  const last = name.split(" ").slice(-1)[0];

  return (
    <div className="space-y-8">
      <WelcomeBanner
        name={`Dr. ${last}`}
        subtitle="You have 3 appointments and 2 patients awaiting triage today."
        actions={
          <>
            <BannerButton icon={Video} label="Start consultation" onClick={() => router.push("/appointments")} />
            <BannerButton icon={ClipboardList} label="Triage queue" variant="outline" onClick={() => router.push("/triage-queue")} />
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Calendar} label="Today's appointments" value="3" hint="Next: 9:00 AM" />
        <StatCard icon={Users} label="Patients this week" value="28" hint="+6 vs last week" trend="up" />
        <StatCard icon={AlertTriangle} label="Awaiting triage" value="2" hint="1 high priority" />
        <StatCard icon={Pill} label="Scripts to sign" value="4" hint="2 controlled" />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Panel title="Today's schedule" action={{ label: "Full calendar", onClick: () => router.push("/appointments") }}>
            <div className="divide-y divide-slate-100">
              {schedule.map((s) => (
                <PersonRow
                  key={s.initials}
                  initials={s.initials}
                  title={s.name}
                  subtitle={s.reason}
                  right={<p className="text-sm font-medium text-ink">{s.time}</p>}
                  badge={
                    <Badge variant={s.mode === "Video" ? "soft" : "secondary"} className="gap-1">
                      {s.mode === "Video" ? <Video className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                      {s.mode}
                    </Badge>
                  }
                  onClick={() => router.push("/appointments")}
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
              <QuickAction icon={Pill} label="Prescriptions" onClick={() => router.push("/prescriptions")} />
              <QuickAction icon={FileText} label="Records" onClick={() => router.push("/records")} />
              <QuickAction icon={ShieldCheck} label="Verify drug" onClick={() => router.push("/verify-drug")} />
            </div>
          </Panel>

          <Panel title="Triage queue" action={{ label: "Open", onClick: () => router.push("/triage-queue") }}>
            <div className="divide-y divide-slate-100">
              {triage.map((t) => (
                <PersonRow
                  key={t.initials}
                  initials={t.initials}
                  title={t.name}
                  subtitle={t.note}
                  badge={<Badge variant={t.level === "High" ? "destructive" : "warning"}>{t.level}</Badge>}
                  onClick={() => router.push("/triage-queue")}
                />
              ))}
            </div>
          </Panel>

          <div className="rounded-3xl border border-brand-100 bg-brand-50 p-6">
            <Activity className="h-6 w-6 text-brand-600" />
            <p className="mt-3 font-display font-semibold text-ink">Verification status</p>
            <p className="mt-1 text-sm text-slate-600">
              Your medical license is under review. Full prescribing is enabled once verified.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
