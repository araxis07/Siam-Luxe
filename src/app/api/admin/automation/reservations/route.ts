import { z } from "zod";

import { requireAdmin } from "@/lib/server/admin";
import { recordAdminAudit } from "@/lib/server/audit";
import { getReservationAutomationSnapshot, runReservationAutomation } from "@/lib/server/automation";
import { fail, ok } from "@/lib/server/http";
import { readJsonBody } from "@/lib/server/request-body";

const automationSchema = z.object({
  limit: z.number().int().positive().max(50).optional(),
});

export async function GET() {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return admin.response;
  }

  try {
    return ok(await getReservationAutomationSnapshot(admin.context.supabase));
  } catch (error) {
    return fail("Unable to load reservation automation status", 500, error instanceof Error ? error.message : null);
  }
}

export async function POST(request: Request) {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return admin.response;
  }

  const body = await readJsonBody(request);
  const parsed = automationSchema.safeParse(body.ok ? body.data : {});

  if (!parsed.success) {
    return fail("Invalid reservation automation request", 400, parsed.error.flatten());
  }

  try {
    const summary = await runReservationAutomation(admin.context.supabase, parsed.data);
    await recordAdminAudit(admin.context, {
      scope: "admin.reservations",
      action: "automation-run",
      targetTable: "reservations",
      targetId: "batch",
      summary: `Promoted ${summary.waitlistPromoted}, reminded ${summary.remindersSent}, marked ${summary.noShowsMarked}`,
      metadata: summary,
    });
    return ok(summary);
  } catch (error) {
    return fail("Unable to run reservation automation", 500, error instanceof Error ? error.message : null);
  }
}
