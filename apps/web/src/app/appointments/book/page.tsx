"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Calendar, Clock, Video, MapPin, 
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { careServices as services, providerOptions, consultTimes as times } from "@/lib/data";
import { useDemoStore } from "@/lib/data/store";
import { useToast } from "@/components/ui/toast";

const doctors = providerOptions();

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
      <h2 className="mb-4 font-display text-base font-semibold text-ink">{title}</h2>
      {children}
    </section>
  );
}

export default function BookAppointmentPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const bookAppointment = useDemoStore((s) => s.bookAppointment);
  const toast = useToast();
  const [form, setForm] = useState({
    service: "primary", doctor: "", date: "", time: "", visit: "video", reason: "",
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, loading, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.time) {
      toast.error("Please pick a time for your visit");
      return;
    }
    // The provider dropdown holds "Name — Specialty" labels from providerOptions().
    const [doctorName, specialty = "General Practice"] = form.doctor.split(" — ");
    const initials = doctorName
      .replace(/^Dr\.?\s*/i, "")
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    const prettyDate = new Date(form.date).toLocaleDateString(undefined, {
      weekday: "short", month: "short", day: "numeric",
    });
    bookAppointment({
      doctor: doctorName,
      specialty,
      date: prettyDate,
      time: form.time,
      mode: form.visit === "video" ? "Video" : "In-person",
      initials,
      reason: form.reason,
    });
    toast.success(`Visit booked with ${doctorName} — ${prettyDate} at ${form.time}`);
    router.push("/appointments");
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-brand-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink">Book a visit</h1>
        <p className="mt-1 text-slate-600">See a licensed doctor over secure video, or in person — usually within minutes.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card title="What do you need care for?">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {services.map((s) => {
              const active = form.service === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setForm({ ...form, service: s.id })}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-3 text-left transition",
                    active ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500/20" : "border-slate-200 hover:border-brand-200 hover:bg-mist"
                  )}
                >
                  <span className={cn("flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg", active ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-600")}>
                    <s.icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-semibold text-ink">{s.label}</span>
                </button>
              );
            })}
          </div>
        </Card>

        <Card title="Choose a provider">
          <select
            value={form.doctor}
            onChange={(e) => setForm({ ...form, doctor: e.target.value })}
            required
            className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
          >
            <option value="">Select a provider…</option>
            {doctors.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </Card>

        <div className="grid gap-6 sm:grid-cols-2">
          <Card title="Date">
            <div className="relative">
              <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                value={form.date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
                className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
              />
            </div>
          </Card>
          <Card title="Time">
            <div className="grid grid-cols-3 gap-2">
              {times.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm({ ...form, time: t })}
                  className={cn(
                    "flex items-center justify-center gap-1 rounded-lg border py-2 text-xs font-medium transition",
                    form.time === t ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-200 text-slate-600 hover:border-brand-200 hover:bg-mist"
                  )}
                >
                  <Clock className="h-3 w-3" /> {t}
                </button>
              ))}
            </div>
          </Card>
        </div>

        <Card title="How would you like to be seen?">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { id: "video", icon: Video, title: "Video visit", desc: "Talk to a doctor from home" },
              { id: "in-person", icon: MapPin, title: "In person", desc: "Visit a nearby clinic" },
            ].map((v) => {
              const active = form.visit === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setForm({ ...form, visit: v.id })}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-4 text-left transition",
                    active ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500/20" : "border-slate-200 hover:border-brand-200 hover:bg-mist"
                  )}
                >
                  <span className={cn("flex h-10 w-10 items-center justify-center rounded-lg", active ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-600")}>
                    <v.icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">{v.title}</span>
                    <span className="block text-xs text-slate-500">{v.desc}</span>
                  </span>
                  {active && <Check className="ml-auto h-5 w-5 text-brand-600" />}
                </button>
              );
            })}
          </div>
        </Card>

        <Card title="Reason for visit">
          <textarea
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            rows={3}
            required
            placeholder="Briefly describe your symptoms or reason for the visit…"
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
          />
        </Card>

        <div className="flex gap-3">
          <Button type="submit" size="lg" className="flex-1">Confirm booking</Button>
          <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
