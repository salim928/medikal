import { z } from "zod";

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  fullName: z.string().min(2, "Full name is required"),
  role: z.enum(["patient", "provider"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Appointment schemas
export const bookAppointmentSchema = z.object({
  providerId: z.string().uuid("Invalid provider ID"),
  scheduledAt: z.string().datetime("Invalid date"),
  reasonForVisit: z.string().min(10, "Please describe your reason for visit"),
  reasonCategory: z.enum(["follow_up", "acute", "preventive", "urgent"]),
});

// Medical record schemas
export const uploadRecordSchema = z.object({
  title: z.string().min(3, "Title is required"),
  recordType: z.enum(["consultation_note", "prescription", "lab_result", "imaging", "discharge_summary"]),
  appointmentId: z.string().uuid().optional(),
});

// Provider schemas
export const providerProfileSchema = z.object({
  licenseNumber: z.string().min(5, "License number is required"),
  licenseState: z.string().length(2, "State must be 2 characters"),
  licenseExpiry: z.string().datetime("Invalid date"),
  specializations: z.array(z.string()).min(1, "Select at least one specialization"),
  hourlyRate: z.number().positive("Hourly rate must be positive"),
  bio: z.string().min(20, "Bio must be at least 20 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type BookAppointmentInput = z.infer<typeof bookAppointmentSchema>;
export type UploadRecordInput = z.infer<typeof uploadRecordSchema>;
export type ProviderProfileInput = z.infer<typeof providerProfileSchema>;