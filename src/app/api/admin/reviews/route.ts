import { fail, ok } from "@/lib/server/http";
import { requireAdmin } from "@/lib/server/admin";

export async function GET() {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return admin.response;
  }

  const { supabase } = admin.context;
  const { data, error } = await supabase
    .from("reviews")
    .select("id, dish_id, guest, region, rating, body, locale, is_published, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return fail("Unable to load admin reviews", 500, error.message);
  }

  return ok(data ?? []);
}
