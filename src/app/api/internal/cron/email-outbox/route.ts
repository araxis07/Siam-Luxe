import { dispatchQueuedEmailsBatch } from "@/lib/server/automation";
import { recordAuditLog } from "@/lib/server/audit";
import { fail, ok } from "@/lib/server/http";
import { matchesSecret } from "@/lib/server/security";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  if (!matchesSecret(request.headers.get("x-internal-cron-secret"), process.env.INTERNAL_CRON_SECRET)) {
    return fail("Unauthorized", 401);
  }

  const supabase = createAdminClient();

  if (!supabase) {
    return fail("Supabase service role is not configured", 500);
  }

  try {
    const summary = await dispatchQueuedEmailsBatch(supabase);
    await recordAuditLog(supabase, {
      scope: "internal.cron",
      action: "dispatch-email-outbox",
      targetTable: "email_outbox",
      targetId: "batch",
      summary: `Cron processed ${summary.processed} queued emails`,
      metadata: summary,
    });
    return ok(summary);
  } catch (error) {
    return fail("Unable to dispatch queued emails", 500, error instanceof Error ? error.message : null);
  }
}
