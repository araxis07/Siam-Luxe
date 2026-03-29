import { randomUUID } from "crypto";
import { z } from "zod";

import { getCurrentUser } from "@/lib/server/auth";
import { enqueueAndDispatchEmail } from "@/lib/server/email";
import { fail, ok } from "@/lib/server/http";
import { getGiftCardDefinitionById } from "@/lib/server/loyalty";
import { readJsonBody } from "@/lib/server/request-body";

const purchaseGiftCardSchema = z.object({
  cardId: z.string().min(1),
  locale: z.enum(["th", "en", "ja", "zh", "ko"]).default("th"),
  recipient: z.string().min(1).optional().default(""),
  recipientEmail: z.string().email().optional().or(z.literal("")).default(""),
  note: z.string().optional().default(""),
});

export async function POST(request: Request) {
  const { supabase, user } = await getCurrentUser();

  if (!user) {
    return fail("Unauthorized", 401);
  }

  const body = await readJsonBody(request);

  if (!body.ok) {
    return fail("Invalid gift card purchase payload", 400);
  }

  const parsed = purchaseGiftCardSchema.safeParse(body.data);

  if (!parsed.success) {
    return fail("Invalid gift card purchase payload", 400, parsed.error.flatten());
  }

  const card = getGiftCardDefinitionById(parsed.data.cardId, parsed.data.locale);

  if (!card) {
    return fail("Gift card not found", 404);
  }

  const title =
    parsed.data.recipient.trim().length > 0
      ? `${card.title} · ${parsed.data.recipient.trim()}`
      : card.title;
  const entryId = `gift-${randomUUID()}`;
  const expiresAt = "2026-12-31";

  const { error } = await supabase.from("gift_wallet_entries").insert({
    id: entryId,
    user_id: user.id,
    code: card.id.toUpperCase(),
    title,
    amount: card.amount,
    expires_at: expiresAt,
  });

  if (error) {
    return fail("Unable to issue gift card", 500, error.message);
  }

  await supabase.from("notifications").insert({
    user_id: user.id,
    title,
    body: `THB ${card.amount} · ${parsed.data.recipientEmail || user.email || ""}`,
    kind: "gift-card-issued",
    link: "/gift-cards",
  });

  const emailTarget = parsed.data.recipientEmail || user.email || null;

  if (emailTarget) {
    await enqueueAndDispatchEmail(supabase, {
      userId: user.id,
      toEmail: emailTarget,
      subject: `Siam Lux gift card issued · ${title}`,
      templateKey: "gift-card-issued",
      htmlBody: `<p>A Siam Lux gift balance of THB ${card.amount} has been prepared for ${parsed.data.recipient || "your account"}.</p>${parsed.data.note ? `<p>${parsed.data.note}</p>` : ""}`,
    });
  }

  return ok({
    ok: true,
    giftWalletEntry: {
      id: entryId,
      code: card.id.toUpperCase(),
      amount: card.amount,
      title,
      expiresAt,
      note: parsed.data.note,
    },
  });
}
