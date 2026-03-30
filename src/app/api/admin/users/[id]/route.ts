import { z } from "zod";

import { requireAdmin } from "@/lib/server/admin";
import { recordAdminAudit } from "@/lib/server/audit";
import { fail, ok } from "@/lib/server/http";
import { readJsonBody } from "@/lib/server/request-body";

const userUpdateSchema = z.object({
  role: z.enum(["customer", "staff", "admin"]).optional(),
  notes: z.string().optional(),
  fullName: z.string().min(2).optional(),
  phone: z.string().min(7).optional(),
  preferredLocale: z.enum(["th", "en", "ja", "zh", "ko"]).optional(),
  paymentMethod: z.enum(["cash", "card", "promptpay"]).optional(),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return admin.response;
  }

  const body = await readJsonBody(request);

  if (!body.ok) {
    return fail("Invalid team update", 400);
  }

  const parsed = userUpdateSchema.safeParse(body.data);

  if (!parsed.success) {
    return fail("Invalid team update", 400, parsed.error.flatten());
  }

  const { id } = await context.params;
  const { supabase } = admin.context;
  const { data, error } = await supabase
    .from("profiles")
    .update({
      ...(parsed.data.role !== undefined ? { role: parsed.data.role } : {}),
      ...(parsed.data.notes !== undefined ? { notes: parsed.data.notes } : {}),
      ...(parsed.data.fullName !== undefined ? { full_name: parsed.data.fullName } : {}),
      ...(parsed.data.phone !== undefined ? { phone: parsed.data.phone } : {}),
      ...(parsed.data.preferredLocale !== undefined ? { preferred_locale: parsed.data.preferredLocale } : {}),
      ...(parsed.data.paymentMethod !== undefined ? { payment_method: parsed.data.paymentMethod } : {}),
    })
    .eq("id", id)
    .select("id, email, full_name, phone, preferred_locale, role, notes, payment_method, created_at, updated_at")
    .single();

  if (error || !data) {
    return fail("Unable to update team account", 500, error?.message);
  }

  await recordAdminAudit(admin.context, {
    scope: "admin.users",
    action: "update",
    targetTable: "profiles",
    targetId: id,
    summary: `${data.email ?? id} role ${data.role}`,
    metadata: parsed.data,
  });

  return ok(data);
}
