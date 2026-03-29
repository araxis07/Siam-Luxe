import { randomUUID } from "crypto";
import { z } from "zod";

import { requireAdmin } from "@/lib/server/admin";
import { fail, ok } from "@/lib/server/http";
import { ensureLoyaltyAccount } from "@/lib/server/loyalty";
import { readJsonBody } from "@/lib/server/request-body";

const loyaltyUpdateSchema = z.object({
  pointsDelta: z.number().int().optional(),
  issueWalletAmount: z.number().positive().optional(),
  issueWalletTitle: z.string().min(2).optional(),
  expiresAt: z.string().optional(),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ userId: string }> },
) {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return admin.response;
  }

  const body = await readJsonBody(request);

  if (!body.ok) {
    return fail("Invalid loyalty update", 400);
  }

  const parsed = loyaltyUpdateSchema.safeParse(body.data);

  if (!parsed.success) {
    return fail("Invalid loyalty update", 400, parsed.error.flatten());
  }

  const { userId } = await context.params;
  const { supabase } = admin.context;

  try {
    const account = await ensureLoyaltyAccount(supabase, userId);
    let currentPoints = Number(account.current_points ?? 0);

    if (parsed.data.pointsDelta) {
      currentPoints = Math.max(0, currentPoints + parsed.data.pointsDelta);
      const lifetimePoints =
        parsed.data.pointsDelta > 0
          ? Number(account.lifetime_points ?? currentPoints) + parsed.data.pointsDelta
          : Number(account.lifetime_points ?? currentPoints);

      const { error } = await supabase
        .from("loyalty_accounts")
        .update({
          current_points: currentPoints,
          lifetime_points: lifetimePoints,
        })
        .eq("user_id", userId);

      if (error) {
        return fail("Unable to update loyalty points", 500, error.message);
      }
    }

    if (parsed.data.issueWalletAmount && parsed.data.issueWalletTitle) {
      const { error } = await supabase.from("gift_wallet_entries").insert({
        id: `gift-${randomUUID()}`,
        user_id: userId,
        code: `ADMIN-${randomUUID().slice(0, 8).toUpperCase()}`,
        title: parsed.data.issueWalletTitle,
        amount: parsed.data.issueWalletAmount,
        expires_at: parsed.data.expiresAt ?? "2026-12-31",
      });

      if (error) {
        return fail("Unable to issue wallet credit", 500, error.message);
      }
    }

    const [nextAccount, walletEntries] = await Promise.all([
      supabase
        .from("loyalty_accounts")
        .select("*")
        .eq("user_id", userId)
        .single(),
      supabase
        .from("gift_wallet_entries")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
    ]);

    if (nextAccount.error) {
      return fail("Unable to reload loyalty account", 500, nextAccount.error.message);
    }

    if (walletEntries.error) {
      return fail("Unable to reload wallet credits", 500, walletEntries.error.message);
    }

    return ok({
      account: nextAccount.data,
      walletEntries: walletEntries.data ?? [],
    });
  } catch (error) {
    return fail("Unable to manage loyalty account", 500, error instanceof Error ? error.message : null);
  }
}
