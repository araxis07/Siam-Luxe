import { fail, ok } from "@/lib/server/http";
import { requireAdmin } from "@/lib/server/admin";

export async function GET() {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return admin.response;
  }

  const { supabase } = admin.context;
  const [profilesResult, loyaltyResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, email, full_name, phone, preferred_locale, role, notes, payment_method, created_at, updated_at")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase.from("loyalty_accounts").select("user_id, current_points"),
  ]);

  if (profilesResult.error) {
    return fail("Unable to load team accounts", 500, profilesResult.error.message);
  }

  if (loyaltyResult.error) {
    return fail("Unable to load loyalty balances", 500, loyaltyResult.error.message);
  }

  const loyaltyMap = new Map(
    (loyaltyResult.data ?? []).map((item) => [item.user_id, Number(item.current_points ?? 0)]),
  );

  return ok(
    (profilesResult.data ?? []).map((profile) => ({
      ...profile,
      current_points: loyaltyMap.get(profile.id) ?? 0,
    })),
  );
}
