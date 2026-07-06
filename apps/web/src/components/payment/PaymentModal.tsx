'use client';

import { useState } from 'react';
import {
  processConsultationPayment,
  processSubscriptionPayment,
  processPrescriptionPayment,
  initializeMobileMoney,
  
  type PaystackTransaction,
} from '@/lib/paystack';
import {
  processStripeConsultationPayment,
  processStripeSubscriptionPayment,
  processStripePrescriptionPayment,
  getStripe,
  formatAmount,
} from '@/lib/stripe';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentType: 'consultation' | 'subscription' | 'prescription';
  amount: number;
  currency?: string;
  userId: string;
  userEmail: string;
  metadata: {
    appointmentId?: string;
    doctorName?: string;
    planName?: string;
    planType?: 'monthly' | 'yearly';
    prescriptionId?: string;
    pharmacyName?: string;
  };
  onSuccess: (transaction: PaystackTransaction) => void;
}

// Stripe Payment Form Component
function StripePaymentForm({ 
  
  onSuccess, 
  onError 
}: { 
  clientSecret: string; 
  onSuccess: () => void; 
  onError: (error: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        onError(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess();
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Payment processing error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

export default function PaymentModal({
  isOpen,
  onClose,
  paymentType,
  amount,
  currency = 'GHS',
  userId,
  userEmail,
  metadata,
  onSuccess,
}: PaymentModalProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    'paystack' | 'stripe' | 'mobile_money'
  >('paystack');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  const [mobileMoneyProvider, setMobileMoneyProvider] = useState<'mtn' | 'vodafone' | 'airteltigo'>('mtn');
  const [phoneNumber, setPhoneNumber] = useState('');

  const isGhana = currency === 'GHS';
  const stripePromise = getStripe();

  if (!isOpen) return null;

  const handlePaystackPayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const paymentDetails = {
        amount,
        userEmail,
        userId,
        onSuccess: (transaction: PaystackTransaction) => {
          setIsProcessing(false);
          onSuccess(transaction);
          onClose();
        },
        onClose: () => {
          setIsProcessing(false);
        },
      };

      switch (paymentType) {
        case 'consultation':
          await processConsultationPayment({
            ...paymentDetails,
            appointmentId: metadata.appointmentId!,
            doctorName: metadata.doctorName!,
          });
          break;
        case 'subscription':
          await processSubscriptionPayment({
            ...paymentDetails,
            planName: metadata.planName!,
            planType: metadata.planType!,
          });
          break;
        case 'prescription':
          await processPrescriptionPayment({
            ...paymentDetails,
            prescriptionId: metadata.prescriptionId!,
            pharmacyName: metadata.pharmacyName!,
          });
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment initialization failed');
      setIsProcessing(false);
    }
  };

  const handleMobileMoneyPayment = async () => {
    if (!phoneNumber) {
      setError('Please enter your mobile money number');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      await initializeMobileMoney({
        amount,
        userEmail,
        phoneNumber,
        provider: mobileMoneyProvider,
        onSuccess: (transaction: PaystackTransaction) => {
          setIsProcessing(false);
          onSuccess(transaction);
          onClose();
        },
        onClose: () => {
          setIsProcessing(false);
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Mobile money payment failed');
      setIsProcessing(false);
    }
  };

  const handleStripePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      let result;

      const baseDetails = {
        amount,
        currency,
        userId,
        userEmail,
      };

      switch (paymentType) {
        case 'consultation':
          result = await processStripeConsultationPayment({
            ...baseDetails,
            appointmentId: metadata.appointmentId!,
            doctorName: metadata.doctorName!,
          });
          break;
        case 'subscription':
          result = await processStripeSubscriptionPayment({
            ...baseDetails,
            planName: metadata.planName!,
            planType: metadata.planType!,
          });
          break;
        case 'prescription':
          result = await processStripePrescriptionPayment({
            ...baseDetails,
            prescriptionId: metadata.prescriptionId!,
            pharmacyName: metadata.pharmacyName!,
          });
          break;
      }

      setStripeClientSecret(result.clientSecret);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment initialization failed');
      setIsProcessing(false);
    }
  };

  const handlePayment = () => {
    if (selectedPaymentMethod === 'paystack') {
      handlePaystackPayment();
    } else if (selectedPaymentMethod === 'mobile_money') {
      handleMobileMoneyPayment();
    } else {
      handleStripePayment();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-ink">Complete Payment</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-ink transition"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Payment Details */}
        <div className="bg-white/80 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-500">Amount:</span>
            <span className="text-2xl font-bold text-brand-600">
              {currency === 'GHS' ? `GH₵ ${amount.toFixed(2)}` : formatAmount(amount, currency)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Type:</span>
            <span className="text-ink capitalize">{paymentType}</span>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-600 mb-3">
            Select Payment Method
          </label>
          
          <div className="space-y-3">
            {isGhana && (
              <>
                <button
                  onClick={() => setSelectedPaymentMethod('paystack')}
                  className={`w-full p-4 rounded-lg border-2 transition ${
                    selectedPaymentMethod === 'paystack'
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-slate-200 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-brand-600 to-brand-500 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-ink font-bold text-xs">PAY</span>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-ink">Paystack</div>
                        <div className="text-xs text-slate-500">Card, Bank, USSD</div>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 ${
                        selectedPaymentMethod === 'paystack'
                          ? 'border-brand-500 bg-brand-600'
                          : 'border-slate-200'
                      }`}
                    />
                  </div>
                </button>

                <button
                  onClick={() => setSelectedPaymentMethod('mobile_money')}
                  className={`w-full p-4 rounded-lg border-2 transition ${
                    selectedPaymentMethod === 'mobile_money'
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-slate-200 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-brand-500 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-ink font-bold text-xs">MM</span>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-ink">Mobile Money</div>
                        <div className="text-xs text-slate-500">MTN, Vodafone, AirtelTigo</div>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 ${
                        selectedPaymentMethod === 'mobile_money'
                          ? 'border-brand-500 bg-brand-600'
                          : 'border-slate-200'
                      }`}
                    />
                  </div>
                </button>
              </>
            )}

            <button
              onClick={() => setSelectedPaymentMethod('stripe')}
              className={`w-full p-4 rounded-lg border-2 transition ${
                selectedPaymentMethod === 'stripe'
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-slate-200 hover:border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-ink font-bold text-xs">💳</span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-ink">Stripe</div>
                    <div className="text-xs text-slate-500">International cards</div>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 ${
                    selectedPaymentMethod === 'stripe'
                      ? 'border-brand-500 bg-brand-600'
                      : 'border-slate-200'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Money Provider Selection */}
        {selectedPaymentMethod === 'mobile_money' && (
          <div className="mb-4 space-y-3">
            <label className="block text-sm font-semibold text-slate-600">
              Select Provider
            </label>
            <select
              value={mobileMoneyProvider}
              onChange={(e) => setMobileMoneyProvider(e.target.value as 'mtn' | 'vodafone' | 'airteltigo')}
              className="w-full bg-canvas border border-slate-200 rounded-lg px-4 py-3 text-ink focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            >
              <option value="mtn">MTN Mobile Money</option>
              <option value="vodafone">Vodafone Cash</option>
              <option value="airteltigo">AirtelTigo Money</option>
            </select>

            <input
              type="tel"
              placeholder="Mobile Money Number (e.g., 0241234567)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full bg-canvas border border-slate-200 rounded-lg px-4 py-3 text-ink placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Stripe Payment Form */}
        {selectedPaymentMethod === 'stripe' && stripeClientSecret && (
          <div className="mb-4">
            <Elements stripe={stripePromise} options={{ clientSecret: stripeClientSecret }}>
              <StripePaymentForm
                clientSecret={stripeClientSecret}
                onSuccess={() => {
                  onSuccess({ reference: `STRIPE-${Date.now()}`, paymentMethod: 'stripe' });
                  onClose();
                }}
                onError={(err) => setError(err)}
              />
            </Elements>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Pay Button (for Paystack and Mobile Money) */}
        {(selectedPaymentMethod === 'paystack' || 
          (selectedPaymentMethod === 'mobile_money' && !stripeClientSecret)) && (
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-brand-600 to-brand-500 text-white py-3 rounded-lg font-semibold hover:from-brand-700 hover:to-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isProcessing ? 'Processing...' : `Pay ${currency === 'GHS' ? `GH₵ ${amount.toFixed(2)}` : formatAmount(amount, currency)}`}
          </button>
        )}

        {/* Initialize Stripe (if not already initialized) */}
        {selectedPaymentMethod === 'stripe' && !stripeClientSecret && (
          <button
            onClick={handleStripePayment}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-brand-500 to-brand-500 text-white py-3 rounded-lg font-semibold hover:from-brand-600 hover:to-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isProcessing ? 'Initializing...' : 'Continue with Stripe'}
          </button>
        )}

        {/* Security Notice */}
        <p className="text-center text-xs text-slate-500 mt-4">
          🔒 Your payment is secured with 256-bit encryption
        </p>
      </div>
    </div>
  );
}
