import { getPromoOfferByCode } from "@/lib/experience";
import type { ServerSupabase } from "@/lib/server/shared";

export interface PromoOfferRecord {
  code: string;
  title: string;
  description: string;
  minimumSubtotal: number;
  kind: "percent" | "amount";
  value: number;
  isActive: boolean;
}

export async function getPromoOffer(
  supabase: ServerSupabase,
  code: string | null | undefined,
): Promise<PromoOfferRecord | null> {
  if (!code) {
    return null;
  }

  const normalizedCode = code.trim().toUpperCase();
  const { data, error } = await supabase
    .from("promo_codes")
    .select("code, title, description, minimum_subtotal, kind, value, is_active")
    .eq("code", normalizedCode)
    .maybeSingle();

  if (!error && data) {
    return {
      code: data.code,
      title: data.title,
      description: data.description,
      minimumSubtotal: Number(data.minimum_subtotal ?? 0),
      kind: data.kind as "percent" | "amount",
      value: Number(data.value ?? 0),
      isActive: Boolean(data.is_active),
    };
  }

  const fallback = getPromoOfferByCode(normalizedCode);

  if (!fallback) {
    return null;
  }

  return {
    code: fallback.code,
    title: fallback.title.en,
    description: fallback.description.en,
    minimumSubtotal: fallback.minimumSubtotal,
    kind: fallback.kind,
    value: fallback.value,
    isActive: true,
  };
}

export function getPromoDiscount(
  subtotal: number,
  offer: PromoOfferRecord | null,
) {
  if (!offer || !offer.isActive || subtotal < offer.minimumSubtotal) {
    return 0;
  }

  if (offer.kind === "percent") {
    return Math.round((subtotal * offer.value) / 100);
  }

  return offer.value;
}
