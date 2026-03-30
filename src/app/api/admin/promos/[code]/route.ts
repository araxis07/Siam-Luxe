import { z } from "zod";

import { requireAdmin } from "@/lib/server/admin";
import { recordAdminAudit } from "@/lib/server/audit";
import { fail, ok } from "@/lib/server/http";
import { readJsonBody } from "@/lib/server/request-body";

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

  const body = await readJsonBody(request);

  if (!body.ok) {
    return fail("Invalid promo update", 400);
  }

  const parsed = promoUpdateSchema.safeParse(body.data);

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

  await recordAdminAudit(admin.context, {
    scope: "admin.promos",
    action: "update",
    targetTable: "promo_codes",
    targetId: data.code,
    summary: `${data.code} active=${data.is_active}`,
    metadata: parsed.data,
  });

  return ok(data);
}
