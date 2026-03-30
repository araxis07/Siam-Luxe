import { z } from "zod";

import { requireAdmin } from "@/lib/server/admin";
import { recordAdminAudit } from "@/lib/server/audit";
import { dispatchQueuedEmailsBatch } from "@/lib/server/automation";
import { fail, ok } from "@/lib/server/http";
import { readJsonBody } from "@/lib/server/request-body";

const dispatchSchema = z.object({
  limit: z.number().int().positive().max(100).optional(),
});

export async function GET() {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return admin.response;
  }

  const { supabase } = admin.context;
  const [queued, sent, failed, skipped] = await Promise.all([
    supabase.from("email_outbox").select("id", { count: "exact", head: true }).eq("status", "queued"),
    supabase.from("email_outbox").select("id", { count: "exact", head: true }).eq("status", "sent"),
    supabase.from("email_outbox").select("id", { count: "exact", head: true }).eq("status", "failed"),
    supabase.from("email_outbox").select("id", { count: "exact", head: true }).eq("status", "skipped"),
  ]);

  const firstError = queued.error ?? sent.error ?? failed.error ?? skipped.error;

  if (firstError) {
    return fail("Unable to load email dispatch stats", 500, firstError.message);
  }

  return ok({
    queued: queued.count ?? 0,
    sent: sent.count ?? 0,
    failed: failed.count ?? 0,
    skipped: skipped.count ?? 0,
  });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return admin.response;
  }

  const body = await readJsonBody(request);
  const parsed = dispatchSchema.safeParse(body.ok ? body.data : {});

  if (!parsed.success) {
    return fail("Invalid email dispatch request", 400, parsed.error.flatten());
  }

  try {
    const summary = await dispatchQueuedEmailsBatch(admin.context.supabase, parsed.data);
    await recordAdminAudit(admin.context, {
      scope: "admin.email",
      action: "dispatch-batch",
      targetTable: "email_outbox",
      targetId: "batch",
      summary: `Processed ${summary.processed} queued emails`,
      metadata: summary,
    });
    return ok(summary);
  } catch (error) {
    return fail("Unable to dispatch queued emails", 500, error instanceof Error ? error.message : null);
  }
}
