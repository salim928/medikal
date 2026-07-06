/**
 * Central data layer — single source of truth for domain data + types.
 *
 * Today this returns typed demo data (the backend Supabase project is offline).
 * Every consumer imports from here instead of holding its own inline arrays, so
 * when a real backend is connected only this file changes — the UI is untouched.
 */
import {
  Video, Pill, FlaskConical, ShieldCheck, FileText, PlusCircle, Brain, User,
  Baby, Activity, HeartPulse,
} from "lucide-react";

type LucideIcon = React.ComponentType<{ className?: string }>;

/* --------------------------------- types --------------------------------- */

export type VisitMode = "Video" | "In-person";
export type AppointmentStatus = "scheduled" | "completed" | "cancelled";
export type PrescriptionStatus = "active" | "completed" | "pending";

export interface CareService {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

export interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  mode: VisitMode;
  initials: string;
  status: AppointmentStatus;
}

export interface Prescription {
  id: string;
  medication: string;
  doctor: string;
  patient: string;
  dosage: string;
  frequency: string;
  duration: string;
  date: string;
  instructions: string;
  refills: number;
  totalRefills: number;
  status: PrescriptionStatus;
  pharmacy: string;
  prescribedFor: string;
  warnings: string[];
  sideEffects: string[];
}

export type RecordType = "Lab Results" | "Imaging" | "Prescription" | "Visit Note";

export interface RecordNote {
  id: string;
  provider: string;
  date: string;
  content: string;
}

export interface MedicalRecord {
  id: string;
  title: string;
  type: RecordType;
  date: string;
  description: string;
  patient: string;
  uploadedBy: string;
  fileSize: string;
  fileType: string;
  notes: RecordNote[];
}

export interface Education {
  degree: string;
  institution: string;
  year: number;
}

export interface Provider {
  id: string;
  name: string;
  initials: string;
  credentials: string;
  specialty: string;
  rating: number;
  reviews: number;
  experience: number;
  location: string;
  availability: string;
  fee: number;
  verified: boolean;
  languages: string[];
  bio: string;
  qualifications: string[];
  expertise: string[];
  education: Education[];
}

export interface CareTeamMember {
  name: string;
  role: string;
  initials: string;
}

export interface ActivityItem {
  icon: LucideIcon;
  text: string;
  time: string;
}

/* ------------------------------- demo data ------------------------------- */

/** The 6 care services shown on the landing page, dashboard, and booking flow. */
export const careServices: CareService[] = [
  { id: "urgent", label: "Urgent Care", description: "Colds, flu, infections", icon: PlusCircle },
  { id: "mental", label: "Mental Health", description: "Therapy & psychiatry", icon: Brain },
  { id: "primary", label: "Primary Care", description: "Your everyday doctor", icon: User },
  { id: "pediatrics", label: "Pediatrics", description: "Care for children", icon: Baby },
  { id: "womens", label: "Women's Health", description: "Every life stage", icon: Activity },
  { id: "chronic", label: "Chronic Care", description: "Ongoing conditions", icon: HeartPulse },
];

export const upcomingAppointments: Appointment[] = [
  { id: "a1", doctor: "Dr. Amara Mensah", specialty: "General Practitioner", date: "Today", time: "3:30 PM", mode: "Video", initials: "AM", status: "scheduled" },
  { id: "a2", doctor: "Dr. Kwame Osei", specialty: "Dermatology", date: "Thu, Jul 4", time: "10:00 AM", mode: "In-person", initials: "KO", status: "scheduled" },
];

export const careTeam: CareTeamMember[] = [
  { name: "Dr. Amara Mensah", role: "Primary Care", initials: "AM" },
  { name: "Dr. Kwame Osei", role: "Dermatologist", initials: "KO" },
  { name: "Nurse Adjoa", role: "Care coordinator", initials: "NA" },
];

export const patientActivity: ActivityItem[] = [
  { icon: Pill, text: "Prescription for Amoxicillin sent to MedPlus Pharmacy", time: "2h ago" },
  { icon: FlaskConical, text: "Lab results ready — Full Blood Count", time: "Yesterday" },
  { icon: Video, text: "Video visit completed with Dr. Mensah", time: "2 days ago" },
  { icon: ShieldCheck, text: "Identity verification completed", time: "5 days ago" },
];

