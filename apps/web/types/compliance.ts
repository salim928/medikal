/**
 * TypeScript Interfaces for Compliance & Security Schema
 * Generated from COMPLIANCE_SECURITY_SCHEMA.sql
 */

// ================================================
// 1. PRESCRIPTION AUTHORITY TYPES
// ================================================

export type DEASchedule = 'I' | 'II' | 'III' | 'IV' | 'V' | null;

export interface PrescriptionAuthority {
  id: string;
  user_id: string;
  role: string;
  can_prescribe: boolean;
  controlled_substances: boolean;
  max_dea_schedule: DEASchedule;
  jurisdiction: string;
  requires_supervision: boolean;
  supervising_physician_id?: string;
  valid_from: string;
  valid_until?: string;
  created_at: string;
  updated_at: string;
}

export type PrescriptionStatus = 
  | 'pending' 
  | 'pending_approval' 
  | 'approved' 
  | 'dispensed' 
  | 'cancelled' 
  | 'rejected';

export interface Prescription {
  id: string;
  patient_id: string;
  prescriber_id: string;
  
  // Medication details
  medication_name: string;
  dea_schedule: DEASchedule;
  dosage: string;
  quantity: number;
  refills: number;
  instructions?: string;
  
  // Workflow
  status: PrescriptionStatus;
  requires_physician_signoff: boolean;
  approving_physician_id?: string;
  approved_at?: string;
  rejection_reason?: string;
  
  // Audit
  created_at: string;
  updated_at: string;
}

export type PrescriptionApprovalAction = 
  | 'approved' 
  | 'rejected' 
  | 'modified' 
  | 'reviewed';

export interface PrescriptionApproval {
  id: string;
  prescription_id: string;
  approver_id: string;
  action: PrescriptionApprovalAction;
  reason?: string;
  modifications?: Record<string, any>;
  approved_at: string;
}

// ================================================
// 2. LEGAL CASE & PHI ACCESS TYPES
// ================================================

export type LegalCaseType = 
  | 'malpractice' 
  | 'consent' 
  | 'rights_advocacy' 
  | 'compliance' 
  | 'other';

export type LegalCaseStatus = 'active' | 'closed' | 'pending';

export interface LegalCase {
  id: string;
  case_number: string;
  lawyer_id: string;
  case_type: LegalCaseType;
  description?: string;
  status: LegalCaseStatus;
  created_at: string;
  closed_at?: string;
  updated_at: string;
}

export type PHIAccessLevel = 'redacted' | 'limited' | 'full';

export interface PHIAccessAuthorization {
  id: string;
  case_id: string;
  patient_id: string;
  lawyer_id: string;
  
  // Access control
  access_level: PHIAccessLevel;
  purpose: string;
  patient_consent: boolean;
  consent_date?: string;
  consent_document_url?: string;
  
  // Time-based access
  valid_from: string;
  valid_until: string;
  
  // Field-level access
  allowed_fields?: string[]; // ['demographics', 'diagnoses']
  
  created_at: string;
  updated_at: string;
}

export type PHIAccessAction = 'view' | 'download' | 'print' | 'export';

export type PHIResourceType = 
  | 'medical_record' 
  | 'prescription' 
  | 'lab_result' 
  | 'imaging';

export interface PHIAccessAudit {
  id: string;
  user_id: string;
  user_role: string;
  patient_id: string;
  case_id?: string;
  
  // Access details
  action: PHIAccessAction;
  resource_type: PHIResourceType;
  resource_id?: string;
  
  // Context
  access_justification?: string;
  ip_address?: string;
  user_agent?: string;
  
  // Data accessed
  fields_accessed?: Record<string, any>;
  was_redacted: boolean;
  
  accessed_at: string;
}

// ================================================
// 3. AI TRIAGE TYPES
// ================================================

export type AITriageRecommendation = 
  | 'urgent' 
  | 'semi_urgent' 
  | 'routine' 
  | 'self_care';

export interface AITriageDecision {
  id: string;
  patient_id: string;
  
  // Input data
  symptoms: Record<string, any>;
  vital_signs?: Record<string, any>;
  patient_history?: Record<string, any>;
  chief_complaint?: string;
  
  // AI output
  ai_model_version: string;
  ai_recommendation: AITriageRecommendation;
  confidence_score: number; // 0.00 to 100.00
  reasoning?: string;
  suggested_specialty?: string;
  suggested_urgency?: string;
  risk_factors?: Record<string, any>;
  
  // MANDATORY clinician review
  reviewed_by?: string;
  clinician_decision?: string;
  clinician_notes?: string;
  clinician_override: boolean;
  override_reason?: string;
  reviewed_at?: string;
  
  // Outcome tracking
  final_diagnosis?: string;
  was_ai_correct?: boolean;
  feedback_notes?: string;
  
