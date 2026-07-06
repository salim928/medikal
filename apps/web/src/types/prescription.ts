export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  providerId: string;
  providerName: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  refills: number;
  status: 'active' | 'completed' | 'cancelled' | 'expired';
  prescribedDate: string;
  expiryDate?: string;
  warnings?: string[];
  sideEffects?: string[];
  interactions?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
  recommendation: string;
}
