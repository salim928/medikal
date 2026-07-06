"use client";

import { useAuth } from "@/hooks/useAuth-fresh";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/auth-fresh";
import {
  Calendar, FileText, Video, Pill, FlaskConical, MessageSquare, HeartPulse,
  ShieldCheck, PlusCircle, Brain, User, Baby, Activity, Clock, ArrowRight, Check,
} from "lucide-react";
import {
  WelcomeBanner, BannerButton, StatCard, Panel, QuickAction, PersonRow, ActivityFeed, DashboardSkeleton,
} from "@/components/dashboard/kit";
import { Badge } from "@/components/ui/Badge";
import {
  careServices, upcomingAppointments, patientActivity, careTeam,
} from "@/lib/data";

interface PatientProfile {
  full_name: string; phone: string; date_of_birth: string; gender: string; blood_type?: string; email: string;
}

export default function PatientDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<PatientProfile | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    supabase.from("patient_profiles").select("*").eq("id", user.id).single().then(
      ({ data }) => { if (data) setProfile(data as PatientProfile); },
      () => {}
    );
  }, [user]);

  if (loading) return <DashboardSkeleton />;
  if (!user) return null;

  const name = profile?.full_name || (user.user_metadata?.full_name as string) || (user.user_metadata?.name as string) || "there";
  const firstName = name.split(" ")[0];

  return (
    <div className="space-y-8">
      <WelcomeBanner
        name={firstName}
        subtitle="See a licensed doctor in minutes over secure video, or check your symptoms to get started."
        actions={
          <>
            <BannerButton icon={Video} label="Start a video visit" onClick={() => router.push("/appointments/book")} />
            <BannerButton icon={Activity} label="Check symptoms" variant="outline" onClick={() => router.push("/symptom-checker")} />
          </>
        }
      />

      {/* KPIs mirror the landing's four pillars: visits, prescriptions, labs, follow-up */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Video} label="Upcoming visits" value="2" hint="Next: today 3:30 PM" />
        <StatCard icon={Pill} label="Active prescriptions" value="3" hint="1 refill available" />
        <StatCard icon={FlaskConical} label="Lab results" value="1" hint="Ready to view" />
        <StatCard icon={MessageSquare} label="Care messages" value="5" hint="From your care team" />
      </section>

      {/* Care services — the 6 categories from the landing page */}
      <Panel title="Get care now" action={{ label: "All services", onClick: () => router.push("/appointments/book") }}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {careServices.map((s) => (
            <button
              key={s.label}
              onClick={() => router.push("/appointments/book")}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-center transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card-hover"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                <s.icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold text-ink">{s.label}</span>
              <span className="text-xs text-slate-500">{s.description}</span>
            </button>
          ))}
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Panel title="Upcoming appointments" action={{ label: "View all", onClick: () => router.push("/appointments") }}>
            <div className="divide-y divide-slate-100">
              {upcomingAppointments.map((a) => (
                <PersonRow
                  key={a.id}
                  initials={a.initials}
                  title={a.doctor}
                  subtitle={a.specialty}
                  right={<><p className="text-sm font-medium text-ink">{a.date}</p><p className="text-sm text-slate-500">{a.time}</p></>}
                  badge={
                    <Badge variant={a.mode === "Video" ? "soft" : "secondary"} className="gap-1">
                      {a.mode === "Video" ? <Video className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                      {a.mode}
                    </Badge>
                  }
                  onClick={() => router.push("/appointments")}
                />
              ))}
            </div>
          </Panel>

          <Panel title="Recent activity">
            <ActivityFeed items={patientActivity} />
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Quick actions">
            <div className="grid grid-cols-2 gap-3">
              <QuickAction icon={Video} label="Video visit" onClick={() => router.push("/appointments/book")} />
              <QuickAction icon={FlaskConical} label="Lab orders" onClick={() => router.push("/records")} />
              <QuickAction icon={Pill} label="Prescriptions" onClick={() => router.push("/prescriptions")} />
              <QuickAction icon={FileText} label="Records" onClick={() => router.push("/records")} />
            </div>
          </Panel>

          <Panel title="Your care team">
            <ul className="space-y-3">
              {careTeam.map((m) => (
                <li key={m.name} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">{m.initials}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ink">{m.name}</p>
                    <p className="text-xs text-slate-500">{m.role}</p>
                  </div>
                  <button className="rounded-lg p-1.5 text-slate-400 transition hover:bg-mist hover:text-brand-600"><MessageSquare className="h-4 w-4" /></button>
                </li>
              ))}
            </ul>
          </Panel>

          {/* Follow-up care card — matches the landing's "Follow-Up Care" pillar */}
          <div className="rounded-3xl border border-brand-100 bg-brand-50 p-6">
            <HeartPulse className="h-6 w-6 text-brand-600" />
            <p className="mt-3 font-display font-semibold text-ink">Follow-up care</p>
            <p className="mt-1 text-sm text-slate-600">
              Dr. Mensah recommended a check-in next week. We&apos;ll remind you when it&apos;s time to book.
            </p>
            <button onClick={() => router.push("/appointments/book")} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700">
              Schedule follow-up <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
