/**
 * Stripe Payment Intent Creation API Route
 * Creates a payment intent for Stripe payments
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Instantiated lazily so importing this route (e.g. at build time) never requires the key.
function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: '2025-09-30.clover' });
}

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: 'Payment gateway is not configured' },
        { status: 503 }
      );
    }

    const { amount, currency, metadata } = await request.json();

    if (!amount || !currency) {
      return NextResponse.json(
        { error: 'Amount and currency are required' },
        { status: 400 }
      );
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Amount in cents
      currency: currency.toLowerCase(),
      metadata: metadata || {},
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Stripe payment intent creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent', message: (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
