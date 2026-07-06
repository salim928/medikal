"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAppointments } from "@/hooks/useAppointments";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Calendar, Plus, Clock, Users, CheckCircle, XCircle, Filter, Search, Video } from "lucide-react";

export default function AppointmentsPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const { appointments, isLoading } = useAppointments();
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const isProvider = useMemo(() => {
    return user?.role === "provider" || user?.role === "doctor";
  }, [user]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  // Calculate stats for providers
  const stats = useMemo(() => {
    if (!isProvider || !Array.isArray(appointments)) return null;
    
    const today = new Date().toISOString().split('T')[0];
    return {
      today: appointments.filter(a => a.date === today).length,
      pending: appointments.filter(a => a.status === 'scheduled').length,
      completed: appointments.filter(a => a.status === 'completed').length,
      cancelled: appointments.filter(a => a.status === 'cancelled').length,
    };
  }, [appointments, isProvider]);

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    if (!Array.isArray(appointments)) return [];
    
    let filtered = appointments;
    
    if (filterStatus !== "all") {
      filtered = filtered.filter(a => a.status === filterStatus);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(a => 
        a.patient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.reason?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [appointments, filterStatus, searchTerm]);

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-500/10 to-brand-500/10 rounded-lg p-6 border border-slate-200 backdrop-blur">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-brand-600" />
            <div>
              <h1 className="text-3xl font-bold text-ink">
                {isProvider ? "Appointment Management" : "My Appointments"}
              </h1>
              <p className="text-slate-600 mt-1">
                {isProvider 
                  ? "Manage patient appointments and schedule" 
                  : "View and manage your scheduled appointments"}
              </p>
            </div>
          </div>
          
          {isProvider ? (
            <Button asChild className="bg-brand-500 hover:bg-brand-600">
              <Link href="/appointments/availability">Set Availability</Link>
            </Button>
          ) : (
            <Button asChild className="bg-brand-600 hover:bg-brand-700">
              <Link href="/appointments/book">Book New Appointment</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Provider Stats */}
      {isProvider && stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-brand-600" />
              <div>
                <p className="text-2xl font-bold text-ink">{stats.today}</p>
                <p className="text-sm text-slate-500">Today's Appointments</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold text-ink">{stats.pending}</p>
                <p className="text-sm text-slate-500">Pending</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-ink">{stats.completed}</p>
                <p className="text-sm text-slate-500">Completed</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-red-500/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <XCircle className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-ink">{stats.cancelled}</p>
                <p className="text-sm text-slate-500">Cancelled</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder={isProvider ? "Search by patient name or type..." : "Search appointments..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-canvas border border-slate-200 rounded-lg text-ink placeholder-slate-400 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
          
          {/* Status Filter */}
          <div className="flex gap-2">
            <Button
              onClick={() => setFilterStatus("all")}
              className={filterStatus === "all" ? "bg-brand-600" : "bg-mist"}
            >
              All
            </Button>
            <Button
              onClick={() => setFilterStatus("scheduled")}
              className={filterStatus === "scheduled" ? "bg-yellow-500" : "bg-mist"}
            >
              Pending
            </Button>
            <Button
              onClick={() => setFilterStatus("completed")}
              className={filterStatus === "completed" ? "bg-brand-500" : "bg-mist"}
            >
              Completed
            </Button>
            <Button
              onClick={() => setFilterStatus("cancelled")}
              className={filterStatus === "cancelled" ? "bg-red-500" : "bg-mist"}
            >
              Cancelled
            </Button>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-8 text-center">
            <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">No appointments found</p>
            {!isProvider && (
              <Button asChild className="bg-brand-600 hover:bg-brand-700">
                <Link href="/appointments/book">Book Your First Appointment</Link>
              </Button>
            )}
          </div>
        ) : (
          filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white border border-slate-200 rounded-lg p-6 hover:border-brand-500/50 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-ink">
                      {isProvider ? appointment.patient : "Dr. Smith"}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      appointment.status === 'completed' ? 'bg-brand-500/20 text-green-400' :
                      appointment.status === 'cancelled' ? 'bg-red-500/20 text-red-600' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-600">
                    <div>
                      <p className="text-sm text-slate-500">Date & Time</p>
                      <p className="font-medium">{appointment.date} at {appointment.time}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Reason</p>
                      <p className="font-medium">{appointment.reason}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Location</p>
                      <p className="font-medium">Virtual</p>
                    </div>
                  </div>
                  
                  {appointment.reason && (
                    <div className="mt-3 p-3 bg-white/80 rounded-lg">
                      <p className="text-sm text-slate-500">Details:</p>
                      <p className="text-slate-600">{appointment.reason}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  {/* Quick Join Video Call button for virtual appointments */}
                  {appointment.status === 'scheduled' && appointment.location === 'virtual' && (
                    <Button asChild className="bg-brand-500 hover:bg-brand-600">
                      <Link href={`/consultation/${appointment.id}`}>
                        <Video className="w-4 h-4 mr-2" />
                        Join Video Call
                      </Link>
                    </Button>
                  )}
                  
                  <Button asChild className="bg-brand-600 hover:bg-brand-700">
                    <Link href={`/appointments/${appointment.id}`}>View Details</Link>
                  </Button>
                  
                  {appointment.status === 'scheduled' && (
                    <>
                      {isProvider ? (
                        <>
                          <Button asChild className="bg-brand-500 hover:bg-brand-600">
                            <Link href={`/appointments/${appointment.id}/complete`}>Complete</Link>
                          </Button>
                          <Button className="bg-red-500 hover:bg-red-600">
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button asChild className="bg-brand-500 hover:bg-brand-600">
                            <Link href={`/appointments/${appointment.id}/reschedule`}>Reschedule</Link>
                          </Button>
                          <Button className="bg-red-500 hover:bg-red-600">
                            Cancel
                          </Button>
                        </>
                      )}
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