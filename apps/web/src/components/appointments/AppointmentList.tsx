"use client";

import { useAppointments } from "@/hooks/useAppointments";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Calendar, Clock, User, FileText } from "lucide-react";

export function AppointmentList() {
  const { appointments, isLoading, error } = useAppointments();

  if (isLoading) {
    return (
      <div className="bg-white backdrop-blur border border-slate-200 rounded-lg p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
        <p className="text-red-600">Failed to load appointments</p>
      </div>
    );
  }

  // Ensure appointments is an array
  const appointmentsList = Array.isArray(appointments) ? appointments : [];

  if (appointmentsList.length === 0) {
    return (
      <div className="bg-white backdrop-blur border border-slate-200 rounded-lg p-12">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-600 mb-6 text-lg">No appointments scheduled yet</p>
          <Button asChild className="bg-brand-600 hover:bg-brand-700">
            <Link href="/book">Book an Appointment</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointmentsList.map((appointment: any) => (
        <div
          key={appointment.id}
          className="bg-white backdrop-blur border border-slate-200 rounded-lg p-6 hover:border-brand-500/50 transition"
        >
          <div className="flex justify-between items-start gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-brand-50 rounded-lg border border-slate-200">
                  <User className="w-6 h-6 text-brand-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-ink text-lg mb-1">
                    {appointment.provider_name || "Dr. Unknown"}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(appointment.scheduled_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(appointment.scheduled_at).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              </div>
              
              {appointment.reason_for_visit && (
                <div className="flex items-start gap-2 mb-4 p-3 bg-mist/30 rounded-lg border border-slate-200/30">
                  <FileText className="w-4 h-4 text-slate-500 mt-0.5" />
                  <p className="text-slate-600 text-sm">{appointment.reason_for_visit}</p>
                </div>
              )}

              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${
                  appointment.status === "completed"
                    ? "bg-brand-500/20 text-green-400 border-green-500/30"
                    : appointment.status === "cancelled"
                    ? "bg-red-500/20 text-red-600 border-red-500/30"
                    : "bg-brand-50 text-brand-600 border-slate-200"
                }`}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
              </div>
            </div>

            <Button 
              asChild 
              className="bg-brand-50 border border-slate-200 text-brand-600 hover:bg-brand-600/20"
            >
              <Link href={`/appointments/${appointment.id}`}>View Details</Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}