import type { ServerSupabase } from "@/lib/server/shared";

function getPaymentProviderName(method: "cash" | "card" | "promptpay") {
  if (method === "card") {
    return process.env.PAYMENT_PROVIDER_NAME ?? "manual-card";
  }

  if (method === "promptpay") {
    return "promptpay-manual";
  }

  return "cash";
}

function buildPaymentReference(orderCode: string) {
  return `${orderCode}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export async function createPaymentAttempt(
  supabase: ServerSupabase,
  payload: {
    orderId: string;
    orderCode: string;
    amount: number;
    currency?: string;
    method: "cash" | "card" | "promptpay";
  },
) {
  const reference = buildPaymentReference(payload.orderCode);
  const provider = getPaymentProviderName(payload.method);
  const status =
    payload.method === "cash" ? "pending" : "requires_action";
  const instructions =
    payload.method === "promptpay"
      ? `Use PromptPay ref ${reference} for THB ${payload.amount}`
      : payload.method === "card"
        ? `Use provider ${provider} with ref ${reference}`
        : `Collect cash payment for order ${payload.orderCode}`;

  const { data, error } = await supabase
    .from("payment_attempts")
    .insert({
      order_id: payload.orderId,
      provider,
      method: payload.method,
      reference,
      amount: payload.amount,
      currency: payload.currency ?? "THB",
      status,
      client_secret: reference,
      metadata: {
        instructions,
      },
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await supabase
    .from("orders")
    .update({
      payment_reference: reference,
    })
    .eq("id", payload.orderId);

  return {
    id: data.id,
    reference: data.reference,
    provider: data.provider,
    status: data.status,
    instructions,
    clientSecret: data.client_secret,
  };
}

export async function applyPaymentWebhook(
  supabase: ServerSupabase,
  payload: {
    reference: string;
    status: "paid" | "failed" | "cancelled";
    providerPayload?: Record<string, unknown>;
  },
) {
  const { data: attempt, error } = await supabase
    .from("payment_attempts")
    .update({
      status: payload.status,
      metadata: payload.providerPayload ?? {},
      updated_at: new Date().toISOString(),
    })
    .eq("reference", payload.reference)
    .select("id, order_id, reference")
    .single();

  if (error || !attempt) {
    throw new Error(error?.message ?? "Payment attempt not found");
  }

  const orderPatch =
    payload.status === "paid"
      ? { payment_status: "paid", paid_at: new Date().toISOString() }
      : payload.status === "failed"
        ? { payment_status: "failed" }
        : { payment_status: "pending" };

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .update(orderPatch)
    .eq("id", attempt.order_id)
    .select("id, user_id, code")
    .single();

  if (orderError || !order) {
    throw new Error(orderError?.message ?? "Unable to update order payment status");
  }

  return {
    attempt,
    order,
  };
}
