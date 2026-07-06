-- Add pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS "vector";

-- Add embedding column to medical_records
ALTER TABLE medical_records ADD COLUMN embedding vector(384);

-- Create index for vector search
CREATE INDEX idx_medical_records_embedding ON medical_records USING ivfflat (embedding vector_cosine_ops);

-- Add embedding column to clinical_notes
ALTER TABLE clinical_notes ADD COLUMN embedding vector(384);
CREATE INDEX idx_clinical_notes_embedding ON clinical_notes USING ivfflat (embedding vector_cosine_ops);

-- Create audit index
CREATE INDEX idx_consent_logs_patient ON consent_logs(patient_id);
CREATE INDEX idx_consent_logs_created ON consent_logs(created_at DESC);

-- Create composite index for performance
CREATE INDEX idx_appointments_provider_scheduled ON appointments(provider_id, scheduled_at DESC);
CREATE INDEX idx_prescriptions_patient_status ON prescriptions(patient_id, status);