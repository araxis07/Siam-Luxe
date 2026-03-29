import type { BranchId } from "@/lib/experience";
import { resolveReservationStatusForCapacity } from "@/lib/reservation-capacity";
import type { ServerSupabase } from "@/lib/server/shared";

export async function resolveReservationStatus(
  supabase: ServerSupabase,
  {
    branchId,
    date,
    timeSlot,
    seating,
    guestCount,
    requestedStatus,
    excludeReservationId,
  }: {
    branchId: BranchId;
    date: string;
    timeSlot: string;
    seating: string;
    guestCount: number;
    requestedStatus: "confirmed" | "waitlist" | "cancelled";
    excludeReservationId?: string;
  },
) {
  let query = supabase
    .from("reservations")
    .select("id, seating, guest_count, status")
    .eq("branch_id", branchId)
    .eq("reservation_date", date)
    .eq("time_slot", timeSlot);

  if (excludeReservationId) {
    query = query.neq("id", excludeReservationId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return resolveReservationStatusForCapacity({
    branchId,
    timeSlot,
    seating,
    guestCount,
    requestedStatus,
    reservations: (data ?? []).map((item) => ({
      id: item.id,
      seating: item.seating,
      guestCount: item.guest_count,
      status: item.status,
    })),
  });
}
