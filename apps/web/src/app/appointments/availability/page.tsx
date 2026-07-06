"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Calendar, Clock, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { PageSpinner } from "@/components/ui/Spinner";

interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
}

export default function AvailabilityPage() {
  const { isAuthenticated, loading, role } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { id: "1", day: "Monday", startTime: "09:00", endTime: "17:00" },
    { id: "2", day: "Tuesday", startTime: "09:00", endTime: "17:00" },
    { id: "3", day: "Wednesday", startTime: "09:00", endTime: "12:00" },
  ]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
      return;
    }
    // Availability management is for care providers only.
    if (!loading && isAuthenticated && role === "patient") {
      router.push("/dashboard");
    }
  }, [isAuthenticated, loading, role, router]);

  const addTimeSlot = () => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      day: "Monday",
      startTime: "09:00",
      endTime: "17:00",
    };
    setTimeSlots([...timeSlots, newSlot]);
  };

  const removeTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== id));
  };

  const updateTimeSlot = (id: string, field: keyof TimeSlot, value: string) => {
    setTimeSlots(timeSlots.map(slot => 
      slot.id === id ? { ...slot, [field]: value } : slot
    ));
  };

  const handleSave = () => {
    toast.success("Availability saved");
  };

  if (loading) return <PageSpinner />;

  // Don't render for patients (redirect happens in useEffect)
  if (role === "patient") {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-1">
        <div className="flex items-center gap-3">
          <Clock className="w-8 h-8 text-brand-600" />
          <div>
            <h1 className="text-3xl font-bold text-ink">Set Availability</h1>
            <p className="text-slate-600 mt-1">Manage your appointment schedule</p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-brand-50 border border-brand-100 rounded-lg p-4">
        <p className="text-slate-600">
          <strong className="text-ink">💡 Tip:</strong> Set your weekly availability below. Patients will only be able to book appointments during these times.
        </p>
      </div>

      {/* Time Slots */}
      <div className="space-y-4">
        {timeSlots.map((slot) => (
          <div key={slot.id} className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="grid md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-ink font-semibold mb-2">Day</label>
                <select
                  value={slot.day}
                  onChange={(e) => updateTimeSlot(slot.id, 'day', e.target.value)}
                  className="w-full px-4 py-2 bg-canvas border border-slate-200 rounded-lg text-ink focus:outline-none focus:border-brand-500"
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </div>

              <div>
                <label className="block text-ink font-semibold mb-2">Start Time</label>
                <input
                  type="time"
                  value={slot.startTime}
                  onChange={(e) => updateTimeSlot(slot.id, 'startTime', e.target.value)}
                  className="w-full px-4 py-2 bg-canvas border border-slate-200 rounded-lg text-ink focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-ink font-semibold mb-2">End Time</label>
                <input
                  type="time"
                  value={slot.endTime}
                  onChange={(e) => updateTimeSlot(slot.id, 'endTime', e.target.value)}
                  className="w-full px-4 py-2 bg-canvas border border-slate-200 rounded-lg text-ink focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <Button
                  onClick={() => removeTimeSlot(slot.id)}
                  className="w-full bg-red-500 hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Slot Button */}
      <Button
        onClick={addTimeSlot}
        className="w-full bg-brand-500 hover:bg-brand-600 py-3"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Time Slot
      </Button>

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          onClick={handleSave}
          className="flex-1 bg-brand-500 hover:bg-brand-600 py-3"
        >
          Save Availability
        </Button>
        <Button
          onClick={() => router.back()}
          className="bg-mist text-slate-700 hover:bg-slate-200 py-3"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
