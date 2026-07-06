import Stripe from "stripe";

export class StripeClient {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2023-10-16",
    });
  }

  async createPaymentIntent(
    amount: number,
    currency: string = "usd",
    metadata?: Record<string, string>
  ) {
    return this.stripe.paymentIntents.create({
      amount,
      currency,
      metadata,
    });
  }

  async createCustomer(email: string, name: string) {
    return this.stripe.customers.create({
      email,
      name,
    });
  }

  async createSubscription(customerId: string, priceId: string) {
    return this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
    });
  }

  async getInvoices(customerId: string) {
    return this.stripe.invoices.list({
      customer: customerId,
    });
  }

  async handleWebhook(
    payload: Buffer,
    signature: string
  ): Promise<Stripe.Event | null> {
    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ""
      );
    } catch (error) {
      console.error("Webhook verification failed:", error);
      return null;
    }
  }
}

export const stripeClient = new StripeClient();