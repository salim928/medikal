/**
 * Central data layer — single source of truth for domain data + types.
 *
 * Today this returns typed demo data (the backend Supabase project is offline).
 * Every consumer imports from here instead of holding its own inline arrays, so
 * when a real backend is connected only this file changes — the UI is untouched.
 */
import {
  Video, Pill, FlaskConical, ShieldCheck, PlusCircle, Brain, User,
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
  /** Patient shown on provider-facing views. */
  patient?: string;
  reason?: string;
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

/* ------------------------------ appointments ----------------------------- */
/* Full seed for the interactive demo store (see ./store.ts). */

export const appointmentSeed: Appointment[] = [
  { id: "a1", doctor: "Dr. Amara Mensah", specialty: "General Practitioner", date: "Today", time: "3:30 PM", mode: "Video", initials: "AM", status: "scheduled", patient: "John Parker", reason: "Follow-up on blood pressure" },
  { id: "a2", doctor: "Dr. Kwame Osei", specialty: "Dermatology", date: "Thu, Jul 4", time: "10:00 AM", mode: "In-person", initials: "KO", status: "scheduled", patient: "Mariam Ahmed", reason: "Skin rash assessment" },
  { id: "a3", doctor: "Dr. Sarah Johnson", specialty: "General Physician", date: "Jun 20, 2026", time: "11:00 AM", mode: "Video", initials: "SJ", status: "completed", patient: "John Parker", reason: "Annual check-up" },
  { id: "a4", doctor: "Dr. Kwame Asante", specialty: "Mental Health", date: "Jun 12, 2026", time: "2:00 PM", mode: "Video", initials: "KA", status: "completed", patient: "Grace Danso", reason: "Therapy session" },
  { id: "a5", doctor: "Dr. James Wilson", specialty: "Cardiology", date: "May 30, 2026", time: "9:00 AM", mode: "In-person", initials: "JW", status: "cancelled", patient: "Louis Tanoh", reason: "Cardiac review" },
];

/* ------------------------------ notifications ---------------------------- */

export type NotificationType = "appointment" | "prescription" | "record" | "system" | "video";
export type NotificationPriority = "low" | "medium" | "high";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  priority: NotificationPriority;
}

const hoursAgo = (h: number) => new Date(Date.now() - h * 60 * 60 * 1000).toISOString();

export const notificationSeed: AppNotification[] = [
  { id: "n1", type: "appointment", title: "Upcoming appointment", message: "Your video consultation with Dr. Amara Mensah is scheduled for today at 3:30 PM.", timestamp: hoursAgo(2), read: false, actionUrl: "/appointments", priority: "high" },
  { id: "n2", type: "prescription", title: "Prescription ready", message: "Your prescription for Amoxicillin is ready for pickup at City Central Pharmacy.", timestamp: hoursAgo(5), read: false, actionUrl: "/prescriptions", priority: "medium" },
  { id: "n3", type: "record", title: "Lab results available", message: "Your Full Blood Count results are now available to view.", timestamp: hoursAgo(24), read: true, actionUrl: "/records", priority: "medium" },
  { id: "n4", type: "system", title: "Profile updated", message: "Your profile information has been successfully updated.", timestamp: hoursAgo(48), read: true, priority: "low" },
  { id: "n5", type: "video", title: "Visit summary ready", message: "The summary of your video visit with Dr. Mensah is available.", timestamp: hoursAgo(72), read: true, actionUrl: "/records", priority: "low" },
];

/* -------------------------------- pharmacies ----------------------------- */

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  rating: number;
  licensed: boolean;
  openHours: string;
  services: string[];
  distance?: string;
}

export const pharmacies: Pharmacy[] = [
  { id: "1", name: "City Central Pharmacy", address: "123 Independence Avenue", city: "Accra", phone: "+233 20 123 4567", rating: 4.8, licensed: true, openHours: "8:00 AM – 10:00 PM", services: ["Prescription filling", "Home delivery", "Consultation"], distance: "2.3 km" },
  { id: "2", name: "MediCare Plus Pharmacy", address: "45 Ring Road East", city: "Accra", phone: "+233 24 987 6543", rating: 4.6, licensed: true, openHours: "24 hours", services: ["Prescription filling", "Home delivery", "Lab tests"], distance: "3.8 km" },
  { id: "3", name: "HealthFirst Pharmacy", address: "78 Kumasi High Street", city: "Kumasi", phone: "+233 26 555 0123", rating: 4.7, licensed: true, openHours: "7:00 AM – 9:00 PM", services: ["Prescription filling", "Vaccinations", "Health screening"], distance: "1.5 km" },
  { id: "4", name: "WellCare Chemists", address: "12 Osu Oxford Street", city: "Accra", phone: "+233 20 777 8899", rating: 4.5, licensed: true, openHours: "8:00 AM – 11:00 PM", services: ["Prescription filling", "Home delivery", "Mobile money payment"], distance: "4.1 km" },
];

/* -------------------------------- billing -------------------------------- */

