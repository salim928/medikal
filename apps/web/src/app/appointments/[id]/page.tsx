"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Calendar, Clock, User, MapPin, FileText, Video } from "lucide-react";
import Link from "next/link";
import { useDemoStore, getAppointment } from "@/lib/data/store";
import { patients } from "@/lib/data";
import { useToast } from "@/components/ui/toast";
import { PageSpinner } from "@/components/ui/Spinner";
import { statusClass } from "@/lib/ui/status";

export default function AppointmentDetailsPage() {
  const { isAuthenticated, loading, role } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const appointments = useDemoStore((s) => s.appointments);
  const cancelAppointment = useDemoStore((s) => s.cancelAppointment);
  const completeAppointment = useDemoStore((s) => s.completeAppointment);
  const toast = useToast();

  const appointment = getAppointment(appointments, id);
  const isProvider = role !== "patient";
  // Link provider view to the real patient record when the names match.
  const patientRecord = appointment?.patient
    ? patients.find((p) => p.name === appointment.patient) ?? null
    : null;

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

  const handleCancel = () => {
    cancelAppointment(appointment.id);
    toast.success("Appointment cancelled");
    router.push("/appointments");
  };

  const handleComplete = () => {
    completeAppointment(appointment.id);
    toast.success("Appointment marked as completed");
    router.push("/appointments");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="rounded-lg border border-slate-200 bg-gradient-to-r from-brand-500/10 to-brand-500/10 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-brand-600" />
            <div>
              <h1 className="font-display text-3xl font-bold text-ink">Appointment details</h1>
              <p className="mt-1 text-slate-600">
                {appointment.date} · {appointment.time}
              </p>
            </div>
          </div>
          <span className={`rounded-full border px-4 py-2 text-sm font-semibold capitalize ${statusClass(appointment.status)}`}>
            {appointment.status}
          </span>
        </div>
      </div>

      {/* Main Details */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-ink">
            <User className="h-5 w-5 text-brand-600" />
            {isProvider ? "Patient" : "Doctor"}
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-slate-500">Name</p>
              <p className="font-medium text-ink">
                {isProvider ? appointment.patient ?? "—" : appointment.doctor}
              </p>
            </div>
            {isProvider && patientRecord ? (
              <>
                <div>
                  <p className="text-sm text-slate-500">Condition</p>
                  <p className="font-medium text-ink">{patientRecord.condition}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Contact</p>
                  <p className="font-medium text-ink">{patientRecord.phone}</p>
                </div>
              </>
            ) : (
              <div>
                <p className="text-sm text-slate-500">Specialty</p>
                <p className="font-medium text-ink">{appointment.specialty}</p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-ink">
            <Calendar className="h-5 w-5 text-brand-600" />
            Appointment information
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-slate-500">Date</p>
              <p className="font-medium text-ink">{appointment.date}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Time</p>
              <p className="flex items-center gap-2 font-medium text-ink">
                <Clock className="h-4 w-4 text-brand-600" />
                {appointment.time}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Visit type</p>
              <p className="flex items-center gap-2 font-medium text-ink">
                {appointment.mode === "Video" ? (
                  <>
                    <Video className="h-4 w-4 text-brand-600" /> Video visit
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4 text-brand-600" /> In-person visit
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reason */}
      {appointment.reason && (
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-ink">
            <FileText className="h-5 w-5 text-brand-600" />
            Visit details
          </h2>
          <p className="text-sm text-slate-500">Reason for visit</p>
          <p className="mt-1 text-ink">{appointment.reason}</p>
        </div>
      )}

      {/* Actions */}
      {appointment.status === "scheduled" && (
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-ink">Actions</h2>
          <div className="flex flex-wrap gap-3">
            {appointment.mode === "Video" && (
              <Button asChild className="bg-brand-500 hover:bg-brand-600 text-white">
                <Link href={`/consultation/${appointment.id}`}>
                  <Video className="mr-2 h-4 w-4" />
                  Join video call
                </Link>
              </Button>
            )}

            {isProvider ? (
              <>
                <Button onClick={handleComplete} className="bg-emerald-600 hover:bg-emerald-700">
                  Mark as complete
                </Button>
                {patientRecord && (
                  <Button asChild className="bg-brand-500 hover:bg-brand-600">
                    <Link href={`/patients/${patientRecord.id}`}>View patient record</Link>
                  </Button>
                )}
              </>
            ) : (
              <Button asChild className="bg-brand-500 hover:bg-brand-600">
                <Link href={`/appointments/${appointment.id}/reschedule`}>Reschedule</Link>
              </Button>
            )}

            <Button onClick={handleCancel} className="bg-red-500 hover:bg-red-600">
              Cancel appointment
            </Button>
          </div>
        </div>
      )}

      {/* Back */}
      <div className="flex justify-center">
        <Button onClick={() => router.push("/appointments")} className="bg-mist text-slate-700 hover:bg-slate-200">
          Back to appointments
        </Button>
      </div>
    </div>
  );
}
