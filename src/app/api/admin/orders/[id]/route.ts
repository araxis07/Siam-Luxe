import { z } from "zod";

import { requireAdmin } from "@/lib/server/admin";
import { enqueueAndDispatchEmail } from "@/lib/server/email";
import { fail, ok } from "@/lib/server/http";
import { readJsonBody } from "@/lib/server/request-body";

const orderUpdateSchema = z.object({
  status: z.enum(["pending", "confirmed", "preparing", "ready", "dispatching", "arriving", "completed", "cancelled"]).optional(),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return admin.response;
  }

  const body = await readJsonBody(request);

  if (!body.ok) {
    return fail("Invalid admin order update", 400);
  }

  const parsed = orderUpdateSchema.safeParse(body.data);

  if (!parsed.success) {
    return fail("Invalid admin order update", 400, parsed.error.flatten());
  }

  const { id } = await context.params;
  const { supabase } = admin.context;
  const { data: currentOrder, error: currentError } = await supabase
    .from("orders")
    .select("id, user_id, code, status")
    .eq("id", id)
    .single();

  if (currentError || !currentOrder) {
    return fail("Order not found", 404, currentError?.message);
  }

  const { data, error } = await supabase
    .from("orders")
    .update({
      ...(parsed.data.status ? { status: parsed.data.status } : {}),
      ...(parsed.data.paymentStatus ? { payment_status: parsed.data.paymentStatus } : {}),
      ...(parsed.data.paymentStatus === "paid" ? { paid_at: new Date().toISOString() } : {}),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    return fail("Unable to update order", 500, error?.message);
  }

  if (parsed.data.status && parsed.data.status !== currentOrder.status) {
    await supabase.from("order_status_history").insert({
      order_id: id,
      status: parsed.data.status,
    });
  }

  if (data.user_id) {
    await supabase.from("notifications").insert({
      user_id: data.user_id,
      title: data.code,
      body: `${data.code} · ${data.status} · ${data.payment_status}`,
      kind: "order",
      link: "/tracking",
    });

    const { data: profile } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", data.user_id)
      .maybeSingle();

    if (profile?.email) {
      await enqueueAndDispatchEmail(supabase, {
        userId: data.user_id,
        toEmail: profile.email,
        subject: `Siam Lux order update · ${data.code}`,
        templateKey: "order-status-updated",
        htmlBody: `<p>Your order ${data.code} is now ${data.status}. Payment status: ${data.payment_status}.</p>`,
      });
    }
  }

  return ok(data);
}
