"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import {
  Video, MessageSquare, Phone, Mail, FileText, Pill, FlaskConical,
  CalendarClock, ArrowRight, CalendarPlus,
} from "lucide-react";
import { Panel, StatCard, DashboardSkeleton } from "@/components/dashboard/kit";
import { Badge } from "@/components/ui/Badge";
import { getPatient, patientRecords, patientMedications } from "@/lib/data";
import { useDemoStore } from "@/lib/data/store";

const recordIcon: Record<string, typeof FileText> = {
  "Lab result": FlaskConical,
  Imaging: FileText,
  "Visit note": FileText,
};

export default function PatientDetailPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const patient = getPatient(id);
  const appointments = useDemoStore((s) => s.appointments);
  const upcomingAppointments = appointments.filter((a) => a.status === "scheduled");

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading) return <DashboardSkeleton />;
  if (!user) return null;

  if (!patient) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-semibold text-ink">Patient not found</p>
        <button onClick={() => router.push("/patients")} className="mt-3 text-sm font-semibold text-brand-600 hover:text-brand-700">
          Back to patients
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:flex-row sm:items-center">
        <span className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-xl font-bold text-brand-700">
          {patient.initials}
        </span>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink">{patient.name}</h1>
            <Badge variant={patient.status === "active" ? "success" : patient.status === "new" ? "soft" : "secondary"} className="capitalize">
              {patient.status}
            </Badge>
          </div>
          <p className="mt-1 text-slate-600">{patient.age} · {patient.gender} · {patient.condition}</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500">
            <span className="flex items-center gap-1.5"><Phone className="h-4 w-4" /> {patient.phone}</span>
            <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" /> {patient.email}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => router.push("/appointments/book")} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700">
            <Video className="h-4 w-4" /> Start visit
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-mist">
            <MessageSquare className="h-4 w-4" /> Message
          </button>
        </div>
      </div>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={CalendarClock} label="Upcoming visits" value={String(patient.upcoming)} hint="Scheduled" />
        <StatCard icon={FileText} label="Records" value={String(patient.records)} hint="On file" />
        <StatCard icon={CalendarPlus} label="Last visit" value={patient.lastVisit.split(",")[0]} hint={patient.lastVisit.split(",")[1]?.trim()} />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Panel title="Medical records" action={{ label: "View all", onClick: () => router.push("/records") }}>
            <div className="divide-y divide-slate-100">
              {patientRecords.map((r) => {
                const Icon = recordIcon[r.type] || FileText;
                return (
                  <div key={r.title} className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Icon className="h-5 w-5" /></span>
                    <div className="flex-1">
                      <p className="font-medium text-ink">{r.title}</p>
                      <p className="text-sm text-slate-500">{r.type} · {r.date}</p>
                    </div>
                    <button onClick={() => router.push("/records")} className="rounded-lg p-2 text-slate-400 transition hover:bg-mist hover:text-ink"><ArrowRight className="h-4 w-4" /></button>
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel title="Medications" action={{ label: "Prescribe", onClick: () => router.push("/prescriptions/write") }}>
            <div className="divide-y divide-slate-100">
              {patientMedications.map((m) => (
                <div key={m.name} className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Pill className="h-5 w-5" /></span>
                  <div className="flex-1">
                    <p className="font-medium text-ink">{m.name}</p>
                    <p className="text-sm text-slate-500">{m.dosage}</p>
                  </div>
                  <Badge variant={m.status === "active" ? "success" : "secondary"} className="capitalize">{m.status}</Badge>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Upcoming appointments">
            {patient.upcoming > 0 ? (
              <div className="divide-y divide-slate-100">
                {upcomingAppointments.slice(0, patient.upcoming).map((a) => (
                  <div key={a.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><CalendarClock className="h-5 w-5" /></span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-ink">{a.date} · {a.time}</p>
                      <p className="text-xs text-slate-500">{a.mode}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-slate-500">No upcoming appointments.</p>
            )}
          </Panel>

          <div className="rounded-3xl border border-brand-100 bg-brand-50 p-6">
            <FileText className="h-6 w-6 text-brand-600" />
            <p className="mt-3 font-display font-semibold text-ink">Care summary</p>
            <p className="mt-1 text-sm text-slate-600">
              {patient.name} is managed for {patient.condition.toLowerCase()}. Last seen {patient.lastVisit}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
