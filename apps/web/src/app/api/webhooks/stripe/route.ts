/**
 * Stripe Webhook Handler
 * Receives payment notifications from Stripe
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { recordPayment } from '@/lib/payments/record';

// Instantiated lazily so importing this route (e.g. at build time) never requires the key.
function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: '2025-09-30.clover' });
}

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!stripe || !webhookSecret) {
      return NextResponse.json(
        { error: 'Payment gateway is not configured' },
        { status: 503 }
      );
    }

    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      case 'charge.succeeded':
        await handleChargeSucceeded(event.data.object as Stripe.Charge);
        break;
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      default:
        console.log('Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', message: error.message },
      { status: 500 }
    );
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const meta = paymentIntent.metadata || {};
  await recordPayment({
    provider: 'stripe',
    providerReference: paymentIntent.id,
    userId: meta.userId || null,
    type: meta.type,
    amount: paymentIntent.amount / 100,
    currency: paymentIntent.currency,
    status: 'success',
    appointmentId: meta.appointmentId || null,
    subscriptionPlan: meta.planName || null,
    metadata: meta,
    paidAt: new Date().toISOString(),
  });
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  const meta = paymentIntent.metadata || {};
  await recordPayment({
    provider: 'stripe',
    providerReference: paymentIntent.id,
    userId: meta.userId || null,
    type: meta.type,
    amount: paymentIntent.amount / 100,
    currency: paymentIntent.currency,
    status: 'failed',
    appointmentId: meta.appointmentId || null,
    metadata: meta,
  });
}

async function handleChargeSucceeded(charge: Stripe.Charge) {
  console.log('Charge succeeded:', charge.id);
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Subscription created:', subscription.id);
  // TODO: Activate user subscription
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id);
  // TODO: Update subscription status
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);
  // TODO: Deactivate subscription
}
