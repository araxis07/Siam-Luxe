import { randomUUID } from "crypto";
import { z } from "zod";

import { getCurrentUser } from "@/lib/server/auth";
import { enqueueAndDispatchEmail } from "@/lib/server/email";
import { fail, ok } from "@/lib/server/http";
import { ensureLoyaltyAccount, getRewardDefinitionById } from "@/lib/server/loyalty";
import { readJsonBody } from "@/lib/server/request-body";

const rewardRedeemSchema = z.object({
  rewardId: z.string().min(1),
  locale: z.enum(["th", "en", "ja", "zh", "ko"]).default("th"),
});

export async function POST(request: Request) {
  const { supabase, user } = await getCurrentUser();

  if (!user) {
    return fail("Unauthorized", 401);
  }

  const body = await readJsonBody(request);

  if (!body.ok) {
    return fail("Invalid reward redemption payload", 400);
  }

  const parsed = rewardRedeemSchema.safeParse(body.data);

  if (!parsed.success) {
    return fail("Invalid reward redemption payload", 400, parsed.error.flatten());
  }

  const reward = getRewardDefinitionById(parsed.data.rewardId, parsed.data.locale);

  if (!reward) {
    return fail("Reward not found", 404);
  }

  try {
    const account = await ensureLoyaltyAccount(supabase, user.id);

    if (Number(account.current_points ?? 0) < reward.points) {
      return fail("Not enough points", 400, {
        currentPoints: Number(account.current_points ?? 0),
      });
    }

    const remainingPoints = Number(account.current_points ?? 0) - reward.points;
    const walletEntryId = `gift-${randomUUID()}`;
    const redemptionId = `reward-${randomUUID()}`;
    const expiresAt = "2026-12-31";

    const { error: loyaltyError } = await supabase
      .from("loyalty_accounts")
      .update({
        current_points: remainingPoints,
      })
      .eq("user_id", user.id);

    if (loyaltyError) {
      return fail("Unable to update loyalty points", 500, loyaltyError.message);
    }

    const { error: walletError } = await supabase.from("gift_wallet_entries").insert({
      id: walletEntryId,
      user_id: user.id,
      code: reward.id.toUpperCase(),
      title: reward.title,
      amount: reward.walletAmount,
      expires_at: expiresAt,
    });

    if (walletError) {
      return fail("Unable to issue reward credit", 500, walletError.message);
    }

    const redeemedAt = new Date().toISOString();
    const { error: redemptionError } = await supabase.from("reward_redemptions").insert({
      id: redemptionId,
      user_id: user.id,
      reward_id: reward.id,
      title: reward.title,
      points_used: reward.points,
      wallet_amount: reward.walletAmount,
      redeemed_at: redeemedAt,
    });

    if (redemptionError) {
      return fail("Unable to record reward redemption", 500, redemptionError.message);
    }

    await supabase.from("notifications").insert({
      user_id: user.id,
      title: reward.title,
      body: `${reward.points} pts · THB ${reward.walletAmount}`,
      kind: "reward-redemption",
      link: "/rewards",
    });

    if (user.email) {
      await enqueueAndDispatchEmail(supabase, {
        userId: user.id,
        toEmail: user.email,
        subject: `Siam Lux reward redeemed · ${reward.title}`,
        templateKey: "reward-redeemed",
        htmlBody: `<p>You redeemed ${reward.points} points for ${reward.title}. THB ${reward.walletAmount} has been added to your wallet.</p>`,
      });
    }

    return ok({
      ok: true,
      remainingPoints,
      giftWalletEntry: {
        id: walletEntryId,
        code: reward.id.toUpperCase(),
        amount: reward.walletAmount,
        title: reward.title,
        expiresAt,
      },
      redeemedReward: {
        id: redemptionId,
        rewardId: reward.id,
        title: reward.title,
        pointsUsed: reward.points,
        walletAmount: reward.walletAmount,
        redeemedAt,
      },
    });
  } catch (error) {
    return fail("Unable to redeem reward", 500, error instanceof Error ? error.message : null);
  }
}
