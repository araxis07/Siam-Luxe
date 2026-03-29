import { z } from "zod";

import { enqueueAndDispatchEmail } from "@/lib/server/email";
import { fail, ok } from "@/lib/server/http";
import { getCurrentUser } from "@/lib/server/auth";
import { resolveReservationStatus } from "@/lib/server/reservation-service";

const reservationUpdateSchema = z.object({
  timeSlot: z.string().min(1).optional(),
  status: z.enum(["confirmed", "waitlist", "cancelled"]).optional(),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { supabase, user } = await getCurrentUser();

  if (!user) {
    return fail("Unauthorized", 401);
  }

  const { id } = await context.params;
  const parsed = reservationUpdateSchema.safeParse(await request.json());

  if (!parsed.success) {
    return fail("Invalid reservation update", 400, parsed.error.flatten());
  }

  const { data: currentReservation, error: currentError } = await supabase
    .from("reservations")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (currentError || !currentReservation) {
    return fail("Reservation not found", 404, currentError?.message);
  }

  let nextStatus = parsed.data.status ?? currentReservation.status;

  try {
    nextStatus = await resolveReservationStatus(supabase, {
      branchId: currentReservation.branch_id,
      date: currentReservation.reservation_date,
      timeSlot: parsed.data.timeSlot ?? currentReservation.time_slot,
      seating: currentReservation.seating,
      guestCount: currentReservation.guest_count,
      requestedStatus: nextStatus,
      excludeReservationId: id,
    });
  } catch (error) {
    return fail("Unable to update reservation availability", 500, error instanceof Error ? error.message : null);
  }

  const { data, error } = await supabase
    .from("reservations")
    .update({
      ...(parsed.data.timeSlot ? { time_slot: parsed.data.timeSlot } : {}),
      status: nextStatus,
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) {
    return fail("Unable to update reservation", 500, error.message);
  }

  await supabase.from("notifications").insert({
    user_id: user.id,
    title: `${data.branch_id} · ${data.reservation_date}`,
    body: `${data.branch_id} · ${data.reservation_date} · ${data.time_slot}`,
    kind: data.status === "cancelled" ? "reservation-cancelled" : data.status === "waitlist" ? "reservation-waitlist" : "reservation-updated",
    link: "/account",
  });

  if (user.email) {
    await enqueueAndDispatchEmail(supabase, {
      userId: user.id,
      toEmail: user.email,
      subject: data.status === "cancelled" ? "Siam Lux reservation cancelled" : "Siam Lux reservation updated",
      templateKey: data.status === "cancelled" ? "reservation-cancelled" : "reservation-updated",
      htmlBody: `<p>Your reservation for ${data.branch_id} on ${data.reservation_date} at ${data.time_slot} is now ${data.status}.</p>`,
    });
  }

  return ok({
    id: data.id,
    branchId: data.branch_id,
    guestCount: data.guest_count,
    date: data.reservation_date,
    timeSlot: data.time_slot,
    seating: data.seating,
    occasion: data.occasion,
    contactName: data.contact_name,
    phone: data.phone,
    notes: data.notes,
    status: data.status,
  });
}
