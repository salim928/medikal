"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Calendar, Clock, CheckCircle, XCircle, Search, Video } from "lucide-react";
import { useDemoStore } from "@/lib/data/store";
import { useToast } from "@/components/ui/toast";
import { PageSpinner } from "@/components/ui/Spinner";
import { statusClass } from "@/lib/ui/status";
import type { AppointmentStatus } from "@/lib/data";

const filters: { id: "all" | AppointmentStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "scheduled", label: "Scheduled" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

export default function AppointmentsPage() {
  const { isAuthenticated, loading, role } = useAuth();
  const appointments = useDemoStore((s) => s.appointments);
  const cancelAppointment = useDemoStore((s) => s.cancelAppointment);
  const completeAppointment = useDemoStore((s) => s.completeAppointment);
  const toast = useToast();
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState<"all" | AppointmentStatus>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const isProvider = role !== "patient";

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  const stats = useMemo(
    () => ({
      today: appointments.filter((a) => a.date === "Today" && a.status === "scheduled").length,
      scheduled: appointments.filter((a) => a.status === "scheduled").length,
      completed: appointments.filter((a) => a.status === "completed").length,
      cancelled: appointments.filter((a) => a.status === "cancelled").length,
    }),
    [appointments]
  );

  const filteredAppointments = useMemo(() => {
    let filtered = appointments;
    if (filterStatus !== "all") {
      filtered = filtered.filter((a) => a.status === filterStatus);
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.doctor.toLowerCase().includes(q) ||
          (a.patient ?? "").toLowerCase().includes(q) ||
          (a.reason ?? "").toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [appointments, filterStatus, searchTerm]);

  const handleCancel = (id: string) => {
    cancelAppointment(id);
    toast.success("Appointment cancelled");
  };

  const handleComplete = (id: string) => {
    completeAppointment(id);
    toast.success("Appointment marked as completed");
  };

  if (loading) return <PageSpinner label="Loading appointments…" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg border border-slate-200 bg-gradient-to-r from-brand-500/10 to-brand-500/10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-brand-600" />
            <div>
              <h1 className="font-display text-3xl font-bold text-ink">
                {isProvider ? "Appointment management" : "My appointments"}
              </h1>
              <p className="mt-1 text-slate-600">
                {isProvider
                  ? "Manage patient appointments and your schedule"
                  : "View and manage your scheduled appointments"}
              </p>
            </div>
          </div>

          {isProvider ? (
            <Button asChild className="bg-brand-600 hover:bg-brand-700">
              <Link href="/appointments/availability">Set availability</Link>
            </Button>
          ) : (
            <Button asChild className="bg-brand-600 hover:bg-brand-700">
              <Link href="/appointments/book">Book new appointment</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { icon: Clock, value: stats.today, label: "Today", color: "text-brand-600" },
          { icon: Calendar, value: stats.scheduled, label: "Scheduled", color: "text-blue-600" },
          { icon: CheckCircle, value: stats.completed, label: "Completed", color: "text-emerald-600" },
          { icon: XCircle, value: stats.cancelled, label: "Cancelled", color: "text-red-600" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <s.icon className={`h-8 w-8 ${s.color}`} />
              <div>
                <p className="text-2xl font-bold text-ink">{s.value}</p>
                <p className="text-sm text-slate-500">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={isProvider ? "Search by patient or reason…" : "Search appointments…"}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-canvas py-2 pl-10 pr-4 text-ink placeholder-slate-400 focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  filterStatus === f.id ? "bg-brand-600 text-white" : "bg-mist text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
            <Calendar className="mx-auto mb-4 h-16 w-16 text-slate-300" />
            <p className="mb-4 text-slate-500">No appointments found</p>
            {!isProvider && (
              <Button asChild className="bg-brand-600 hover:bg-brand-700">
                <Link href="/appointments/book">Book your first appointment</Link>
              </Button>
            )}
          </div>
        ) : (
          filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="rounded-lg border border-slate-200 bg-white p-6 transition hover:border-brand-500/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-1 items-start gap-4">
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 font-semibold text-brand-700">
                    {appointment.initials}
                  </span>
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-semibold text-ink">
                        {isProvider ? appointment.patient ?? appointment.doctor : appointment.doctor}
                      </h3>
                      <span className={`rounded-full border px-3 py-1 text-sm capitalize ${statusClass(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 text-slate-600 md:grid-cols-3">
                      <div>
                        <p className="text-sm text-slate-500">Date &amp; time</p>
                        <p className="font-medium">
                          {appointment.date} at {appointment.time}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">{isProvider ? "Specialty" : "Doctor's specialty"}</p>
                        <p className="font-medium">{appointment.specialty}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Visit type</p>
                        <p className="font-medium">{appointment.mode}</p>
                      </div>
                    </div>

                    {appointment.reason && (
                      <div className="mt-3 rounded-lg bg-mist p-3">
                        <p className="text-sm text-slate-500">Reason:</p>
                        <p className="text-slate-600">{appointment.reason}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="ml-4 flex flex-col gap-2">
                  {appointment.status === "scheduled" && appointment.mode === "Video" && (
                    <Button asChild className="bg-brand-500 hover:bg-brand-600">
                      <Link href={`/consultation/${appointment.id}`}>
                        <Video className="mr-2 h-4 w-4" />
                        Join video call
                      </Link>
                    </Button>
                  )}

                  <Button asChild className="bg-brand-600 hover:bg-brand-700">
                    <Link href={`/appointments/${appointment.id}`}>View details</Link>
                  </Button>

                  {appointment.status === "scheduled" && (
                    <>
                      {isProvider ? (
                        <Button onClick={() => handleComplete(appointment.id)} className="bg-emerald-600 hover:bg-emerald-700">
                          Complete
                        </Button>
                      ) : (
                        <Button asChild className="bg-brand-500 hover:bg-brand-600">
                          <Link href={`/appointments/${appointment.id}/reschedule`}>Reschedule</Link>
                        </Button>
                      )}
                      <Button onClick={() => handleCancel(appointment.id)} className="bg-red-500 hover:bg-red-600">
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