export const providers: Provider[] = [
  {
    id: "1", name: "Dr. Sarah Johnson", initials: "SJ", credentials: "MD, FACP",
    specialty: "General Physician", rating: 4.9, reviews: 256, experience: 12,
    location: "Accra, Ghana", availability: "Available today", fee: 150, verified: true,
    languages: ["English", "Twi", "Ga"],
    bio: "Dr. Sarah Johnson is a highly experienced General Physician with over 12 years of practice, specialising in preventive care, chronic disease management, and patient-centred healthcare.",
    qualifications: ["MBBS", "MD Internal Medicine", "Board Certified", "FACP"],
    expertise: ["Preventive Healthcare", "Chronic Disease Management", "Diabetes", "Hypertension", "Health Screenings"],
    education: [
      { degree: "MBBS", institution: "University of Ghana Medical School", year: 2010 },
      { degree: "MD Internal Medicine", institution: "Johns Hopkins University", year: 2014 },
    ],
  },
  {
    id: "2", name: "Dr. Michael Chen", initials: "MC", credentials: "MD, FACOG",
    specialty: "Obstetrician & Gynecologist", rating: 4.8, reviews: 189, experience: 15,
    location: "Kumasi, Ghana", availability: "Available tomorrow", fee: 200, verified: true,
    languages: ["English", "Ga"],
    bio: "Dr. Michael Chen is an expert in high-risk pregnancies and women's health with 15 years of specialist experience across obstetrics and gynaecology.",
    qualifications: ["MBBS", "MS Obstetrics & Gynecology", "FACOG"],
    expertise: ["High-risk Pregnancy", "Prenatal Care", "Women's Health", "Fertility"],
    education: [
      { degree: "MBBS", institution: "Kwame Nkrumah University of Science & Technology", year: 2007 },
      { degree: "MS Obstetrics & Gynecology", institution: "University College London", year: 2011 },
    ],
  },
  {
    id: "3", name: "Dr. Ama Mensah", initials: "AM", credentials: "MD, FAAP",
    specialty: "Pediatrician", rating: 4.9, reviews: 312, experience: 10,
    location: "Accra, Ghana", availability: "Available today", fee: 120, verified: true,
    languages: ["English", "Twi", "Fante"],
    bio: "Dr. Ama Mensah cares for children from newborns to teenagers, with a focus on developmental health, immunisation, and family-centred paediatric care.",
    qualifications: ["MBBS", "MD Pediatrics", "FAAP"],
    expertise: ["Newborn Care", "Immunisation", "Child Development", "Paediatric Nutrition"],
    education: [
      { degree: "MBBS", institution: "University of Ghana Medical School", year: 2012 },
      { degree: "MD Pediatrics", institution: "University of Cape Town", year: 2016 },
    ],
  },
  {
    id: "4", name: "Dr. James Wilson", initials: "JW", credentials: "MD, FRCPC",
    specialty: "Cardiologist", rating: 4.7, reviews: 145, experience: 18,
    location: "Accra, Ghana", availability: "Available in 2 days", fee: 250, verified: true,
    languages: ["English"],
    bio: "Dr. James Wilson is a heart-health specialist focused on preventive cardiology, hypertension, and the long-term management of cardiovascular disease.",
    qualifications: ["MBBS", "MD Cardiology", "FRCPC"],
    expertise: ["Preventive Cardiology", "Hypertension", "Heart Failure", "ECG Interpretation"],
    education: [
      { degree: "MBBS", institution: "University of Ghana Medical School", year: 2004 },
      { degree: "MD Cardiology", institution: "University of Toronto", year: 2009 },
    ],
  },
  {
    id: "5", name: "Dr. Kwame Asante", initials: "KA", credentials: "PhD, Licensed Psychologist",
    specialty: "Mental Health Therapist", rating: 4.9, reviews: 234, experience: 8,
    location: "Accra, Ghana", availability: "Available today", fee: 100, verified: true,
    languages: ["English", "Twi", "Ga"],
    bio: "Dr. Kwame Asante specialises in anxiety, depression, and relationship counselling, offering evidence-based therapy in a warm, confidential setting.",
    qualifications: ["BA Psychology", "MA Clinical Psychology", "PhD"],
    expertise: ["Anxiety", "Depression", "CBT", "Relationship Counselling", "Stress Management"],
    education: [
      { degree: "MA Clinical Psychology", institution: "University of Ghana", year: 2013 },
      { degree: "PhD Psychology", institution: "University of Edinburgh", year: 2017 },
    ],
  },
  {
    id: "6", name: "Dr. Patricia Osei", initials: "PO", credentials: "MD, FAAD",
    specialty: "Dermatologist", rating: 4.8, reviews: 178, experience: 11,
    location: "Kumasi, Ghana", availability: "Available tomorrow", fee: 180, verified: true,
    languages: ["English", "Twi"],
    bio: "Dr. Patricia Osei is an expert in skin conditions, acne treatment, and cosmetic dermatology, combining medical and aesthetic care for healthy skin.",
    qualifications: ["MBBS", "MD Dermatology", "FAAD"],
    expertise: ["Acne", "Eczema", "Skin Cancer Screening", "Cosmetic Dermatology"],
    education: [
      { degree: "MBBS", institution: "Kwame Nkrumah University of Science & Technology", year: 2009 },
      { degree: "MD Dermatology", institution: "King's College London", year: 2013 },
    ],
  },
];

