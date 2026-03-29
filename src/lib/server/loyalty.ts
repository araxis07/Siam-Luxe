import { getGiftCardOptions, getRewardOptions } from "@/lib/guest-experience";
import type { AppLocale } from "@/i18n/routing";
import type { ServerSupabase } from "@/lib/server/shared";

function normalizeLocale(locale: string | null | undefined): AppLocale {
  if (locale === "en" || locale === "ja" || locale === "zh" || locale === "ko") {
    return locale;
  }

  return "th";
}

function isMissingLoyaltyTable(error: { message?: string } | null) {
  return typeof error?.message === "string" && error.message.includes("public.loyalty_accounts");
}

export async function ensureLoyaltyAccount(supabase: ServerSupabase, userId: string) {
  const { data: existing, error } = await supabase
    .from("loyalty_accounts")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (!error && existing) {
    return existing;
  }

  if (isMissingLoyaltyTable(error)) {
    throw new Error("Loyalty tables are not ready yet. Run migration 202603300004_add_loyalty_and_menu_operations.sql first.");
  }

  const { data, error: insertError } = await supabase
    .from("loyalty_accounts")
    .upsert({
      user_id: userId,
      current_points: 1280,
      lifetime_points: 1280,
    })
    .select("*")
    .single();

  if (isMissingLoyaltyTable(insertError)) {
    throw new Error("Loyalty tables are not ready yet. Run migration 202603300004_add_loyalty_and_menu_operations.sql first.");
  }

  if (insertError || !data) {
    throw new Error(insertError?.message ?? "Unable to initialize loyalty account");
  }

  return data;
}

export function getRewardDefinitionById(rewardId: string, locale: string | null | undefined) {
  const appLocale = normalizeLocale(locale);
  return getRewardOptions(appLocale).find((item) => item.id === rewardId) ?? null;
}

export function getGiftCardDefinitionById(cardId: string, locale: string | null | undefined) {
  const appLocale = normalizeLocale(locale);
  return getGiftCardOptions(appLocale).find((item) => item.id === cardId) ?? null;
}
