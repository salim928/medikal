"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Calendar, Users, FileText, Baby, HeartPulse,
  ClipboardList, Pill,
} from "lucide-react";
import {
  WelcomeBanner, BannerButton, StatCard, Panel, QuickAction, PersonRow, ActivityFeed, DashboardSkeleton,
} from "@/components/dashboard/kit";
import { Badge } from "@/components/ui/Badge";
import { midwifeVisits as visits, midwifeDue as due } from "@/lib/data";



const activity = [
  { icon: HeartPulse, text: "Recorded fetal heartbeat — A. Owusu", time: "30m ago" },
  { icon: FileText, text: "Updated birth plan — G. Danso", time: "1h ago" },
  { icon: Baby, text: "Postpartum check completed — Day 5", time: "Yesterday" },
];

export default function MidwifeDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading) return <DashboardSkeleton />;
  if (!user) return null;

  const name = (user.user_metadata?.full_name as string) || (user.user_metadata?.name as string) || "Midwife";
  const first = name.split(" ")[0];

  return (
    <div className="space-y-8">
      <WelcomeBanner
        name={first}
        subtitle="3 antenatal visits today and 2 mothers approaching their due date."
        actions={
          <>
            <BannerButton icon={Calendar} label="View schedule" onClick={() => router.push("/appointments")} />
            <BannerButton icon={ClipboardList} label="Care plans" variant="outline" onClick={() => router.push("/records")} />
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Calendar} label="Today's visits" value="3" hint="Next: 9:00 AM" />
        <StatCard icon={Users} label="Mothers in care" value="24" hint="18 antenatal" />
        <StatCard icon={Baby} label="Due this month" value="5" hint="1 within a week" />
        <StatCard icon={HeartPulse} label="Checks completed" value="14" hint="This week" trend="up" />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Panel title="Today's visits" action={{ label: "Full calendar", onClick: () => router.push("/appointments") }}>
            <div className="divide-y divide-slate-100">
              {visits.map((v) => (
                <PersonRow
                  key={v.initials}
                  initials={v.initials}
                  title={v.name}
                  subtitle={v.reason}
                  right={<p className="text-sm font-medium text-ink">{v.time}</p>}
                  badge={<Badge variant={v.tag === "Antenatal" ? "soft" : "secondary"}>{v.tag}</Badge>}
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
              <QuickAction icon={Users} label="Mothers" onClick={() => router.push("/patients")} />
              <QuickAction icon={FileText} label="Records" onClick={() => router.push("/records")} />
              <QuickAction icon={Calendar} label="Appointments" onClick={() => router.push("/appointments")} />
              <QuickAction icon={Pill} label="Prescriptions" onClick={() => router.push("/prescriptions")} />
            </div>
          </Panel>

          <Panel title="Approaching due date">
            <div className="divide-y divide-slate-100">
              {due.map((d) => (
                <PersonRow
                  key={d.initials}
                  initials={d.initials}
                  title={d.name}
                  subtitle={d.note}
                  badge={<Badge variant={d.level === "Wk 37" ? "warning" : "soft"}>{d.level}</Badge>}
                  onClick={() => router.push("/patients")}
                />
              ))}
            </div>
          </Panel>

          <div className="rounded-3xl border border-brand-100 bg-brand-50 p-6">
            <Baby className="h-6 w-6 text-brand-600" />
            <p className="mt-3 font-display font-semibold text-ink">Care reminder</p>
            <p className="mt-1 text-sm text-slate-600">
              Yaa Mensah is 37 weeks — schedule a final birth-plan review this week.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
