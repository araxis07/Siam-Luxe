import { z } from "zod";

import { requireAdmin } from "@/lib/server/admin";
import { fail, ok } from "@/lib/server/http";
import { readJsonBody } from "@/lib/server/request-body";

const reviewAdminUpdateSchema = z.object({
  isPublished: z.boolean(),
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
    return fail("Invalid admin review update", 400);
  }

  const parsed = reviewAdminUpdateSchema.safeParse(body.data);

  if (!parsed.success) {
    return fail("Invalid admin review update", 400, parsed.error.flatten());
  }

  const { id } = await context.params;
  const { supabase } = admin.context;
  const { data, error } = await supabase
    .from("reviews")
    .update({
      is_published: parsed.data.isPublished,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    return fail("Unable to update review", 500, error?.message);
  }

  return ok(data);
}
