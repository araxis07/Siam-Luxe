import { getReservationAutomationSnapshot } from "@/lib/server/automation";
import type { ServerSupabase } from "@/lib/server/shared";
import { getSupabaseEnv, getSupabaseServiceEnv } from "@/lib/supabase/env";

function getPaymentProviderStatus() {
  const provider = process.env.PAYMENT_PROVIDER_NAME ?? "manual-card";
  const hasStripe = Boolean(process.env.STRIPE_SECRET_KEY);
  const hasWebhookSecret = Boolean(process.env.PAYMENT_WEBHOOK_SECRET);

  return {
    provider,
    configured:
      provider === "stripe-checkout"
        ? hasStripe && hasWebhookSecret
        : hasWebhookSecret || provider === "cash" || provider.startsWith("manual") || provider === "promptpay-manual",
    hasStripe,
    hasWebhookSecret,
  };
}

export function getRuntimeStatus() {
  const supabase = getSupabaseEnv();
  const service = getSupabaseServiceEnv();
  const payment = getPaymentProviderStatus();

  return {
    ready: Boolean(supabase),
    services: {
      supabaseClient: Boolean(supabase),
      supabaseServiceRole: Boolean(service),
      resend: Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL),
      internalCron: Boolean(process.env.INTERNAL_CRON_SECRET),
      payment,
    },
    timestamp: new Date().toISOString(),
  };
}

async function readCount(
  query: PromiseLike<{
    count: number | null;
    error: {
      message: string;
    } | null;
  }>,
) {
  const { count, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}

export async function getOperationalSnapshot(supabase: ServerSupabase) {
  const [queuedEmails, failedEmails, pendingPayments, failedPayments, pendingOrderPayments, automation] = await Promise.all([
    readCount(supabase.from("email_outbox").select("id", { count: "exact", head: true }).eq("status", "queued")),
    readCount(supabase.from("email_outbox").select("id", { count: "exact", head: true }).eq("status", "failed")),
    readCount(
      supabase.from("payment_attempts").select("id", { count: "exact", head: true }).eq("status", "requires_action"),
    ),
    readCount(supabase.from("payment_attempts").select("id", { count: "exact", head: true }).eq("status", "failed")),
    readCount(supabase.from("orders").select("id", { count: "exact", head: true }).eq("payment_status", "pending")),
    getReservationAutomationSnapshot(supabase),
  ]);

  return {
    queues: {
      queuedEmails,
      failedEmails,
      pendingPayments,
      failedPayments,
      pendingOrderPayments,
    },
    automation,
  };
}
