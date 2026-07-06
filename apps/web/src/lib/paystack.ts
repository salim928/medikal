/**
 * Paystack Payment Integration
 * Primary payment gateway for Ghana market
 */

export interface PaystackConfig {
  publicKey: string;
  email: string;
  amount: number; // Amount in kobo (GHS 100 = 10000 kobo)
  currency?: string;
  reference?: string;
  metadata?: Record<string, any>;
  channels?: string[];
  onSuccess: (response: any) => void;
  onClose: () => void;
}

export interface PaymentDetails {
  type: 'consultation' | 'subscription' | 'prescription';
  amount: number;
  currency: string;
  userId: string;
  userEmail: string;
  metadata: Record<string, any>;
}

// Get Paystack public key from environment
export const getPaystackPublicKey = (): string => {
  const key = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
  if (!key) {
    console.error('NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is not configured');
    return '';
  }
  return key;
};

// Generate unique payment reference
export const generatePaymentReference = (prefix: string = 'MED'): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `${prefix}-${timestamp}-${random}`;
};

// Convert amount to kobo (smallest currency unit)
export const toKobo = (amount: number): number => {
  return Math.round(amount * 100);
};

// Convert kobo to cedis
export const fromKobo = (kobo: number): number => {
  return kobo / 100;
};

// Initialize Paystack payment popup
export const initializePaystackPayment = async (
  config: PaystackConfig
): Promise<void> => {
  try {
    // Loaded dynamically (browser only) so this module never touches `window` at import.
    const PaystackPop = (await import('@paystack/inline-js')).default;
    const popup = new PaystackPop();

    popup.newTransaction({
      key: config.publicKey,
      email: config.email,
      amount: config.amount,
      currency: config.currency || 'GHS',
      ref: config.reference || generatePaymentReference(),
      metadata: config.metadata,
      channels: config.channels || ['card', 'mobile_money', 'bank', 'ussd'],
      onSuccess: (transaction: any) => {
        console.log('Payment successful:', transaction);
        config.onSuccess(transaction);
      },
      onCancel: () => {
        console.log('Payment cancelled');
        config.onClose();
      },
    });
  } catch (error) {
    console.error('Paystack initialization error:', error);
    throw error;
  }
};

// Process consultation payment
export const processConsultationPayment = async (details: {
  amount: number;
  userEmail: string;
  userId: string;
  appointmentId: string;
  doctorName: string;
  onSuccess: (transaction: any) => void;
  onClose: () => void;
}): Promise<void> => {
  const config: PaystackConfig = {
    publicKey: getPaystackPublicKey(),
    email: details.userEmail,
    amount: toKobo(details.amount),
    currency: 'GHS',
    reference: generatePaymentReference('CONSULT'),
    metadata: {
      type: 'consultation',
      userId: details.userId,
      appointmentId: details.appointmentId,
      doctorName: details.doctorName,
      custom_fields: [
        {
          display_name: 'Appointment ID',
          variable_name: 'appointment_id',
          value: details.appointmentId,
        },
        {
          display_name: 'Doctor',
          variable_name: 'doctor_name',
          value: details.doctorName,
        },
      ],
    },
    onSuccess: details.onSuccess,
    onClose: details.onClose,
  };

  await initializePaystackPayment(config);
};

// Process subscription payment
export const processSubscriptionPayment = async (details: {
  amount: number;
  userEmail: string;
  userId: string;
  planName: string;
  planType: 'monthly' | 'yearly';
  onSuccess: (transaction: any) => void;
  onClose: () => void;
}): Promise<void> => {
  const config: PaystackConfig = {
    publicKey: getPaystackPublicKey(),
    email: details.userEmail,
    amount: toKobo(details.amount),
    currency: 'GHS',
    reference: generatePaymentReference('SUB'),
    metadata: {
      type: 'subscription',
      userId: details.userId,
      planName: details.planName,
      planType: details.planType,
      custom_fields: [
        {
          display_name: 'Plan',
          variable_name: 'plan_name',
          value: details.planName,
        },
        {
          display_name: 'Billing',
          variable_name: 'plan_type',
          value: details.planType,
        },
      ],
    },
    onSuccess: details.onSuccess,
    onClose: details.onClose,
  };

  await initializePaystackPayment(config);
};

// Process prescription/pharmacy payment
export const processPrescriptionPayment = async (details: {
  amount: number;
  userEmail: string;
  userId: string;
  prescriptionId: string;
  pharmacyName: string;
  onSuccess: (transaction: any) => void;
  onClose: () => void;
}): Promise<void> => {
  const config: PaystackConfig = {
    publicKey: getPaystackPublicKey(),
    email: details.userEmail,
    amount: toKobo(details.amount),
    currency: 'GHS',
    reference: generatePaymentReference('PRESC'),
    metadata: {
      type: 'prescription',
      userId: details.userId,
      prescriptionId: details.prescriptionId,
      pharmacyName: details.pharmacyName,
      custom_fields: [
        {
          display_name: 'Prescription ID',
          variable_name: 'prescription_id',
          value: details.prescriptionId,
        },
        {
          display_name: 'Pharmacy',
          variable_name: 'pharmacy_name',
          value: details.pharmacyName,
        },
      ],
    },
    onSuccess: details.onSuccess,
    onClose: details.onClose,
  };

  await initializePaystackPayment(config);
};

// Verify payment on backend
export const verifyPayment = async (reference: string): Promise<any> => {
  try {
    const response = await fetch('/api/payments/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reference }),
    });

    if (!response.ok) {
      throw new Error('Payment verification failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Payment verification error:', error);
    throw error;
  }
};

// Payment helper for mobile money
export const initializeMobileMoney = async (details: {
  amount: number;
  userEmail: string;
  phoneNumber: string;
  provider: 'mtn' | 'vodafone' | 'airteltigo';
  onSuccess: (transaction: any) => void;
  onClose: () => void;
}): Promise<void> => {
  const config: PaystackConfig = {
    publicKey: getPaystackPublicKey(),
    email: details.userEmail,
    amount: toKobo(details.amount),
    currency: 'GHS',
    reference: generatePaymentReference('MM'),
    channels: ['mobile_money'],
    metadata: {
      type: 'mobile_money',
      provider: details.provider,
      phoneNumber: details.phoneNumber,
    },
    onSuccess: details.onSuccess,
    onClose: details.onClose,
  };

  await initializePaystackPayment(config);
};

export default {
  initializePaystackPayment,
  processConsultationPayment,
  processSubscriptionPayment,
  processPrescriptionPayment,
  initializeMobileMoney,
  verifyPayment,
  generatePaymentReference,
  toKobo,
  fromKobo,
  getPaystackPublicKey,
};
