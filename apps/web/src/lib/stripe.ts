/**
 * Stripe Payment Integration
 * International payment gateway for non-Ghana users
 */

import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

// Initialize Stripe
export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      console.error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not configured');
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

// Get Stripe publishable key
export const getStripePublishableKey = (): string => {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) {
    console.error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not configured');
    return '';
  }
  return key;
};

export interface StripePaymentIntent {
  amount: number;
  currency: string;
  metadata?: Record<string, string>;
}

// Create payment intent on backend
export const createPaymentIntent = async (
  data: StripePaymentIntent
): Promise<{ clientSecret: string; paymentIntentId: string }> => {
  try {
    const response = await fetch('/api/payments/stripe/create-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    return await response.json();
  } catch (error) {
    console.error('Create payment intent error:', error);
    throw error;
  }
};

// Process consultation payment with Stripe
export const processStripeConsultationPayment = async (details: {
  amount: number;
  currency: string;
  userId: string;
  userEmail: string;
  appointmentId: string;
  doctorName: string;
}): Promise<{ clientSecret: string; paymentIntentId: string }> => {
  const paymentIntent: StripePaymentIntent = {
    amount: Math.round(details.amount * 100), // Convert to cents
    currency: details.currency.toLowerCase(),
    metadata: {
      type: 'consultation',
      userId: details.userId,
      userEmail: details.userEmail,
      appointmentId: details.appointmentId,
      doctorName: details.doctorName,
    },
  };

  return await createPaymentIntent(paymentIntent);
};

// Process subscription payment with Stripe
export const processStripeSubscriptionPayment = async (details: {
  amount: number;
  currency: string;
  userId: string;
  userEmail: string;
  planName: string;
  planType: 'monthly' | 'yearly';
}): Promise<{ clientSecret: string; paymentIntentId: string }> => {
  const paymentIntent: StripePaymentIntent = {
    amount: Math.round(details.amount * 100), // Convert to cents
    currency: details.currency.toLowerCase(),
    metadata: {
      type: 'subscription',
      userId: details.userId,
      userEmail: details.userEmail,
      planName: details.planName,
      planType: details.planType,
    },
  };

  return await createPaymentIntent(paymentIntent);
};

// Process prescription payment with Stripe
export const processStripePrescriptionPayment = async (details: {
  amount: number;
  currency: string;
  userId: string;
  userEmail: string;
  prescriptionId: string;
  pharmacyName: string;
}): Promise<{ clientSecret: string; paymentIntentId: string }> => {
  const paymentIntent: StripePaymentIntent = {
    amount: Math.round(details.amount * 100), // Convert to cents
    currency: details.currency.toLowerCase(),
    metadata: {
      type: 'prescription',
      userId: details.userId,
      userEmail: details.userEmail,
      prescriptionId: details.prescriptionId,
      pharmacyName: details.pharmacyName,
    },
  };

  return await createPaymentIntent(paymentIntent);
};

// Confirm payment
export const confirmStripePayment = async (
  stripe: Stripe,
  clientSecret: string,
  elements: StripeElements
): Promise<{ error?: unknown }> => {
  try {
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result;
  } catch (error) {
    console.error('Confirm payment error:', error);
    throw error;
  }
};

// Create Stripe checkout session for subscriptions
export const createCheckoutSession = async (details: {
  priceId: string;
  userId: string;
  userEmail: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ sessionId: string; url: string }> => {
  try {
    const response = await fetch('/api/payments/stripe/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(details),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    return await response.json();
  } catch (error) {
    console.error('Create checkout session error:', error);
    throw error;
  }
};

// Redirect to Stripe Checkout
export const redirectToCheckout = async (sessionId: string): Promise<void> => {
  const stripe = await getStripe();
  if (!stripe) {
    throw new Error('Stripe failed to load');
  }

  // redirectToCheckout was removed from @stripe/stripe-js types but still exists at
  // runtime. Cast preserves behavior; prefer server-returned Checkout `url` long-term.
  const { error } = await (stripe as unknown as { redirectToCheckout: (o: { sessionId: string }) => Promise<{ error?: unknown }> }).redirectToCheckout({ sessionId });
  if (error) {
    console.error('Redirect error:', error);
    throw error;
  }
};

// Retrieve payment intent status
export const retrievePaymentIntent = async (
  paymentIntentId: string
): Promise<unknown> => {
  try {
    const response = await fetch(
      `/api/payments/stripe/retrieve-intent/${paymentIntentId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to retrieve payment intent');
    }

    return await response.json();
  } catch (error) {
    console.error('Retrieve payment intent error:', error);
    throw error;
  }
};

// Format amount for display
export const formatAmount = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);
};

const stripeHelpers = {
  getStripe,
  createPaymentIntent,
  processStripeConsultationPayment,
  processStripeSubscriptionPayment,
  processStripePrescriptionPayment,
  confirmStripePayment,
  createCheckoutSession,
  redirectToCheckout,
  retrievePaymentIntent,
  formatAmount,
  getStripePublishableKey,
};

export default stripeHelpers;
