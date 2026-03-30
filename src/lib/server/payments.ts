import { randomUUID } from "crypto";

import type { AppLocale } from "@/i18n/routing";
import type { ServerSupabase } from "@/lib/server/shared";

type PaymentMethod = "cash" | "card" | "promptpay";
type PaymentWebhookStatus = "paid" | "failed" | "cancelled";

function getPaymentProviderName(method: PaymentMethod) {
  if (method === "card") {
    return process.env.PAYMENT_PROVIDER_NAME ?? "manual-card";
  }

  if (method === "promptpay") {
    return "promptpay-manual";
  }

  return "cash";
}

function getAppUrl(fallbackUrl?: string) {
  return process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? fallbackUrl ?? "http://127.0.0.1:3000";
}

function getStripeEnv(fallbackUrl?: string) {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return null;
  }

  return {
    secretKey,
    appUrl: getAppUrl(fallbackUrl),
  };
}

function buildPaymentReference(orderCode: string) {
  return `${orderCode}-${randomUUID().slice(0, 8).toUpperCase()}`;
}

function asStripeAmount(amount: number) {
  return Math.max(0, Math.round(amount * 100));
}

async function createStripeCheckoutSession(payload: {
  reference: string;
  orderId: string;
  orderCode: string;
  amount: number;
  currency: string;
  locale: AppLocale;
  customerEmail?: string | null;
  fallbackUrl?: string;
}) {
  const env = getStripeEnv(payload.fallbackUrl);

  if (!env) {
    throw new Error("Stripe checkout is not configured");
  }

  const checkoutBaseUrl = new URL(`/${payload.locale}/checkout`, env.appUrl);
  const successUrl = new URL(checkoutBaseUrl);
  successUrl.searchParams.set("payment", "success");
  successUrl.searchParams.set("session_id", "{CHECKOUT_SESSION_ID}");
  successUrl.searchParams.set("orderId", payload.orderId);

  const cancelUrl = new URL(checkoutBaseUrl);
  cancelUrl.searchParams.set("payment", "cancelled");
  cancelUrl.searchParams.set("orderId", payload.orderId);

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("success_url", successUrl.toString());
  params.set("cancel_url", cancelUrl.toString());
  params.set("client_reference_id", payload.reference);
  params.set("metadata[order_id]", payload.orderId);
  params.set("metadata[reference]", payload.reference);
  params.set("line_items[0][quantity]", "1");
  params.set("line_items[0][price_data][currency]", payload.currency.toLowerCase());
  params.set("line_items[0][price_data][unit_amount]", String(asStripeAmount(payload.amount)));
  params.set("line_items[0][price_data][product_data][name]", `Siam Lux order ${payload.orderCode}`);

  if (payload.customerEmail) {
    params.set("customer_email", payload.customerEmail);
  }

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const body = (await response.json()) as {
    id?: string;
    url?: string;
    status?: string;
    payment_status?: string;
    error?: {
      message?: string;
    };
  };

  if (!response.ok || !body.id) {
    throw new Error(body.error?.message ?? "Unable to create Stripe checkout session");
  }

  return {
    sessionId: body.id,
    checkoutUrl: body.url ?? null,
    status: body.payment_status === "paid" ? "paid" : "requires_action",
    instructions: "Continue to Stripe Checkout to finish card payment.",
  };
}

async function fetchStripeCheckoutSession(sessionId: string, fallbackUrl?: string) {
  const env = getStripeEnv(fallbackUrl);

  if (!env) {
    throw new Error("Stripe checkout is not configured");
  }

  const url = new URL(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`);
  url.searchParams.set("expand[]", "payment_intent");

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${env.secretKey}`,
    },
  });

  const payload = (await response.json()) as {
    id?: string;
    status?: string;
    payment_status?: string;
    amount_total?: number | null;
    metadata?: Record<string, string>;
    client_reference_id?: string | null;
    payment_intent?: {
      id?: string;
      status?: string;
    } | null;
    error?: {
      message?: string;
    };
  };

  if (!response.ok || !payload.id) {
    throw new Error(payload.error?.message ?? "Unable to read Stripe checkout session");
  }

  return payload;
}

