import { z } from "zod";

import { requireAdmin } from "@/lib/server/admin";
import { fail, ok } from "@/lib/server/http";

const promoUpdateSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  minimumSubtotal: z.number().nonnegative().optional(),
  kind: z.enum(["percent", "amount"]).optional(),
  value: z.number().positive().optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ code: string }> },
) {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return admin.response;
  }

  const parsed = promoUpdateSchema.safeParse(await request.json());

  if (!parsed.success) {
    return fail("Invalid promo update", 400, parsed.error.flatten());
  }

  const { code } = await context.params;
  const { supabase } = admin.context;
  const { data, error } = await supabase
    .from("promo_codes")
    .update({
      ...(parsed.data.title ? { title: parsed.data.title } : {}),
      ...(parsed.data.description !== undefined ? { description: parsed.data.description } : {}),
      ...(parsed.data.minimumSubtotal !== undefined ? { minimum_subtotal: parsed.data.minimumSubtotal } : {}),
      ...(parsed.data.kind ? { kind: parsed.data.kind } : {}),
      ...(parsed.data.value !== undefined ? { value: parsed.data.value } : {}),
      ...(parsed.data.isActive !== undefined ? { is_active: parsed.data.isActive } : {}),
    })
    .eq("code", code.toUpperCase())
    .select("*")
    .single();

  if (error || !data) {
    return fail("Unable to update promo code", 500, error?.message);
  }

  return ok(data);
}
