import { z } from "zod";

import { enqueueAndDispatchEmail } from "@/lib/server/email";
import { fail, ok } from "@/lib/server/http";
import { applyPaymentWebhook } from "@/lib/server/payments";
import { readJsonBody } from "@/lib/server/request-body";
import { createAdminClient } from "@/lib/supabase/admin";

const webhookSchema = z.object({
  reference: z.string().min(3),
  status: z.enum(["paid", "failed", "cancelled"]),
  providerPayload: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: Request) {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET;
  const headerSecret = request.headers.get("x-payment-webhook-secret");

  if (!secret || headerSecret !== secret) {
    return fail("Unauthorized", 401);
  }

  const body = await readJsonBody(request);

  if (!body.ok) {
    return fail("Invalid payment webhook payload", 400);
  }

  const parsed = webhookSchema.safeParse(body.data);

  if (!parsed.success) {
    return fail("Invalid payment webhook payload", 400, parsed.error.flatten());
  }

  const supabase = createAdminClient();

  if (!supabase) {
    return fail("Supabase service role is not configured", 500);
  }

  try {
    const result = await applyPaymentWebhook(supabase, parsed.data);

    if (result.order.user_id) {
      await supabase.from("notifications").insert({
        user_id: result.order.user_id,
        title: result.order.code,
        body: `${result.order.code} · payment ${parsed.data.status}`,
        kind: "order",
        link: "/tracking",
      });

      const { data: profile } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", result.order.user_id)
        .maybeSingle();

      if (profile?.email) {
        await enqueueAndDispatchEmail(supabase, {
          userId: result.order.user_id,
          toEmail: profile.email,
          subject: `Siam Lux payment ${parsed.data.status} · ${result.order.code}`,
          templateKey: "payment-webhook-update",
          htmlBody: `<p>Payment for order ${result.order.code} is now ${parsed.data.status}.</p>`,
        });
      }
    }

    return ok({
      ok: true,
      orderId: result.order.id,
      reference: result.attempt.reference,
    });
  } catch (error) {
    return fail("Unable to process payment webhook", 500, error instanceof Error ? error.message : null);
  }
}
