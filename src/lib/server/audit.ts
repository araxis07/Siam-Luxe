import type { AdminContext } from "@/lib/server/admin";
import type { ServerSupabase } from "@/lib/server/shared";

function isMissingAuditLogsTable(error: { message?: string } | null) {
  return typeof error?.message === "string" && error.message.includes("public.audit_logs");
}

export async function recordAuditLog(
  supabase: ServerSupabase,
  payload: {
    actorUserId?: string | null;
    actorEmail?: string | null;
    actorRole?: "customer" | "staff" | "admin" | null;
    scope: string;
    action: string;
    targetTable: string;
    targetId: string;
    summary?: string;
    metadata?: Record<string, unknown>;
  },
) {
  const { error } = await supabase.from("audit_logs").insert({
    actor_user_id: payload.actorUserId ?? null,
    actor_email: payload.actorEmail ?? null,
    actor_role: payload.actorRole ?? null,
    scope: payload.scope,
    action: payload.action,
    target_table: payload.targetTable,
    target_id: payload.targetId,
    summary: payload.summary ?? "",
    metadata: payload.metadata ?? {},
  });

  if (error && !isMissingAuditLogsTable(error)) {
    throw new Error(error.message);
  }
}

export async function recordAdminAudit(
  admin: AdminContext,
  payload: Omit<Parameters<typeof recordAuditLog>[1], "actorUserId" | "actorEmail" | "actorRole">,
) {
  await recordAuditLog(admin.supabase, {
    actorUserId: admin.user.id,
    actorEmail: admin.profile.email,
    actorRole: admin.profile.role,
    ...payload,
  });
}
