import { fail, ok } from "@/lib/server/http";
import { getCurrentUser } from "@/lib/server/auth";

export async function GET() {
  const { supabase, user } = await getCurrentUser();

  if (!user) {
    return fail("Unauthorized", 401);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !["admin", "staff"].includes(String(profile.role))) {
    return fail("Forbidden", 403);
  }

  const [orders, reservations, reviews] = await Promise.all([
    supabase.from("orders").select("id, code, branch_id, status, created_at, total").order("created_at", { ascending: false }).limit(8),
    supabase.from("reservations").select("id, branch_id, reservation_date, time_slot, status, contact_name").order("created_at", { ascending: false }).limit(8),
    supabase.from("reviews").select("id, dish_id, guest, rating, created_at").order("created_at", { ascending: false }).limit(8),
  ]);

  return ok({
    counts: {
      orders: orders.data?.length ?? 0,
      reservations: reservations.data?.length ?? 0,
      reviews: reviews.data?.length ?? 0,
    },
    latestOrders: orders.data ?? [],
    latestReservations: reservations.data ?? [],
    latestReviews: reviews.data ?? [],
  });
}
