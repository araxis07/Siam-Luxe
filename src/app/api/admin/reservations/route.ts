import { fail, ok } from "@/lib/server/http";
import { requireAdmin } from "@/lib/server/admin";

export async function GET() {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return admin.response;
  }

  const { supabase } = admin.context;
  const { data, error } = await supabase
    .from("reservations")
    .select("id, user_id, branch_id, reservation_date, time_slot, seating, occasion, contact_name, phone, guest_count, status, notes, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return fail("Unable to load admin reservations", 500, error.message);
  }

  return ok(data ?? []);
}
