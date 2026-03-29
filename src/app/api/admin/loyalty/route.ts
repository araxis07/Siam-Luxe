import { fail, ok } from "@/lib/server/http";
import { requireAdmin } from "@/lib/server/admin";

export async function GET() {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return admin.response;
  }

  const { supabase } = admin.context;
  const [accountsResult, walletResult] = await Promise.all([
    supabase
      .from("loyalty_accounts")
      .select("user_id, current_points, lifetime_points, updated_at")
      .order("updated_at", { ascending: false })
      .limit(50),
    supabase
      .from("gift_wallet_entries")
      .select("id, user_id, title, amount, expires_at, code, created_at")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  if (accountsResult.error) {
    return fail("Unable to load loyalty accounts", 500, accountsResult.error.message);
  }

  if (walletResult.error) {
    return fail("Unable to load wallet credits", 500, walletResult.error.message);
  }

  const profileIds = [...new Set((accountsResult.data ?? []).map((item) => item.user_id))];
  const { data: profiles } = profileIds.length
    ? await supabase.from("profiles").select("id, full_name, email").in("id", profileIds)
    : { data: [] as Array<{ id: string; full_name: string; email: string | null }> };

  const profileMap = new Map((profiles ?? []).map((item) => [item.id, item]));

  return ok({
    accounts: (accountsResult.data ?? []).map((item) => ({
      ...item,
      profile: profileMap.get(item.user_id) ?? null,
    })),
    walletEntries: walletResult.data ?? [],
  });
}
