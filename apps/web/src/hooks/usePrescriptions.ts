"use client";

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { prescriptionAPI } from "@/lib/api";
import { Prescription, DrugInteraction } from '@/types/prescription';

// Mock data for demonstration
const mockPrescriptions: Prescription[] = [
  {
    id: '1',
    patientId: 'patient-1',
    patientName: 'John Doe',
    providerId: 'provider-1',
    providerName: 'Dr. Sarah Smith',
    medication: 'Amoxicillin',
    dosage: '500mg',
    frequency: 'Three times daily',
    duration: '7 days',
    instructions: 'Take with food. Complete the full course even if symptoms improve.',
    refills: 2,
    status: 'active',
    prescribedDate: '2025-10-10',
    expiryDate: '2026-10-10',
    warnings: ['May cause stomach upset', 'Avoid alcohol'],
    sideEffects: ['Nausea', 'Diarrhea', 'Skin rash'],
    interactions: [],
    createdAt: '2025-10-10T10:00:00Z',
    updatedAt: '2025-10-10T10:00:00Z',
  },
  {
    id: '2',
    patientId: 'patient-1',
    patientName: 'John Doe',
    providerId: 'provider-1',
    providerName: 'Dr. Sarah Smith',
    medication: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    duration: '90 days',
    instructions: 'Take in the morning. Monitor blood pressure regularly.',
    refills: 3,
    status: 'active',
    prescribedDate: '2025-09-15',
    expiryDate: '2026-09-15',
    warnings: ['May cause dizziness', 'Do not stop suddenly'],
    sideEffects: ['Dry cough', 'Dizziness', 'Fatigue'],
    interactions: ['NSAIDs may reduce effectiveness'],
    createdAt: '2025-09-15T14:30:00Z',
    updatedAt: '2025-09-15T14:30:00Z',
  },
  {
    id: '3',
    patientId: 'patient-1',
    patientName: 'John Doe',
    providerId: 'provider-2',
    providerName: 'Dr. Michael Johnson',
    medication: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    duration: '90 days',
    instructions: 'Take with meals. Monitor blood sugar levels.',
    refills: 5,
    status: 'active',
    prescribedDate: '2025-08-20',
    expiryDate: '2026-08-20',
    warnings: ['May cause lactic acidosis in rare cases', 'Inform doctor before any surgery or imaging with contrast'],
    sideEffects: ['Stomach upset', 'Metallic taste', 'Diarrhea'],
    interactions: ['Alcohol increases risk of lactic acidosis'],
    createdAt: '2025-08-20T09:15:00Z',
    updatedAt: '2025-08-20T09:15:00Z',
  },
];

// Drug interaction database (simplified)
const drugInteractionDatabase: Record<string, DrugInteraction> = {
  'amoxicillin-warfarin': {
    drug1: 'Amoxicillin',
    drug2: 'Warfarin',
    severity: 'moderate',
    description: 'Amoxicillin may increase the anticoagulant effect of warfarin',
    recommendation: 'Monitor INR closely when starting or stopping amoxicillin'
  },
  'lisinopril-ibuprofen': {
    drug1: 'Lisinopril',
    drug2: 'Ibuprofen',
    severity: 'moderate',
    description: 'NSAIDs may reduce the blood pressure lowering effect of lisinopril and increase kidney strain',
    recommendation: 'Use NSAIDs sparingly and monitor blood pressure and kidney function'
  },
  'metformin-alcohol': {
    drug1: 'Metformin',
    drug2: 'Alcohol',
    severity: 'severe',
    description: 'Alcohol increases the risk of lactic acidosis with metformin',
    recommendation: 'Avoid excessive alcohol consumption while taking metformin'
  },
  'warfarin-aspirin': {
    drug1: 'Warfarin',
    drug2: 'Aspirin',
    severity: 'severe',
    description: 'Combining warfarin and aspirin significantly increases bleeding risk',
    recommendation: 'Avoid combination unless specifically prescribed. Close monitoring required.'
  },
  'simvastatin-grapefruit': {
    drug1: 'Simvastatin',
    drug2: 'Grapefruit juice',
    severity: 'severe',
    description: 'Grapefruit juice increases simvastatin levels, raising risk of muscle damage',
    recommendation: 'Avoid grapefruit juice completely while taking simvastatin'
  }
};

