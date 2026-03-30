import { z } from "zod";

import { requireAdmin } from "@/lib/server/admin";
import { recordAdminAudit } from "@/lib/server/audit";
import { fail, ok } from "@/lib/server/http";
import { readJsonBody } from "@/lib/server/request-body";

const promoCreateSchema = z.object({
  code: z.string().min(3),
  title: z.string().min(3),
  description: z.string().optional().default(""),
  minimumSubtotal: z.number().nonnegative(),
  kind: z.enum(["percent", "amount"]),
  value: z.number().positive(),
  isActive: z.boolean().default(true),
});

export async function GET() {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return admin.response;
  }

  const { supabase } = admin.context;
  const { data, error } = await supabase
    .from("promo_codes")
    .select("*")
    .order("code", { ascending: true });

  if (error) {
    return fail("Unable to load promo codes", 500, error.message);
  }

  return ok(data ?? []);
}

export async function POST(request: Request) {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return admin.response;
  }

  const body = await readJsonBody(request);

  if (!body.ok) {
    return fail("Invalid promo payload", 400);
  }

  const parsed = promoCreateSchema.safeParse(body.data);

  if (!parsed.success) {
    return fail("Invalid promo payload", 400, parsed.error.flatten());
  }

  const { supabase } = admin.context;
  const payload = parsed.data;
  const { data, error } = await supabase
    .from("promo_codes")
    .insert({
      code: payload.code.trim().toUpperCase(),
      title: payload.title,
      description: payload.description,
      minimum_subtotal: payload.minimumSubtotal,
      kind: payload.kind,
      value: payload.value,
      is_active: payload.isActive,
    })
    .select("*")
    .single();

  if (error || !data) {
    return fail("Unable to create promo code", 500, error?.message);
  }

  await recordAdminAudit(admin.context, {
    scope: "admin.promos",
    action: "create",
    targetTable: "promo_codes",
    targetId: data.code,
    summary: `${data.code} created`,
    metadata: parsed.data,
  });

  return ok(data, { status: 201 });
}