export async function createPaymentAttempt(
  supabase: ServerSupabase,
  payload: {
    orderId: string;
    orderCode: string;
    amount: number;
    currency?: string;
    method: PaymentMethod;
    locale?: AppLocale;
    customerEmail?: string | null;
    fallbackUrl?: string;
  },
) {
  const reference = buildPaymentReference(payload.orderCode);
  const provider = getPaymentProviderName(payload.method);
  let status = payload.method === "cash" ? "pending" : "requires_action";
  let instructions =
    payload.method === "promptpay"
      ? `Use PromptPay ref ${reference} for THB ${payload.amount}`
      : payload.method === "card"
        ? `Use provider ${provider} with ref ${reference}`
        : `Collect cash payment for order ${payload.orderCode}`;
  let clientSecret = reference;
  let checkoutUrl: string | null = null;
  let providerSessionId: string | null = null;

  if (payload.method === "card" && provider === "stripe-checkout") {
    const session = await createStripeCheckoutSession({
      reference,
      orderId: payload.orderId,
      orderCode: payload.orderCode,
      amount: payload.amount,
      currency: payload.currency ?? "THB",
      locale: payload.locale ?? "en",
      customerEmail: payload.customerEmail,
      fallbackUrl: payload.fallbackUrl,
    });

    status = session.status;
    instructions = session.instructions;
    clientSecret = session.sessionId;
    checkoutUrl = session.checkoutUrl;
    providerSessionId = session.sessionId;
  }

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
      client_secret: clientSecret,
      provider_session_id: providerSessionId,
      checkout_url: checkoutUrl,
      last_status_at: new Date().toISOString(),
      metadata: {
        instructions,
        locale: payload.locale ?? null,
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
    checkoutUrl,
    requiresRedirect: Boolean(checkoutUrl),
  };
}

export async function confirmStripeCheckoutPayment(
  supabase: ServerSupabase,
  payload: {
    orderId: string;
    sessionId: string;
    fallbackUrl?: string;
  },
) {
  const session = await fetchStripeCheckoutSession(payload.sessionId, payload.fallbackUrl);
  const expectedOrderId = session.metadata?.order_id ?? null;

  if (expectedOrderId && expectedOrderId !== payload.orderId) {
    throw new Error("Stripe checkout session does not match the order");
  }

  const { data: attempt, error: attemptError } = await supabase
    .from("payment_attempts")
    .select("reference")
    .eq("order_id", payload.orderId)
    .eq("provider_session_id", payload.sessionId)
    .maybeSingle();

  if (attemptError || !attempt) {
    throw new Error(attemptError?.message ?? "Payment attempt not found");
  }

  if (session.payment_status !== "paid") {
    return {
      confirmed: false,
      status: session.status ?? "open",
      paymentStatus: session.payment_status ?? "unpaid",
      reference: attempt.reference,
    };
  }

  const result = await applyPaymentWebhook(supabase, {
    reference: attempt.reference,
    status: "paid",
    providerPayload: {
      provider: "stripe-checkout",
      session,
    },
  });

  return {
    confirmed: true,
    paymentStatus: "paid",
    reference: attempt.reference,
    status: session.status ?? "complete",
    result,
  };
}

export async function applyPaymentWebhook(
  supabase: ServerSupabase,
  payload: {
    reference: string;
    status: PaymentWebhookStatus;
    providerPayload?: Record<string, unknown>;
  },
) {
  const { data: currentAttempt, error: attemptLookupError } = await supabase
    .from("payment_attempts")
    .select("id, order_id, reference, status")
    .eq("reference", payload.reference)
    .single();

  if (attemptLookupError || !currentAttempt) {
    throw new Error(attemptLookupError?.message ?? "Payment attempt not found");
  }

  const { error } = await supabase
    .from("payment_attempts")
    .update({
      status: payload.status,
      metadata: payload.providerPayload ?? {},
      failure_reason:
        payload.status === "failed"
          ? String(payload.providerPayload?.message ?? "Payment failed")
          : payload.status === "cancelled"
            ? "Payment cancelled"
            : null,
      last_status_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("reference", payload.reference);

  if (error) {
    throw new Error(error.message);
  }

  const { data: currentOrder, error: currentOrderError } = await supabase
    .from("orders")
    .select("id, user_id, code, payment_status")
    .eq("id", currentAttempt.order_id)
    .single();

  if (currentOrderError || !currentOrder) {
    throw new Error(currentOrderError?.message ?? "Unable to read order payment status");
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
    .eq("id", currentAttempt.order_id)
    .select("id, user_id, code, payment_status")
    .single();

  if (orderError || !order) {
    throw new Error(orderError?.message ?? "Unable to update order payment status");
  }

  return {
    attempt: currentAttempt,
    order,
    previousPaymentStatus: currentOrder.payment_status,
  };
}
