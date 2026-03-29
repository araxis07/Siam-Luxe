import { z } from "zod";

import { fail, ok } from "@/lib/server/http";
import { getServerSupabase } from "@/lib/server/auth";
import { getPromoDiscount, getPromoOffer } from "@/lib/server/promos";

const promoSchema = z.object({
  code: z.string().min(1),
  subtotal: z.number().nonnegative(),
});

export async function POST(request: Request) {
  const supabase = await getServerSupabase();
  const parsed = promoSchema.safeParse(await request.json());

  if (!parsed.success) {
    return fail("Invalid promo payload", 400, parsed.error.flatten());
  }

  const offer = await getPromoOffer(supabase, parsed.data.code);

  if (!offer) {
    return ok({ valid: false, discount: 0, minimumSubtotal: 0 });
  }

  return ok({
    valid: offer.isActive && parsed.data.subtotal >= offer.minimumSubtotal,
    discount: getPromoDiscount(parsed.data.subtotal, offer),
    minimumSubtotal: offer.minimumSubtotal,
    kind: offer.kind,
    value: offer.value,
    code: offer.code,
  });
}
