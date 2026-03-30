import { getReservationAutomationSnapshot, runReservationAutomation } from "@/lib/server/automation";
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
    const snapshot = await getReservationAutomationSnapshot(supabase);
    const summary = await runReservationAutomation(supabase);

    await recordAuditLog(supabase, {
      scope: "internal.cron",
      action: "reservation-automation",
      targetTable: "reservations",
      targetId: "batch",
      summary: `Cron promoted ${summary.waitlistPromoted}, reminded ${summary.remindersSent}, marked ${summary.noShowsMarked}`,
      metadata: {
        before: snapshot,
        after: summary,
      },
    });

    return ok({
      snapshot,
      summary,
    });
  } catch (error) {
    return fail("Unable to run reservation automation", 500, error instanceof Error ? error.message : null);
  }
}