  created_at: string;
}

export interface AIModelMetrics {
  id: string;
  model_version: string;
  decision_id: string;
  
  // Performance metrics
  accuracy?: number;
  precision_score?: number;
  recall_score?: number;
  false_positive_rate?: number;
  false_negative_rate?: number;
  
  measured_at: string;
}

// ================================================
// 4. CREDENTIAL VERIFICATION TYPES
// ================================================

export type CredentialVerificationStatus = 
  | 'pending' 
  | 'verified' 
  | 'expired' 
  | 'revoked' 
  | 'suspended';

export type CredentialVerificationMethod = 
  | 'manual_review' 
  | 'api_verification' 
  | 'document_upload';

export type LicenseType = 
  | 'MD' 
  | 'DO' 
  | 'RN' 
  | 'NP' 
  | 'CNM' 
  | 'JD' 
  | 'PharmD' 
  | 'PA' 
  | 'LPN' 
  | 'CNA';

export interface ProfessionalCredential {
  id: string;
  user_id: string;
  role: string;
  
  // License information
  license_number: string;
  license_type: LicenseType;
  issuing_authority: string;
  jurisdiction: string;
  
  // Verification status
  verification_status: CredentialVerificationStatus;
  verified_by?: string;
  verified_at?: string;
  verification_method?: CredentialVerificationMethod;
  verification_document_url?: string;
  verification_notes?: string;
  
  // Validity dates
  issued_date: string;
  expiry_date: string;
  last_revalidation_date?: string;
  next_revalidation_date?: string;
  
  // Additional qualifications
  board_certifications?: string[];
  specializations?: string[];
  practice_restrictions?: string;
  
  // DEA registration
  dea_number?: string;
  dea_expiry?: string;
  
  created_at: string;
  updated_at: string;
}

export type CredentialDocumentType = 
  | 'photo_id' 
  | 'license_copy' 
  | 'diploma' 
  | 'board_certification' 
  | 'malpractice_insurance';

export interface CredentialDocument {
  id: string;
  credential_id: string;
  document_type: CredentialDocumentType;
  file_url: string;
  file_hash?: string; // SHA-256
  file_size?: number;
  mime_type?: string;
  uploaded_at: string;
  verified: boolean;
  verified_at?: string;
  verified_by?: string;
}

export type CredentialAuditAction = 
  | 'submitted' 
  | 'verified' 
  | 'updated' 
  | 'expired' 
  | 'revoked' 
  | 'revalidated' 
  | 'suspended';

export interface CredentialAuditLog {
  id: string;
  user_id: string;
  credential_id: string;
  action: CredentialAuditAction;
  performed_by?: string;
  notes?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

// ================================================
// 5. RBAC & ACCESS CONTROL TYPES
// ================================================

export type RoleName = 
  | 'patient'
  | 'nurse'
  | 'midwife'
  | 'doctor'
  | 'lawyer'
  | 'care_coordinator'
  | 'billing_admin'
  | 'compliance_officer'
  | 'platform_admin'
  | 'super_admin'
  // Phase 2 roles
  | 'pharmacist'
  | 'scheduler'
  | 'front_desk'
  | 'lab_technician'
  | 'imaging_technician'
  | 'billing_finance'
  | 'support_helpdesk'
  | 'external_consultant'
  | 'researcher';

export interface Role {
  id: string;
  name: RoleName;
  description?: string;
  privilege_level: number; // 1-100
  is_clinical: boolean;
  is_administrative: boolean;
  created_at: string;
}

export interface UserRole {
  user_id: string;
  role_id: string;
  assigned_at: string;
  assigned_by?: string;
  expires_at?: string;
}

export type ElevatedAccessStatus = 'active' | 'expired' | 'revoked';

export interface ElevatedAccessGrant {
  id: string;
  user_id: string;
  elevated_role_id: string;
  reason: string;
  granted_by: string;
  
  // Time constraints (max 24 hours)
  valid_from: string;
  valid_until: string;
  auto_revoke: boolean;
  
  // Status
  status: ElevatedAccessStatus;
  revoked_at?: string;
  revoked_by?: string;
  revocation_reason?: string;
  