export type PatientStatus = "active" | "new" | "inactive";

export interface Patient {
  id: string;
  name: string;
  initials: string;
  age: number;
  gender: string;
  lastVisit: string;
  condition: string;
  status: PatientStatus;
  upcoming: number;
  records: number;
  phone: string;
  email: string;
}

export const patients: Patient[] = [
  { id: "1", name: "John Parker", initials: "JP", age: 45, gender: "Male", lastVisit: "Jan 15, 2025", condition: "Hypertension", status: "active", upcoming: 2, records: 12, phone: "+233 55 0100 100", email: "john.parker@email.com" },
  { id: "2", name: "Mariam Ahmed", initials: "MA", age: 32, gender: "Female", lastVisit: "Jan 10, 2025", condition: "Migraine", status: "new", upcoming: 1, records: 3, phone: "+233 55 0100 101", email: "mariam.ahmed@email.com" },
  { id: "3", name: "Louis Tanoh", initials: "LT", age: 58, gender: "Male", lastVisit: "Dec 20, 2024", condition: "Type 2 Diabetes", status: "active", upcoming: 0, records: 24, phone: "+233 55 0100 102", email: "louis.tanoh@email.com" },
  { id: "4", name: "Akosua Boateng", initials: "AB", age: 27, gender: "Female", lastVisit: "Jan 12, 2025", condition: "Antenatal care", status: "active", upcoming: 3, records: 9, phone: "+233 55 0100 103", email: "akosua.b@email.com" },
  { id: "5", name: "Sam Kofi", initials: "SK", age: 41, gender: "Male", lastVisit: "Nov 30, 2024", condition: "Persistent cough", status: "inactive", upcoming: 0, records: 6, phone: "+233 55 0100 104", email: "sam.kofi@email.com" },
  { id: "6", name: "Grace Danso", initials: "GD", age: 34, gender: "Female", lastVisit: "Jan 08, 2025", condition: "Postpartum check", status: "active", upcoming: 1, records: 15, phone: "+233 55 0100 105", email: "grace.danso@email.com" },
];

/* ------------------------------- accessors ------------------------------- */
/* Async by design: this is the seam a real backend plugs into later. */

export async function getUpcomingAppointments() { return upcomingAppointments; }
export async function getCareTeam() { return careTeam; }
export async function getProviders() { return providers; }
export function getProvider(id: string): Provider | null {
  return providers.find((p) => p.id === id) ?? null;
}
export function providerOptions() {
  return providers.map((p) => `${p.name} — ${p.specialty}`);
}
/** The dropdown label the booking form uses for a given provider. */
export function providerOptionLabel(p: Provider) {
  return `${p.name} — ${p.specialty}`;
}

/** Shared demo booking data (same slots/testimonials for every provider). */
export const consultTimes = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];

export const providerReviews = [
  { id: "r1", patient: "John D.", rating: 5, date: "Jan 10, 2025", comment: "Excellent doctor — very thorough and caring. Took time to listen to my concerns." },
  { id: "r2", patient: "Mary K.", rating: 5, date: "Jan 8, 2025", comment: "Explained everything clearly and made me feel completely at ease." },
  { id: "r3", patient: "David A.", rating: 4, date: "Jan 5, 2025", comment: "Great experience. Very professional and knowledgeable." },
];
export function getPatient(id: string): Patient | null {
  return patients.find((p) => p.id === id) ?? null;
}

/** Per-patient clinical snapshot (demo). */
export const patientRecords = [
  { title: "Full Blood Count", type: "Lab result", date: "Jan 15, 2025" },
  { title: "Chest X-Ray", type: "Imaging", date: "Dec 20, 2024" },
  { title: "Consultation note", type: "Visit note", date: "Dec 20, 2024" },
];

