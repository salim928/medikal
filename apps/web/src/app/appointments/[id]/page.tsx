"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { Calendar, Clock, User, MapPin, FileText, Video, Phone, Mail } from "lucide-react";
import Link from "next/link";

export default function AppointmentDetailsPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const isProvider = useMemo(() => {
    return user?.role === "provider" || user?.role === "doctor";
  }, [user]);

  // Mock appointment data
  const appointment = {
    id: id,
    patientName: "John Doe",
    doctorName: "Dr. Sarah Johnson",
    date: "2024-10-25",
    time: "10:00 AM",
    type: "consultation",
    status: "scheduled",
    location: "virtual", // Changed to lowercase to match booking form
    reason: "Annual checkup",
    notes: "Please have your medical history ready",
    patientEmail: "john.doe@example.com",
    patientPhone: "+1 (555) 123-4567",
    doctorSpecialty: "Cardiology",
    videoRoomId: id, // Add video room ID for consultation link
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  const handleJoinCall = () => {
    router.push(`/consultation/${id}`);
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      alert("Appointment cancelled");
      router.push("/appointments");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-500/10 to-brand-500/10 rounded-lg p-6 border border-slate-200">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-brand-600" />
            <div>
              <h1 className="text-3xl font-bold text-ink">Appointment Details</h1>
              <p className="text-slate-600 mt-1">#{appointment.id}</p>
            </div>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
            appointment.status === 'completed' ? 'bg-brand-500/20 text-green-400' :
            appointment.status === 'cancelled' ? 'bg-red-500/20 text-red-600' :
            'bg-yellow-500/20 text-yellow-400'
          }`}>
            {appointment.status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Main Details */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Participant Info */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-ink mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-brand-600" />
            {isProvider ? "Patient Information" : "Doctor Information"}
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-slate-500">Name</p>
              <p className="text-ink font-medium">
                {isProvider ? appointment.patientName : appointment.doctorName}
              </p>
            </div>
            {isProvider && (
              <>
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="text-ink font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4 text-brand-600" />
                    {appointment.patientEmail}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Phone</p>
                  <p className="text-ink font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4 text-brand-600" />
                    {appointment.patientPhone}
                  </p>
                </div>
              </>
            )}
            {!isProvider && (
              <div>
                <p className="text-sm text-slate-500">Specialty</p>
                <p className="text-ink font-medium">{appointment.doctorSpecialty}</p>
              </div>
            )}
          </div>
        </div>

        {/* Appointment Info */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-ink mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-600" />
            Appointment Information
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-slate-500">Date</p>
              <p className="text-ink font-medium">{appointment.date}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Time</p>
              <p className="text-ink font-medium flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-600" />
                {appointment.time}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Type</p>
              <p className="text-ink font-medium">{appointment.type}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Location</p>
              <p className="text-ink font-medium flex items-center gap-2">
                {appointment.location === "virtual" ? (
                  <><Video className="w-4 h-4 text-brand-600" /> Virtual Visit</>
                ) : (
                  <><MapPin className="w-4 h-4 text-brand-600" /> {appointment.location === "in-person" ? "In-Person Visit" : appointment.location}</>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reason and Notes */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-ink mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-brand-600" />
          Visit Details
        </h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-500 mb-1">Reason for Visit</p>
            <p className="text-ink">{appointment.reason}</p>
          </div>
          {appointment.notes && (
            <div>
              <p className="text-sm text-slate-500 mb-1">Notes</p>
              <p className="text-slate-600">{appointment.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      {appointment.status === 'scheduled' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-ink mb-4">Actions</h2>
          <div className="flex flex-wrap gap-3">
            {/* Show video call button for virtual appointments */}
            {appointment.location === "virtual" && (
              <Button
                onClick={handleJoinCall}
                className="bg-brand-500 hover:bg-brand-600 text-white"
              >
                <Video className="w-4 h-4 mr-2" />
                Join Video Call
              </Button>
            )}
            
            {isProvider ? (
              <>
                <Button asChild className="bg-brand-500 hover:bg-brand-600">
                  <Link href={`/appointments/${id}/complete`}>Mark as Complete</Link>
                </Button>
                <Button asChild className="bg-brand-500 hover:bg-brand-600">
                  <Link href={`/patients/${appointment.patientName}`}>View Patient Records</Link>
                </Button>
              </>
            ) : (
              <Button asChild className="bg-brand-500 hover:bg-brand-600">
                <Link href={`/appointments/${id}/reschedule`}>Reschedule</Link>
              </Button>
            )}
            
            <Button
              onClick={handleCancel}
              className="bg-red-500 hover:bg-red-600"
            >
              Cancel Appointment
            </Button>
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="flex justify-center">
        <Button
          onClick={() => router.back()}
          className="bg-mist hover:bg-slate-200"
        >
          Back to Appointments
        </Button>
      </div>
    </div>
  );
}
