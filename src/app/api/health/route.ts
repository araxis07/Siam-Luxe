import { fail, ok } from "@/lib/server/http";
import { getOperationalSnapshot, getRuntimeStatus } from "@/lib/server/ops-status";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const runtime = getRuntimeStatus();
  const admin = createAdminClient();

  if (!admin) {
    return ok({
      status: runtime.ready ? "degraded" : "booting",
      runtime,
    });
  }

  try {
    const operations = await getOperationalSnapshot(admin);

    return ok({
      status: runtime.ready ? "ready" : "booting",
      runtime,
      operations,
    });
  } catch (error) {
    return fail("Unable to collect operational health", 500, error instanceof Error ? error.message : null);
  }
}
