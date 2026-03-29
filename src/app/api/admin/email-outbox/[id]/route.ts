import { z } from "zod";

import { requireAdmin } from "@/lib/server/admin";
import { dispatchEmailOutboxEntry } from "@/lib/server/email";
import { fail, ok } from "@/lib/server/http";
import { readJsonBody } from "@/lib/server/request-body";

const outboxActionSchema = z.object({
  action: z.enum(["dispatch", "skip"]),
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
    return fail("Invalid email outbox action", 400);
  }

  const parsed = outboxActionSchema.safeParse(body.data);

  if (!parsed.success) {
    return fail("Invalid email outbox action", 400, parsed.error.flatten());
  }

  const { id } = await context.params;
  const { supabase } = admin.context;

  if (parsed.data.action === "skip") {
    const { data, error } = await supabase
      .from("email_outbox")
      .update({
        status: "skipped",
        error_message: "Skipped by admin",
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error || !data) {
      return fail("Unable to skip email entry", 500, error?.message);
    }

    return ok(data);
  }

  const { data: entry, error } = await supabase
    .from("email_outbox")
    .select("id, to_email, subject, html_body")
    .eq("id", id)
    .single();

  if (error || !entry) {
    return fail("Email outbox entry not found", 404, error?.message);
  }

  await dispatchEmailOutboxEntry(supabase, entry);

  const { data: refreshed, error: refreshError } = await supabase
    .from("email_outbox")
    .select("*")
    .eq("id", id)
    .single();

  if (refreshError || !refreshed) {
    return fail("Unable to reload email entry", 500, refreshError?.message);
  }

  return ok(refreshed);
}
