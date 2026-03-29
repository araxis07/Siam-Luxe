import { z } from "zod";

import { requireAdmin } from "@/lib/server/admin";
import { fail, ok } from "@/lib/server/http";
import { readJsonBody } from "@/lib/server/request-body";

const menuOperationSchema = z.object({
  priceOverride: z.number().positive().nullable().optional(),
  isAvailable: z.boolean().optional(),
  featuredOverride: z.boolean().nullable().optional(),
  statusOverride: z.enum(["available", "limited", "soldOut", "chefToday"]).nullable().optional(),
  kitchenNote: z.string().optional(),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ dishId: string }> },
) {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return admin.response;
  }

  const body = await readJsonBody(request);

  if (!body.ok) {
    return fail("Invalid menu operation payload", 400);
  }

  const parsed = menuOperationSchema.safeParse(body.data);

  if (!parsed.success) {
    return fail("Invalid menu operation payload", 400, parsed.error.flatten());
  }

  const { dishId } = await context.params;
  const { supabase } = admin.context;
  const { data, error } = await supabase
    .from("dish_operations")
    .upsert({
      dish_id: dishId,
      ...(parsed.data.priceOverride !== undefined ? { price_override: parsed.data.priceOverride } : {}),
      ...(parsed.data.isAvailable !== undefined ? { is_available: parsed.data.isAvailable } : {}),
      ...(parsed.data.featuredOverride !== undefined ? { featured_override: parsed.data.featuredOverride } : {}),
      ...(parsed.data.statusOverride !== undefined ? { status_override: parsed.data.statusOverride } : {}),
      ...(parsed.data.kitchenNote !== undefined ? { kitchen_note: parsed.data.kitchenNote } : {}),
    })
    .select("*")
    .single();

  if (error || !data) {
    return fail("Unable to update menu operation", 500, error?.message);
  }

  return ok(data);
}
