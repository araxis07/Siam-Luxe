import { fail, ok } from "@/lib/server/http";
import { getOperationalSnapshot, getRuntimeStatus } from "@/lib/server/ops-status";
import { requireAdmin } from "@/lib/server/admin";

export async function GET() {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return admin.response;
  }

  try {
    const operations = await getOperationalSnapshot(admin.context.supabase);

    return ok({
      runtime: getRuntimeStatus(),
      operations,
    });
  } catch (error) {
    return fail("Unable to load system status", 500, error instanceof Error ? error.message : null);
  }
}
