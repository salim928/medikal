"use client";

/**
 * Interactive demo store — the mutable slice of the demo data layer.
 *
 * Appointments and notifications live here (persisted to localStorage) so
 * booking, cancelling, rescheduling and read/dismiss actions really work and
 * survive a reload. Everything else in @/lib/data stays read-only seed data.
 *
 * Bump `version` whenever the seed shape changes — persist discards stale
 * localStorage state on version mismatch.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  appointmentSeed,
  notificationSeed,
  type Appointment,
  type AppNotification,
} from "./index";

interface DemoState {
  appointments: Appointment[];
  notifications: AppNotification[];

  bookAppointment: (a: Omit<Appointment, "id" | "status">) => Appointment;
  cancelAppointment: (id: string) => void;
  completeAppointment: (id: string) => void;
  rescheduleAppointment: (id: string, date: string, time: string) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  dismissNotification: (id: string) => void;

  resetDemoData: () => void;
}

export const useDemoStore = create<DemoState>()(
  persist(
    (set) => ({
      appointments: appointmentSeed,
      notifications: notificationSeed,

      bookAppointment: (a) => {
        const appointment: Appointment = {
          ...a,
          id: `a${Date.now()}`,
          status: "scheduled",
        };
        set((s) => ({ appointments: [appointment, ...s.appointments] }));
        return appointment;
      },

      cancelAppointment: (id) =>
        set((s) => ({
          appointments: s.appointments.map((a) =>
            a.id === id ? { ...a, status: "cancelled" as const } : a
          ),
        })),

      completeAppointment: (id) =>
        set((s) => ({
          appointments: s.appointments.map((a) =>
            a.id === id ? { ...a, status: "completed" as const } : a
          ),
        })),

      rescheduleAppointment: (id, date, time) =>
        set((s) => ({
          appointments: s.appointments.map((a) =>
            a.id === id ? { ...a, date, time, status: "scheduled" as const } : a
          ),
        })),

      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      markAllNotificationsRead: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        })),

      dismissNotification: (id) =>
        set((s) => ({
          notifications: s.notifications.filter((n) => n.id !== id),
        })),

      resetDemoData: () =>
        set({ appointments: appointmentSeed, notifications: notificationSeed }),
    }),
    {
      name: "mc-demo-store",
      version: 1,
    }
  )
);

export function getAppointment(
  appointments: Appointment[],
  id: string
): Appointment | null {
  return appointments.find((a) => a.id === id) ?? null;
}
