import { pgTable, uuid, varchar, text, timestamp, jsonb, boolean, integer, decimal, enum as pgEnum, uniqueIndex, primaryKey } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Enums
const userRole = pgEnum("user_role", ["patient", "provider", "admin", "clinic_staff"]);
const authProvider = pgEnum("auth_provider", ["email", "oauth", "web3"]);
const appointmentStatus = pgEnum("appointment_status", ["pending", "confirmed", "in_progress", "completed", "cancelled", "no_show"]);
const recordType = pgEnum("medical_record_type", ["consultation_note", "prescription", "lab_result", "imaging", "discharge_summary"]);
const prescriptionStatus = pgEnum("prescription_status", ["draft", "signed", "sent_to_pharmacy", "filled", "cancelled"]);
const agentType = pgEnum("agent_type", ["triage", "clinical_doc", "icd10_coding", "drug_interactions", "research", "red_flag", "patient_education"]);
const consentType = pgEnum("consent_type", ["data_processing", "ai_analysis", "third_party_share", "research", "billing"]);

// Organizations
export const organizations = pgTable("organizations", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  taxId: varchar({ length: 20 }).unique(),
  address: jsonb(),
  settings: jsonb(),
  stripeCustomerId: varchar({ length: 100 }),
  createdAt: timestamp().defaultNow(),
});

// Users
export const users = pgTable(
  "users",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid().references(() => organizations.id),
    email: varchar({ length: 255 }).notNull().unique(),
    phone: varchar({ length: 20 }),
    fullName: varchar({ length: 255 }).notNull(),
    role: userRole().notNull(),
    authProvider: authProvider().notNull(),
    web3Address: varchar({ length: 42 }).unique(), // Ethereum address
    encryptedPrivateKey: text(), // Patient keypair (encrypted)
    mfaEnabled: boolean().default(false),
    profilePictureUrl: varchar({ length: 500 }),
    bio: text(),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow(),
  },
  (table) => ({
    emailIdx: uniqueIndex().on(table.email),
  })
);

// Providers
export const providers = pgTable(
  "providers",
  {
    id: uuid().primaryKey().references(() => users.id),
    orgId: uuid().references(() => organizations.id),
    licenseNumber: varchar({ length: 50 }).notNull(),
    licenseState: varchar({ length: 2 }).notNull(),
    licenseExpiry: timestamp(),
    specializations: text().array(),
    hourlyRate: integer(), // Cents
    bio: text(),
    licenseVerifiedAt: timestamp(),
    verifiedBy: uuid().references(() => users.id),
    malpracticeInsuranceVerified: boolean().default(false),
    avgRating: decimal({ precision: 3, scale: 2 }),
    totalConsultations: integer().default(0),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow(),
  },
  (table) => ({
    licenseUnique: uniqueIndex().on(table.licenseNumber, table.licenseState),
  })
);

