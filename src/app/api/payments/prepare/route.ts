import { z } from "zod";

import { getCurrentUser } from "@/lib/server/auth";
import { fail, ok } from "@/lib/server/http";
import { createPaymentAttempt } from "@/lib/server/payments";

const paymentPrepareSchema = z.object({
  orderId: z.string().uuid(),
});

export async function POST(request: Request) {
  const { supabase, user } = await getCurrentUser();
  const parsed = paymentPrepareSchema.safeParse(await request.json());

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
    });

    return ok(attempt);
  } catch (paymentError) {
    return fail("Unable to prepare payment", 500, paymentError instanceof Error ? paymentError.message : null);
  }
}