export type TransactionType = "consultation" | "subscription" | "prescription";
export type TransactionStatus = "success" | "pending" | "failed";
export type PaymentMethod = "paystack" | "stripe" | "mobile_money";

export interface Transaction {
  id: string;
  reference: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  paymentMethod: PaymentMethod;
  date: string;
  description: string;
}

export const transactions: Transaction[] = [
  { id: "1", reference: "CONSULT-1736935800-482913", type: "consultation", amount: 150, currency: "GHS", status: "success", paymentMethod: "paystack", date: "Jun 28, 2026", description: "Video consultation — Dr. Sarah Johnson" },
  { id: "2", reference: "SUB-1736429400-118274", type: "subscription", amount: 299, currency: "GHS", status: "success", paymentMethod: "mobile_money", date: "Jun 10, 2026", description: "Family plan — monthly" },
  { id: "3", reference: "PRESC-1735910200-903561", type: "prescription", amount: 85, currency: "GHS", status: "success", paymentMethod: "paystack", date: "May 30, 2026", description: "Prescription — City Central Pharmacy" },
  { id: "4", reference: "CONSULT-1735251000-771435", type: "consultation", amount: 100, currency: "GHS", status: "failed", paymentMethod: "stripe", date: "May 22, 2026", description: "Therapy session — Dr. Kwame Asante" },
];

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  popular?: boolean;
  maxFamilyMembers?: number;
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "individual", name: "Individual", description: "Everyday care for one person",
    monthlyPrice: 99, yearlyPrice: 999,
    features: ["Unlimited video consultations", "24/7 AI symptom checker", "e-Prescriptions", "Medical records storage", "Priority support"],
  },
  {
    id: "family", name: "Family", description: "Cover up to 5 family members", popular: true,
    monthlyPrice: 299, yearlyPrice: 2999, maxFamilyMembers: 5,
    features: ["Everything in Individual", "Up to 5 family members", "Pediatric care included", "Family health dashboard", "Shared medical records"],
  },
  {
    id: "premium", name: "Premium", description: "Complete care with specialists",
    monthlyPrice: 499, yearlyPrice: 4999, maxFamilyMembers: 8,
    features: ["Everything in Family", "Specialist consultations", "Annual health screening", "Home visit coordination", "Dedicated care manager"],
  },
];

/* ------------------------------- verify-drug ------------------------------ */

export interface DrugInfo {
  name: string;
  manufacturer: string;
  batchNumber: string;
  manufactureDate: string;
  expiryDate: string;
  fdaRegistration: string;
  status: "Authentic" | "Counterfeit" | "Not Found";
  warnings?: string[];
}

/** Demo Ghana-FDA registry keyed by batch number. */
export const drugRegistry: Record<string, DrugInfo> = {
  "FDA-AMX-2024-001": {
    name: "Amoxicillin 500mg Capsules", manufacturer: "Danadams Pharmaceutical Industry Ltd",
    batchNumber: "FDA-AMX-2024-001", manufactureDate: "2024-01-15", expiryDate: "2026-01-14",
    fdaRegistration: "FDA-GH-2024-A123", status: "Authentic",
  },
  "FDA-IBU-2023-045": {
    name: "Ibuprofen 400mg Tablets", manufacturer: "Ernest Chemists Ltd",
    batchNumber: "FDA-IBU-2023-045", manufactureDate: "2023-06-20", expiryDate: "2025-06-19",
    fdaRegistration: "FDA-GH-2023-B456", status: "Authentic",
  },
  "FAKE-123-456": {
    name: "Unknown Product", manufacturer: "Unregistered Manufacturer",
    batchNumber: "FAKE-123-456", manufactureDate: "Unknown", expiryDate: "Unknown",
    fdaRegistration: "Not Registered", status: "Counterfeit",
    warnings: ["This product is not registered with Ghana FDA", "May contain harmful substances", "Do not consume"],
  },
};

export function lookupDrug(batch: string): DrugInfo {
  return (
    drugRegistry[batch] ?? {
      name: "Unknown", manufacturer: "Unknown", batchNumber: batch,
      manufactureDate: "Unknown", expiryDate: "Unknown", fdaRegistration: "Not found",
      status: "Not Found",
      warnings: ["Batch number not found in the Ghana FDA registry", "Verify the number and try again, or report the product"],
    }
  );
}

/* -------------------------------- triage --------------------------------- */

export type RiskLevel = "high" | "medium" | "low";
export type TriageStatus = "pending" | "approved" | "modified" | "rejected";

export interface TriageSubmission {
  id: string;
  patientName: string;
  patientEmail: string;
  submittedAt: string;
  symptoms: string[];
  riskLevel: RiskLevel;
  aiDiagnosis: string;
  aiRecommendations: string[];
  status: TriageStatus;
}

