import { z } from "zod";

import { requireAdmin } from "@/lib/server/admin";
import { fail, ok } from "@/lib/server/http";
import { readJsonBody } from "@/lib/server/request-body";

const branchUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  neighborhood: z.string().min(2).optional(),
  address: z.string().min(5).optional(),
  hours: z.string().min(3).optional(),
  phone: z.string().min(5).optional(),
  etaMinMinutes: z.number().int().positive().optional(),
  etaMaxMinutes: z.number().int().positive().optional(),
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
    return fail("Invalid branch update", 400);
  }

  const parsed = branchUpdateSchema.safeParse(body.data);

  if (!parsed.success) {
    return fail("Invalid branch update", 400, parsed.error.flatten());
  }

  const { id } = await context.params;
  const { supabase } = admin.context;
  const { data, error } = await supabase
    .from("branches")
    .update({
      ...(parsed.data.name ? { name: parsed.data.name } : {}),
      ...(parsed.data.neighborhood ? { neighborhood: parsed.data.neighborhood } : {}),
      ...(parsed.data.address ? { address: parsed.data.address } : {}),
      ...(parsed.data.hours ? { hours: parsed.data.hours } : {}),
      ...(parsed.data.phone ? { phone: parsed.data.phone } : {}),
      ...(parsed.data.etaMinMinutes !== undefined ? { eta_min_minutes: parsed.data.etaMinMinutes } : {}),
      ...(parsed.data.etaMaxMinutes !== undefined ? { eta_max_minutes: parsed.data.etaMaxMinutes } : {}),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    return fail("Unable to update branch", 500, error?.message);
  }

  return ok(data);
}