interface PrescriptionFormData {
  patientId: string;
  patientName: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  refills: number;
}

export function usePrescriptions(patientId?: string) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch prescriptions
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        // Filter by patient if specified
        const filtered = patientId
          ? mockPrescriptions.filter(p => p.patientId === patientId)
          : mockPrescriptions;

        setPrescriptions(filtered);
      } catch (err) {
        setError('Failed to load prescriptions');
        console.error('Error fetching prescriptions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrescriptions();
  }, [patientId]);

  // Create new prescription
  const createPrescription = async (data: PrescriptionFormData): Promise<Prescription> => {
    try {
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newPrescription: Prescription = {
        id: `prescription-${Date.now()}`,
        ...data,
        providerId: 'current-provider-id',
        providerName: 'Current Provider',
        status: 'active',
        prescribedDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        warnings: [],
        sideEffects: [],
        interactions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setPrescriptions(prev => [newPrescription, ...prev]);
      return newPrescription;
    } catch (err) {
      setError('Failed to create prescription');
      throw err;
    }
  };

  // Update prescription status
  const updatePrescriptionStatus = async (
    prescriptionId: string,
    status: Prescription['status']
  ): Promise<void> => {
    try {
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setPrescriptions(prev =>
        prev.map(p =>
          p.id === prescriptionId
            ? { ...p, status, updatedAt: new Date().toISOString() }
            : p
        )
      );
    } catch (err) {
      setError('Failed to update prescription status');
      throw err;
    }
  };

  // Check drug interactions
  const checkDrugInteractions = async (medications: string[]): Promise<DrugInteraction[]> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));

      const interactions: DrugInteraction[] = [];

      // Check all pairs of medications
      for (let i = 0; i < medications.length; i++) {
        for (let j = i + 1; j < medications.length; j++) {
          const drug1 = medications[i].toLowerCase();
          const drug2 = medications[j].toLowerCase();

          // Check both directions
          const key1 = `${drug1}-${drug2}`;
          const key2 = `${drug2}-${drug1}`;

          const interaction = drugInteractionDatabase[key1] || drugInteractionDatabase[key2];

          if (interaction) {
            interactions.push(interaction);
          }
        }
      }

      return interactions;
    } catch (err) {
      console.error('Error checking drug interactions:', err);
      return [];
    }
  };

  // Get prescription by ID
  const getPrescriptionById = (prescriptionId: string): Prescription | undefined => {
    return prescriptions.find(p => p.id === prescriptionId);
  };

  // Get active prescriptions
  const getActivePrescriptions = (): Prescription[] => {
    return prescriptions.filter(p => p.status === 'active');
  };

  // Get prescriptions by provider
  const getPrescriptionsByProvider = (providerId: string): Prescription[] => {
    return prescriptions.filter(p => p.providerId === providerId);
  };

  // Refill prescription
  const refillPrescription = async (prescriptionId: string): Promise<void> => {
    try {
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setPrescriptions(prev =>
        prev.map(p =>
          p.id === prescriptionId
            ? {
                ...p,
                refills: Math.max(0, p.refills - 1),
                updatedAt: new Date().toISOString(),
              }
            : p
        )
      );
    } catch (err) {
      setError('Failed to refill prescription');
      throw err;
    }
  };

  return {
    prescriptions,
    isLoading,
    error,
    createPrescription,
    updatePrescriptionStatus,
    checkDrugInteractions,
    getPrescriptionById,
    getActivePrescriptions,
    getPrescriptionsByProvider,
    refillPrescription,
  };
}