export const triageSeed: TriageSubmission[] = [
  {
    id: "t1", patientName: "Mariam Ahmed", patientEmail: "mariam.ahmed@email.com",
    submittedAt: "Today, 09:30 AM",
    symptoms: ["High fever (39°C)", "Severe headache", "Body aches", "Fatigue"],
    riskLevel: "high", aiDiagnosis: "Possible malaria or severe viral infection",
    aiRecommendations: ["Urgent consultation recommended within 4 hours", "Rapid malaria test advised", "Monitor temperature every 2 hours", "Increase fluid intake"],
    status: "pending",
  },
  {
    id: "t2", patientName: "Sam Kofi", patientEmail: "sam.kofi@email.com",
    submittedAt: "Today, 08:15 AM",
    symptoms: ["Mild cough", "Runny nose", "Sneezing", "Sore throat"],
    riskLevel: "low", aiDiagnosis: "Common cold (viral upper respiratory infection)",
    aiRecommendations: ["Rest and hydration", "Over-the-counter cold relief as needed", "Consult a doctor if symptoms persist beyond 10 days"],
    status: "pending",
  },
  {
    id: "t3", patientName: "Louis Tanoh", patientEmail: "louis.tanoh@email.com",
    submittedAt: "Today, 07:45 AM",
    symptoms: ["Chest pain", "Shortness of breath", "Dizziness", "Nausea"],
    riskLevel: "high", aiDiagnosis: "Possible cardiac event — requires immediate attention",
    aiRecommendations: ["EMERGENCY: advise patient to seek immediate in-person care", "Do not schedule as routine video visit", "Flag for cardiologist follow-up"],
    status: "pending",
  },
  {
    id: "t4", patientName: "Akosua Boateng", patientEmail: "akosua.b@email.com",
    submittedAt: "Yesterday, 04:20 PM",
    symptoms: ["Mild nausea", "Food cravings", "Fatigue"],
    riskLevel: "medium", aiDiagnosis: "Consistent with early-pregnancy symptoms (patient in antenatal care)",
    aiRecommendations: ["Route to antenatal team", "Schedule routine check within one week", "Continue prenatal vitamins"],
    status: "approved",
  },
];

/* --------------------------- settings / security -------------------------- */

export interface SecuritySession {
  id: string;
  device: string;
  location: string;
  ipAddress: string;
  /** ISO timestamp of last activity. */
  lastActive: string;
  current: boolean;
}

export const securitySessions: SecuritySession[] = [
  { id: "s1", device: "Windows PC — Chrome", location: "Accra, Ghana", ipAddress: "154.160.1.24", lastActive: new Date().toISOString(), current: true },
  { id: "s2", device: "iPhone 15 — Safari", location: "Accra, Ghana", ipAddress: "154.160.3.87", lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), current: false },
  { id: "s3", device: "Android — Chrome", location: "Kumasi, Ghana", ipAddress: "41.215.168.9", lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), current: false },
];

/* --------------------------- role dashboard seeds ------------------------ */
/* View data for the nurse / midwife / lawyer role dashboards. */

export interface ScheduleRow {
  initials: string;
  name: string;
  reason: string;
  time: string;
  tag?: string;
}

export interface QueueRow {
  initials: string;
  name: string;
  note: string;
  level: string;
}

export const nurseRounds: ScheduleRow[] = [
  { initials: "AB", name: "Akosua Boateng", reason: "Vitals check · Ward B", time: "8:30 AM" },
  { initials: "KM", name: "Kofi Mensah", reason: "Wound dressing", time: "9:45 AM" },
  { initials: "EN", name: "Efua Nyarko", reason: "Medication round", time: "11:00 AM" },
];

export const nurseTasks: QueueRow[] = [
  { initials: "TA", name: "Record vitals — Bed 12", note: "Due in 15 min", level: "Due" },
  { initials: "SG", name: "Administer meds — Bed 7", note: "Scheduled 11:00", level: "Upcoming" },
];

export const midwifeVisits: ScheduleRow[] = [
  { initials: "AO", name: "Ama Owusu", reason: "Antenatal · 28 weeks", time: "9:00 AM", tag: "Antenatal" },
  { initials: "GD", name: "Grace Danso", reason: "Postpartum check · Day 5", time: "10:30 AM", tag: "Postpartum" },
  { initials: "NB", name: "Naa Boateng", reason: "First visit · 12 weeks", time: "12:00 PM", tag: "Antenatal" },
];

export const midwifeDue: QueueRow[] = [
  { initials: "AO", name: "Ama Owusu", note: "Expected in 12 weeks", level: "Wk 28" },
  { initials: "YM", name: "Yaa Mensah", note: "Expected in 3 weeks", level: "Wk 37" },
];

export const lawyerConsults: ScheduleRow[] = [
  { initials: "PM", name: "Patient — M. Addo", reason: "Consent & data-rights review", time: "10:00 AM", tag: "Consult" },
  { initials: "CL", name: "City Clinic Ltd.", reason: "Malpractice case review", time: "1:00 PM", tag: "Case" },
  { initials: "HR", name: "HR — MedGroup", reason: "Compliance advisory", time: "3:30 PM", tag: "Advisory" },
];

export const lawyerCases: QueueRow[] = [
  { initials: "CL", name: "City Clinic — Negligence claim", note: "Discovery phase", level: "Active" },
  { initials: "RX", name: "Rx dispute — Pharmacy A", note: "Awaiting documents", level: "Pending" },
];
