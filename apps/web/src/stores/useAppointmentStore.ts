import { create } from "zustand";

interface Appointment {
  id: string;
  providerId: string;
  scheduledAt: Date;
  status: string;
  reasonForVisit: string;
  aiTriageResult?: any;
}

interface AppointmentStore {
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  addAppointment: (appointment: Appointment) => void;
  removeAppointment: (id: string) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  setAppointments: (appointments: Appointment[]) => void;
  setSelectedAppointment: (appointment: Appointment | null) => void;
  clear: () => void;
}

export const useAppointmentStore = create<AppointmentStore>((set) => ({
  appointments: [],
  selectedAppointment: null,
  addAppointment: (appointment) =>
    set((state) => ({
      appointments: [...state.appointments, appointment],
    })),
  removeAppointment: (id) =>
    set((state) => ({
      appointments: state.appointments.filter((a) => a.id !== id),
    })),
  updateAppointment: (id, updates) =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    })),
  setAppointments: (appointments) => set({ appointments }),
  setSelectedAppointment: (appointment) => set({ selectedAppointment: appointment }),
  clear: () => set({ appointments: [], selectedAppointment: null }),
}));