export const patientMedications = [
  { name: "Lisinopril", dosage: "10mg · once daily", status: "active" as PrescriptionStatus },
  { name: "Metformin", dosage: "500mg · twice daily", status: "active" as PrescriptionStatus },
  { name: "Amoxicillin", dosage: "500mg · 7 days", status: "completed" as PrescriptionStatus },
];

/* ------------------------------ prescriptions ---------------------------- */

export const prescriptions: Prescription[] = [
  {
    id: "1", medication: "Amoxicillin", doctor: "Dr. Sarah Johnson", patient: "John Parker",
    dosage: "500mg", frequency: "Three times daily", duration: "7 days", date: "Jan 15, 2025",
    instructions: "Take with food. Complete the full course even if you feel better.",
    refills: 2, totalRefills: 2, status: "active", pharmacy: "City Pharmacy, Accra",
    prescribedFor: "Bacterial infection",
    warnings: ["Do not consume alcohol while taking this medication", "May cause drowsiness"],
    sideEffects: ["Nausea", "Diarrhea", "Skin rash"],
  },
  {
    id: "2", medication: "Ibuprofen", doctor: "Dr. Michael Chen", patient: "Mariam Ahmed",
    dosage: "400mg", frequency: "As needed, max 3 times daily", duration: "5 days", date: "Jan 10, 2025",
    instructions: "Take with food or milk to reduce stomach upset. Do not exceed 1200mg per day.",
    refills: 0, totalRefills: 0, status: "completed", pharmacy: "MedPlus Pharmacy, Accra",
    prescribedFor: "Pain & inflammation",
    warnings: ["Avoid on an empty stomach", "Not recommended with other NSAIDs"],
    sideEffects: ["Stomach upset", "Heartburn", "Dizziness"],
  },
  {
    id: "3", medication: "Lisinopril", doctor: "Dr. James Wilson", patient: "Louis Tanoh",
    dosage: "10mg", frequency: "Once daily in the morning", duration: "30 days", date: "Jan 12, 2025",
    instructions: "Take at the same time each day. Do not stop abruptly without consulting your doctor.",
    refills: 5, totalRefills: 6, status: "active", pharmacy: "City Pharmacy, Accra",
    prescribedFor: "Hypertension",
    warnings: ["May cause dizziness when standing up", "Monitor blood pressure regularly"],
    sideEffects: ["Dry cough", "Headache", "Fatigue"],
  },
];

export function getPrescription(id: string): Prescription | null {
  return prescriptions.find((p) => p.id === id) ?? null;
}

/* ----------------------------- medical records --------------------------- */

export const medicalRecords: MedicalRecord[] = [
  {
    id: "1", title: "Blood Test Results — Complete Panel", type: "Lab Results",
    date: "Jan 15, 2025", description: "Comprehensive metabolic panel including glucose, kidney function, and lipid profile.",
    patient: "John Parker", uploadedBy: "Dr. Sarah Johnson", fileSize: "2.4 MB", fileType: "PDF",
    notes: [
      { id: "n1", provider: "Dr. Sarah Johnson", date: "Jan 15, 2025", content: "Results show normal glucose levels. Cholesterol slightly elevated — recommend dietary changes." },
      { id: "n2", provider: "Dr. Michael Chen", date: "Jan 16, 2025", content: "Follow-up: patient started on Mediterranean diet. Recheck in 3 months." },
    ],
  },
  {
    id: "2", title: "Chest X-Ray", type: "Imaging",
    date: "Dec 10, 2024", description: "Chest radiograph, PA and lateral views. Clear lung fields, no acute findings.",
    patient: "John Parker", uploadedBy: "Dr. Patricia Osei", fileSize: "5.1 MB", fileType: "PDF",
    notes: [
      { id: "n1", provider: "Dr. Patricia Osei", date: "Dec 10, 2024", content: "No signs of infection or effusion. Heart size within normal limits." },
    ],
  },
  {
    id: "3", title: "Consultation Note", type: "Visit Note",
    date: "Nov 20, 2024", description: "Summary of video consultation regarding ongoing hypertension management.",
    patient: "John Parker", uploadedBy: "Dr. Sarah Johnson", fileSize: "0.3 MB", fileType: "PDF",
    notes: [],
  },
];

export function getMedicalRecord(id: string): MedicalRecord | null {
  return medicalRecords.find((r) => r.id === id) ?? null;
}
