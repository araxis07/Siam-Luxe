import { z } from "zod";

import { getCurrentUser } from "@/lib/server/auth";
import { fail, ok } from "@/lib/server/http";
import { createPaymentAttempt } from "@/lib/server/payments";
import { enforceRateLimit } from "@/lib/server/rate-limit";
import { readJsonBody } from "@/lib/server/request-body";

const paymentPrepareSchema = z.object({
  orderId: z.string().uuid(),
  locale: z.enum(["th", "en", "ja", "zh", "ko"]).default("th"),
});

export async function POST(request: Request) {
  const limit = enforceRateLimit(request, {
    scope: "payments-prepare",
    limit: 20,
    windowMs: 10 * 60_000,
  });

  if (!limit.ok) {
    return limit.response;
  }

  const { supabase, user } = await getCurrentUser();
  const body = await readJsonBody(request);

  if (!body.ok) {
    return fail("Invalid payment preparation payload", 400);
  }

  const parsed = paymentPrepareSchema.safeParse(body.data);

  if (!parsed.success) {
    return fail("Invalid payment preparation payload", 400, parsed.error.flatten());
  }

  let query = supabase
    .from("orders")
    .select("id, code, user_id, total, currency, payment_method")
    .eq("id", parsed.data.orderId);

  if (user) {
    query = query.eq("user_id", user.id);
  } else {
    return fail("Unauthorized", 401);
  }

  const { data: order, error } = await query.single();

  if (error || !order) {
    return fail("Order not found", 404, error?.message);
  }

  try {
    const attempt = await createPaymentAttempt(supabase, {
      orderId: order.id,
      orderCode: order.code,
      amount: Number(order.total ?? 0),
      currency: order.currency ?? "THB",
      method: order.payment_method,
      locale: parsed.data.locale,
      customerEmail: user.email ?? null,
      fallbackUrl: new URL(request.url).origin,
    });

    return ok(attempt, {
      headers: limit.headers,
    });
  } catch (paymentError) {
    return fail("Unable to prepare payment", 500, paymentError instanceof Error ? paymentError.message : null);
  }
}
