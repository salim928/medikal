"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Calendar, Clock } from "lucide-react";

export default function ReschedulePage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    reason: "",
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
    // Only patients can reschedule
    if (user?.role === "provider" || user?.role === "doctor") {
      router.push("/appointments");
    }
  }, [isAuthenticated, loading, user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Appointment rescheduled successfully!");
    router.push("/appointments");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-brand-500/10 to-brand-500/10 rounded-lg p-6 border border-blue-500/30">
        <h1 className="text-3xl font-bold text-ink">Reschedule Appointment</h1>
        <p className="text-slate-600 mt-1">Select a new date and time</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <label className="block text-ink font-semibold mb-3">
              <Calendar className="w-5 h-5 inline mr-2" />
              New Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 bg-canvas border border-slate-200 rounded-lg text-ink focus:outline-none focus:border-brand-500"
              required
            />
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <label className="block text-ink font-semibold mb-3">
              <Clock className="w-5 h-5 inline mr-2" />
              New Time
            </label>
            <select
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
              className="w-full px-4 py-3 bg-canvas border border-slate-200 rounded-lg text-ink focus:outline-none focus:border-brand-500"
              required
            >
              <option value="">Select time...</option>
              <option value="09:00">09:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="14:00">02:00 PM</option>
              <option value="15:00">03:00 PM</option>
              <option value="16:00">04:00 PM</option>
            </select>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <label className="block text-ink font-semibold mb-3">
            Reason for Rescheduling
          </label>
          <textarea
            value={formData.reason}
            onChange={(e) => setFormData({...formData, reason: e.target.value})}
            placeholder="Optional: Let us know why you need to reschedule..."
            rows={4}
            className="w-full px-4 py-3 bg-canvas border border-slate-200 rounded-lg text-ink placeholder-slate-400 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" className="flex-1 bg-brand-600 hover:bg-brand-700 py-3">
            Confirm Reschedule
          </Button>
          <Button
            type="button"
            onClick={() => router.back()}
            className="bg-mist hover:bg-slate-200 py-3"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
