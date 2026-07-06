/**
 * Paystack Payment Verification API Route
 * Handles payment verification after successful Paystack transaction
 */

import { NextRequest, NextResponse } from 'next/server';
import { recordPayment } from '@/lib/payments/record';

export async function POST(request: NextRequest) {
  try {
    const { reference } = await request.json();

    if (!reference) {
      return NextResponse.json(
        { error: 'Payment reference is required' },
        { status: 400 }
      );
    }

    // Verify payment with Paystack API
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    
    if (!paystackSecretKey) {
      console.error('PAYSTACK_SECRET_KEY not configured');
      return NextResponse.json(
        { error: 'Payment gateway configuration error' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Paystack verification failed:', data);
      return NextResponse.json(
        { error: 'Payment verification failed', details: data },
        { status: response.status }
      );
    }

    if (data.status && data.data.status === 'success') {
      // Payment successful - store in database
      const paymentData = {
        reference: data.data.reference,
        amount: data.data.amount / 100, // Convert from kobo to cedis
        currency: data.data.currency,
        status: data.data.status,
        paymentMethod: 'paystack',
        channel: data.data.channel,
        paidAt: data.data.paid_at,
        metadata: data.data.metadata,
        customer: {
          email: data.data.customer.email,
          id: data.data.customer.id,
        },
      };

      // Persist the verified payment (idempotent upsert; webhook may also fire).
      const meta = data.data.metadata || {};
      await recordPayment({
        provider: 'paystack',
        providerReference: data.data.reference,
        userId: meta.userId || null,
        type: meta.type,
        amount: data.data.amount / 100,
        currency: data.data.currency,
        status: 'success',
        appointmentId: meta.appointmentId || null,
        subscriptionPlan: meta.planName || null,
        channel: data.data.channel || null,
        metadata: meta,
        paidAt: data.data.paid_at || new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        data: paymentData,
      });
    } else {
      return NextResponse.json(
        { error: 'Payment was not successful', details: data },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