  created_at: string;
}

export type PermissionAction = 'read' | 'write' | 'delete' | 'approve' | 'audit';

export type PermissionResource = 
  | 'medical_records'
  | 'prescriptions'
  | 'user_management'
  | 'billing'
  | 'appointments'
  | 'lab_results'
  | 'imaging'
  | 'audit_logs'
  | 'credentials'
  | 'legal_cases'
  | 'phi_access'
  | 'ai_triage';

export interface Permission {
  id: string;
  name: string;
  resource: PermissionResource;
  action: PermissionAction;
  description?: string;
  created_at: string;
}

export interface RolePermission {
  role_id: string;
  permission_id: string;
  granted_at: string;
}

// ================================================
// 6. API REQUEST/RESPONSE TYPES
// ================================================

// Prescription workflow
export interface CreatePrescriptionRequest {
  patient_id: string;
  medication_name: string;
  dea_schedule?: DEASchedule;
  dosage: string;
  quantity: number;
  refills: number;
  instructions?: string;
}

export interface CreatePrescriptionResponse {
  prescription: Prescription;
  requires_physician_signoff: boolean;
  approving_physician_id?: string;
}

export interface ApprovePrescriptionRequest {
  prescription_id: string;
  action: 'approve' | 'reject' | 'request_modifications';
  reason?: string;
  modifications?: Record<string, any>;
}

export interface ApprovePrescriptionResponse {
  prescription: Prescription;
  approval: PrescriptionApproval;
}

// PHI access request
export interface RequestPHIAccessRequest {
  case_id: string;
  patient_id: string;
  access_level: PHIAccessLevel;
  purpose: string;
  valid_until: string;
  allowed_fields?: string[];
}

export interface RequestPHIAccessResponse {
  authorization: PHIAccessAuthorization;
  requires_patient_consent: boolean;
  consent_url?: string;
}

// AI triage review
export interface ReviewTriageRequest {
  decision_id: string;
  clinician_decision: string;
  clinician_notes?: string;
  override: boolean;
  override_reason?: string;
}

export interface ReviewTriageResponse {
  decision: AITriageDecision;
  updated_at: string;
}

// Credential submission
export interface SubmitCredentialRequest {
  license_number: string;
  license_type: LicenseType;
  issuing_authority: string;
  jurisdiction: string;
  issued_date: string;
  expiry_date: string;
  dea_number?: string;
  dea_expiry?: string;
}

export interface SubmitCredentialResponse {
  credential: ProfessionalCredential;
  verification_status: CredentialVerificationStatus;
  next_steps: string[];
}

// ================================================
// 7. JWT TOKEN SCOPES
// ================================================

export type TokenScope = 
  // Patient scopes
  | 'patient:read:own'
  | 'patient:write:own'
  | 'appointments:read:own'
  | 'appointments:write:own'
  | 'records:read:own'
  
  // Clinical scopes
  | 'records:read:patient'
  | 'records:write:patient'
  | 'prescribe:create'
  | 'prescribe:approve'
  | 'triage:review'
  | 'video:start'
  | 'video:join'
  
  // Administrative scopes
  | 'users:read'
  | 'users:write'
  | 'credentials:verify'
  | 'audit:read'
  | 'billing:read'
  | 'billing:write'
  
  // Legal scopes
  | 'legal:case:create'
  | 'phi:request:access'
  | 'phi:read:redacted'
  | 'phi:read:limited'
  | 'phi:read:full'
  
  // Admin scopes
  | 'roles:assign'
  | 'permissions:manage'
  | 'system:configure';

export interface JWTPayload {
  sub: string; // user_id
  email: string;
  role: RoleName;
  roles?: RoleName[]; // Multiple roles
  scopes: TokenScope[];
  elevated_access?: {
    role: RoleName;
    expires_at: string;
  };
  credential_verified?: boolean;
  iat: number;
  exp: number;
}

// ================================================
// 8. CONSENT MANAGEMENT
// ================================================

export type ConsentType = 
  | 'phi_access_lawyer'
  | 'phi_access_external'
  | 'research_participation'
  | 'data_sharing'
  | 'marketing';

export interface ConsentRecord {
  id: string;
  patient_id: string;
  consent_type: ConsentType;
  granted_to?: string; // User ID or organization
  purpose: string;
  
  // Consent details
  granted: boolean;
  granted_at?: string;
  revoked_at?: string;
  
  // Audit
  consent_document_url?: string;
  witness_id?: string;
  
  created_at: string;
  updated_at: string;
}

// ================================================
// 9. FEATURE FLAGS
// ================================================

export interface FeatureFlags {
  ALLOW_VENDOR_PHYS: boolean;
  VENDOR_BAA_STATUS: 'pending' | 'signed' | 'expired' | 'none';
  AI_TRIAGE_ENABLED: boolean;
  TELEHEALTH_ENABLED: boolean;
  PRESCRIPTION_WORKFLOW_ENABLED: boolean;
  LAWYER_PHI_ACCESS_ENABLED: boolean;
  RESEARCH_MODULE_ENABLED: boolean;
}

// ================================================
// 10. UTILITY TYPES
// ================================================

export interface AuditMetadata {
  user_id: string;
  user_role: string;
  ip_address?: string;
  user_agent?: string;
  timestamp: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}