// Appointments
export const appointments = pgTable("appointments", {
  id: uuid().primaryKey().defaultRandom(),
  orgId: uuid().references(() => organizations.id).notNull(),
  patientId: uuid().references(() => users.id).notNull(),
  providerId: uuid().references(() => providers.id).notNull(),
  scheduledAt: timestamp().notNull(),
  durationMinutes: integer().default(30),
  status: appointmentStatus().default("pending"),
  reasonForVisit: text(),
  reasonCategory: varchar({ length: 50 }),
  chiefComplaint: text(),
  videoRoomUrl: varchar({ length: 500 }),
  dailyRoomName: varchar({ length: 100 }),
  recordingUrl: varchar({ length: 500 }),
  transcriptionUrl: varchar({ length: 500 }),
  patientNotes: text(),
  providerNotes: jsonb(),
  aiTriageResult: jsonb(),
  aiTriageApprovedBy: uuid().references(() => users.id),
  aiTriageApprovedAt: timestamp(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});

// Medical Records
export const medicalRecords = pgTable("medical_records", {
  id: uuid().primaryKey().defaultRandom(),
  orgId: uuid().references(() => organizations.id).notNull(),
  patientId: uuid().references(() => users.id).notNull(),
  recordType: recordType().notNull(),
  title: varchar({ length: 255 }).notNull(),
  contentJson: jsonb(),
  createdBy: uuid().references(() => users.id).notNull(),
  appointmentId: uuid().references(() => appointments.id),
  ipfsCid: varchar({ length: 100 }), // IPFS content hash
  ipfsEncryptionKeyHash: varchar({ length: 100 }),
  visibility: varchar({ length: 50 }).default("both"),
  isEncrypted: boolean().default(true),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});

// Prescriptions
export const prescriptions = pgTable("prescriptions", {
  id: uuid().primaryKey().defaultRandom(),
  orgId: uuid().references(() => organizations.id).notNull(),
  appointmentId: uuid().references(() => appointments.id),
  patientId: uuid().references(() => users.id).notNull(),
  providerId: uuid().references(() => providers.id).notNull(),
  medicationName: varchar({ length: 255 }).notNull(),
  medicationCode: varchar({ length: 20 }), // RxNorm code
  dosage: varchar({ length: 100 }).notNull(),
  frequency: varchar({ length: 100 }).notNull(),
  durationDays: integer(),
  quantity: integer(),
  refills: integer().default(0),
  pharmacyNdcCode: varchar({ length: 20 }),
  status: prescriptionStatus().default("draft"),
  aiApproved: boolean().default(false),
  aiApprovedBy: uuid().references(() => users.id),
  aiApprovalTimestamp: timestamp(),
  providerApproved: boolean().default(false),
  providerApprovedAt: timestamp(),
  redFlags: jsonb(),
  createdAt: timestamp().defaultNow(),
});

// Clinical Notes
export const clinicalNotes = pgTable("clinical_notes", {
  id: uuid().primaryKey().defaultRandom(),
  orgId: uuid().references(() => organizations.id).notNull(),
  appointmentId: uuid().references(() => appointments.id),
  patientId: uuid().references(() => users.id).notNull(),
  providerId: uuid().references(() => providers.id).notNull(),
  noteType: varchar({ length: 50 }).notNull(),
  aiGeneratedContent: jsonb(),
  clinicianApprovedContent: jsonb(),
  clinicianApprovedBy: uuid().references(() => users.id),
  clinicianApprovedAt: timestamp(),
  icd10Codes: text().array(),
  cptCodes: text().array(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});

// Agent Jobs (Audit Trail)
export const agentJobs = pgTable("agent_jobs", {
  id: uuid().primaryKey().defaultRandom(),
  orgId: uuid().references(() => organizations.id).notNull(),
  appointmentId: uuid().references(() => appointments.id),
  agentType: agentType().notNull(),
  inputText: text().notNull(),
  aiModel: varchar({ length: 100 }).notNull(),
  outputText: text(),
  tokensUsed: integer(),
  latencyMs: integer(),
  costCents: decimal({ precision: 10, scale: 4 }),
  status: varchar({ length: 50 }).default("pending"),
  errorMessage: text(),
  citations: jsonb(),
  clinicianFeedback: text(),
  isApproved: boolean().default(false),
  approvedBy: uuid().references(() => users.id),
  approvedAt: timestamp(),
  createdAt: timestamp().defaultNow(),
  completedAt: timestamp(),
});

// Consent Logs (Immutable)
export const consentLogs = pgTable("consent_logs", {
  id: uuid().primaryKey().defaultRandom(),
  orgId: uuid().references(() => organizations.id).notNull(),
  patientId: uuid().references(() => users.id).notNull(),
  consentType: consentType().notNull(),
  action: varchar({ length: 50 }).notNull(), // granted, revoked, modified
  scope: text(),
  validFrom: timestamp().notNull(),
  validUntil: timestamp(),
  polygonTxHash: varchar({ length: 100 }),
  polygonBlockNumber: integer(),
  createdBy: uuid().references(() => users.id),
  createdAt: timestamp().defaultNow(),
  revokedAt: timestamp(),
});

// Embeddings (ChromaDB references)
export const embeddings = pgTable("embeddings", {
  id: uuid().primaryKey().defaultRandom(),
  orgId: uuid().references(() => organizations.id).notNull(),
  contentType: varchar({ length: 50 }).notNull(),
  contentId: uuid(),
  contentText: text().notNull(),
  embeddingModel: varchar({ length: 100 }).notNull(),
  chromadbId: varchar({ length: 100 }).unique(),
  createdAt: timestamp().defaultNow(),
});