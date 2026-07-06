"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Calendar, Clock } from "lucide-react";
import { useDemoStore, getAppointment } from "@/lib/data/store";
import { consultTimes } from "@/lib/data";
import { useToast } from "@/components/ui/toast";
import { PageSpinner } from "@/components/ui/Spinner";

export default function ReschedulePage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const appointments = useDemoStore((s) => s.appointments);
  const rescheduleAppointment = useDemoStore((s) => s.rescheduleAppointment);
  const toast = useToast();
  const appointment = getAppointment(appointments, id);

  const [formData, setFormData] = useState({ date: "", time: "", reason: "" });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) return <PageSpinner />;

  if (!appointment) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-semibold text-ink">Appointment not found</p>
        <button
          onClick={() => router.push("/appointments")}
          className="mt-3 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          Back to appointments
        </button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pretty = new Date(formData.date).toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    rescheduleAppointment(appointment.id, pretty, formData.time);
    toast.success(`Appointment moved to ${pretty} at ${formData.time}`);
    router.push("/appointments");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-lg border border-blue-500/30 bg-gradient-to-r from-brand-500/10 to-brand-500/10 p-6">
        <h1 className="font-display text-3xl font-bold text-ink">Reschedule appointment</h1>
        <p className="mt-1 text-slate-600">
          {appointment.doctor} · currently {appointment.date} at {appointment.time}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <label htmlFor="new-date" className="mb-3 block font-semibold text-ink">
              <Calendar className="mr-2 inline h-5 w-5" />
              New date
            </label>
            <input
              id="new-date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              min={new Date().toISOString().split("T")[0]}
              className="w-full rounded-lg border border-slate-200 bg-canvas px-4 py-3 text-ink focus:border-brand-500 focus:outline-none"
              required
            />
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <label htmlFor="new-time" className="mb-3 block font-semibold text-ink">
              <Clock className="mr-2 inline h-5 w-5" />
              New time
            </label>
            <select
              id="new-time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-canvas px-4 py-3 text-ink focus:border-brand-500 focus:outline-none"
              required
            >
              <option value="">Select time…</option>
              {consultTimes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <label htmlFor="reason" className="mb-3 block font-semibold text-ink">
            Reason for rescheduling
          </label>
          <textarea
            id="reason"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            placeholder="Optional: let us know why you need to reschedule…"
            rows={4}
            className="w-full rounded-lg border border-slate-200 bg-canvas px-4 py-3 text-ink placeholder-slate-400 focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" className="flex-1 bg-brand-600 py-3 hover:bg-brand-700">
            Confirm reschedule
          </Button>
          <Button
            type="button"
            onClick={() => router.back()}
            className="bg-mist py-3 text-slate-700 hover:bg-slate-200"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
