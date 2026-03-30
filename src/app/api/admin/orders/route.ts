import { fail, ok } from "@/lib/server/http";
import { requireAdmin } from "@/lib/server/admin";

export async function GET() {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return admin.response;
  }

  const { supabase } = admin.context;
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, code, branch_id, service_mode, status, payment_status, payment_method, total, created_at, user_id, contact_name, phone, cancel_reason, staff_note, kitchen_note, dispatch_note, refunded_amount, order_items(id, dish_id, dish_name, quantity, unit_price), order_status_history(id, status, occurred_at)",
    )
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return fail("Unable to load admin orders", 500, error.message);
  }

  return ok(data ?? []);
}
