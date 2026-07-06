export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName?: string;
  title: string;
  record_type: 'Lab Results' | 'X-Ray' | 'MRI' | 'CT Scan' | 'Prescription' | 'Consultation Notes' | 'Vaccination Record' | 'Surgery Report' | 'Other';
  description?: string;
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
  uploadedBy: string;
  uploadedByRole: 'patient' | 'provider';
  created_at: string;
  updated_at?: string;
  clinicalNotes?: ClinicalNote[];
}

export interface ClinicalNote {
  id: string;
  recordId: string;
  providerId: string;
  providerName: string;
  noteText: string;
  noteType?: 'general' | 'assessment' | 'lab-review' | 'follow-up' | 'treatment';
  createdAt: string;
  signature?: string;
}
