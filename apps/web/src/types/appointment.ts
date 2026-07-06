export interface Appointment {
  id: string;
  patient: string;
  patientId?: string;
  providerId?: string;
  providerName?: string;
  date: string;
  time: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  type?: 'video' | 'in-person' | 'phone';
  location?: string;
  notes?: string;
  duration?: number; // in minutes
  videoRoomId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppointmentFormData {
  date: string;
  time: string;
  reason: string;
  type: 'video' | 'in-person';
  providerId?: string;
  notes?: string;
}
