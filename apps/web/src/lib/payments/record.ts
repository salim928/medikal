/**
 * Payment fulfillment helper. Persists a payment and (best-effort) marks the
 * related appointment paid. Server-only: uses the service-role client.
 */
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export interface PaymentRecord {
  provider: "stripe" | "paystack";
  providerReference: string;
  userId?: string | null;
  type?: string;
  amount: number;
  currency: string;
  status: "success" | "failed" | "pending";
  appointmentId?: string | null;
  subscriptionPlan?: string | null;
  channel?: string | null;
  metadata?: Record<string, unknown> | null;
  paidAt?: string | null;
}

export async function recordPayment(p: PaymentRecord) {
  const admin = createSupabaseAdminClient();
  if (!admin) {
    console.warn(
      `[payments] SUPABASE_SERVICE_ROLE_KEY not configured — cannot persist ${p.provider} payment ${p.providerReference}`
    );
    return { ok: false as const, reason: "no-service-role" };
  }

  const { error } = await admin.from("payments").upsert(
    {
      provider: p.provider,
      provider_reference: p.providerReference,
      user_id: p.userId ?? null,
      type: p.type ?? null,
      amount: p.amount,
      currency: p.currency,
      status: p.status,
      appointment_id: p.appointmentId ?? null,
      subscription_plan: p.subscriptionPlan ?? null,
      channel: p.channel ?? null,
      metadata: p.metadata ?? null,
      paid_at: p.paidAt ?? null,
    },
    { onConflict: "provider,provider_reference" }
  );

  if (error) {
    console.error("[payments] upsert failed:", error.message);
    return { ok: false as const, reason: "db-error", error };
  }

  if (p.appointmentId && p.status === "success") {
    const { error: apptErr } = await admin
      .from("appointments")
      .update({ payment_status: "paid", payment_reference: p.providerReference })
      .eq("id", p.appointmentId);
    if (apptErr) {
      console.warn("[payments] appointment update skipped:", apptErr.message);
    }
  }

  return { ok: true as const };
}
