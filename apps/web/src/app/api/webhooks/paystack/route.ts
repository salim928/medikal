/**
 * Paystack Webhook Handler
 * Receives payment notifications from Paystack
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { recordPayment } from '@/lib/payments/record';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-paystack-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY || '';
    const hash = crypto
      .createHmac('sha512', paystackSecretKey)
      .update(body)
      .digest('hex');

    const valid =
      hash.length === signature.length &&
      crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
    if (!valid) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);

    // Handle different event types
    switch (event.event) {
      case 'charge.success':
        await handleChargeSuccess(event.data);
        break;
      case 'transfer.success':
        await handleTransferSuccess(event.data);
        break;
      case 'transfer.failed':
        await handleTransferFailed(event.data);
        break;
      default:
        console.log('Unhandled event type:', event.event);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

interface PaystackChargeData {
  reference: string;
  amount: number;
  currency: string;
  channel?: string;
  paid_at?: string;
  metadata?: {
    userId?: string;
    type?: string;
    appointmentId?: string;
    planName?: string;
    [key: string]: unknown;
  };
}

async function handleChargeSuccess(data: PaystackChargeData) {
  const meta = data.metadata || {};
  await recordPayment({
    provider: 'paystack',
    providerReference: data.reference,
    userId: meta.userId || null,
    type: meta.type,
    amount: data.amount / 100,
    currency: data.currency,
    status: 'success',
    appointmentId: meta.appointmentId || null,
    subscriptionPlan: meta.planName || null,
    channel: data.channel || null,
    metadata: meta,
    paidAt: data.paid_at || new Date().toISOString(),
  });
}

async function handleTransferSuccess(data: Record<string, unknown>) {
  console.log('Transfer successful:', data);
  // Handle successful transfer to provider
}

async function handleTransferFailed(data: Record<string, unknown>) {
  console.log('Transfer failed:', data);
  // Handle failed transfer
}
