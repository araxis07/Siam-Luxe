import { z } from "zod";

import { getCurrentUser } from "@/lib/server/auth";
import { enqueueAndDispatchEmail } from "@/lib/server/email";
import { fail, ok } from "@/lib/server/http";
import { confirmStripeCheckoutPayment } from "@/lib/server/payments";
import { enforceRateLimit } from "@/lib/server/rate-limit";
import { readJsonBody } from "@/lib/server/request-body";

const paymentConfirmSchema = z.object({
  orderId: z.string().uuid(),
  sessionId: z.string().min(3),
});

export async function POST(request: Request) {
  const limit = enforceRateLimit(request, {
    scope: "payments-confirm",
    limit: 20,
    windowMs: 10 * 60_000,
  });

  if (!limit.ok) {
    return limit.response;
  }

  const { supabase, user } = await getCurrentUser();

  if (!user) {
    return fail("Unauthorized", 401);
  }

  const body = await readJsonBody(request);

  if (!body.ok) {
    return fail("Invalid payment confirmation payload", 400);
  }

  const parsed = paymentConfirmSchema.safeParse(body.data);

  if (!parsed.success) {
    return fail("Invalid payment confirmation payload", 400, parsed.error.flatten());
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, user_id, code")
    .eq("id", parsed.data.orderId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (orderError || !order) {
    return fail("Order not found", 404, orderError?.message);
  }

  try {
    const confirmation = await confirmStripeCheckoutPayment(supabase, {
      orderId: parsed.data.orderId,
      sessionId: parsed.data.sessionId,
      fallbackUrl: new URL(request.url).origin,
    });

    if (confirmation.confirmed && confirmation.result && confirmation.result.previousPaymentStatus !== "paid") {
      await supabase.from("notifications").insert({
        user_id: user.id,
        title: order.code,
        body: `${order.code} · payment paid`,
        kind: "order",
        link: "/tracking",
      });

      if (user.email) {
        await enqueueAndDispatchEmail(supabase, {
          userId: user.id,
          toEmail: user.email,
          subject: `Siam Lux payment confirmed · ${order.code}`,
          templateKey: "payment-confirmed",
          htmlBody: `<p>Payment for order ${order.code} has been confirmed.</p>`,
        });
      }
    }

    return ok(
      {
        ok: true,
        confirmed: confirmation.confirmed,
        paymentStatus: confirmation.paymentStatus,
        reference: confirmation.reference,
        status: confirmation.status ?? null,
      },
      {
        headers: limit.headers,
      },
    );
  } catch (error) {
    return fail("Unable to confirm payment", 500, error instanceof Error ? error.message : null);
  }
}
