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

  const [orders, reservations, reviews, orderCount, reservationCount, reviewCount] = await Promise.all([
    supabase.from("orders").select("id, code, branch_id, status, created_at, total").order("created_at", { ascending: false }).limit(8),
    supabase.from("reservations").select("id, branch_id, reservation_date, time_slot, status, contact_name").order("created_at", { ascending: false }).limit(8),
    supabase.from("reviews").select("id, dish_id, guest, rating, created_at").order("created_at", { ascending: false }).limit(8),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("reservations").select("id", { count: "exact", head: true }),
    supabase.from("reviews").select("id", { count: "exact", head: true }),
  ]);

  return ok({
    counts: {
      orders: orderCount.count ?? 0,
      reservations: reservationCount.count ?? 0,
      reviews: reviewCount.count ?? 0,
    },
    latestOrders: orders.data ?? [],
    latestReservations: reservations.data ?? [],
    latestReviews: reviews.data ?? [],
  });
}
