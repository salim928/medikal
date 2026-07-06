"use client";

import { useAuth } from "@/hooks/useAuth-fresh";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Calendar, Scale, FileText, Activity, Briefcase, Gavel,
  Clock, ShieldCheck, MessageSquare, FileSignature,
} from "lucide-react";
import {
  WelcomeBanner, BannerButton, StatCard, Panel, QuickAction, PersonRow, ActivityFeed, DashboardSkeleton,
} from "@/components/dashboard/kit";
import { Badge } from "@/components/ui/Badge";

const consults = [
  { initials: "PM", name: "Patient — M. Addo", reason: "Consent & data-rights review", time: "10:00 AM", tag: "Consult" },
  { initials: "CL", name: "City Clinic Ltd.", reason: "Malpractice case review", time: "1:00 PM", tag: "Case" },
  { initials: "HR", name: "HR — MedGroup", reason: "Compliance advisory", time: "3:30 PM", tag: "Advisory" },
];

const cases = [
  { initials: "CL", name: "City Clinic — Negligence claim", note: "Discovery phase", level: "Active" },
  { initials: "RX", name: "Rx dispute — Pharmacy A", note: "Awaiting documents", level: "Pending" },
];

const activity = [
  { icon: FileSignature, text: "Reviewed consent form — M. Addo", time: "25m ago" },
  { icon: FileText, text: "Filed compliance memo — MedGroup", time: "2h ago" },
  { icon: Gavel, text: "Case note added — City Clinic", time: "Yesterday" },
];

export default function LawyerDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading) return <DashboardSkeleton />;
  if (!user) return null;

  const name = (user.user_metadata?.full_name as string) || (user.user_metadata?.name as string) || "Counsel";
  const last = name.split(" ").slice(-1)[0];

  return (
    <div className="space-y-8">
      <WelcomeBanner
        name={last}
        subtitle="3 consultations today and 2 active cases need your attention."
        actions={
          <>
            <BannerButton icon={Briefcase} label="Open cases" onClick={() => router.push("/records")} />
            <BannerButton icon={Calendar} label="Schedule" variant="outline" onClick={() => router.push("/appointments")} />
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Briefcase} label="Active cases" value="2" hint="1 in discovery" />
        <StatCard icon={Calendar} label="Consultations today" value="3" hint="Next: 10:00 AM" />
        <StatCard icon={FileSignature} label="Docs to review" value="7" hint="3 urgent" />
        <StatCard icon={ShieldCheck} label="Compliance items" value="5" hint="All on track" trend="up" />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Panel title="Today's consultations" action={{ label: "Full calendar", onClick: () => router.push("/appointments") }}>
            <div className="divide-y divide-slate-100">
              {consults.map((c) => (
                <PersonRow
                  key={c.initials}
                  initials={c.initials}
                  title={c.name}
                  subtitle={c.reason}
                  right={<p className="text-sm font-medium text-ink">{c.time}</p>}
                  badge={<Badge variant="soft">{c.tag}</Badge>}
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
              <QuickAction icon={Briefcase} label="Cases" onClick={() => router.push("/records")} />
              <QuickAction icon={FileText} label="Documents" onClick={() => router.push("/records")} />
              <QuickAction icon={Calendar} label="Schedule" onClick={() => router.push("/appointments")} />
              <QuickAction icon={MessageSquare} label="Messages" onClick={() => router.push("/notifications")} />
            </div>
          </Panel>

          <Panel title="Active cases">
            <div className="divide-y divide-slate-100">
              {cases.map((c) => (
                <PersonRow
                  key={c.initials}
                  initials={c.initials}
                  title={c.name}
                  subtitle={c.note}
                  badge={<Badge variant={c.level === "Active" ? "soft" : "warning"}>{c.level}</Badge>}
                  onClick={() => router.push("/records")}
                />
              ))}
            </div>
          </Panel>

          <div className="rounded-3xl border border-brand-100 bg-brand-50 p-6">
            <Scale className="h-6 w-6 text-brand-600" />
            <p className="mt-3 font-display font-semibold text-ink">Deadline reminder</p>
            <p className="mt-1 text-sm text-slate-600">
              City Clinic discovery documents are due in 4 days. 3 items still outstanding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
