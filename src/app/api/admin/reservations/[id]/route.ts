import { z } from "zod";

import { requireAdmin } from "@/lib/server/admin";
import { enqueueAndDispatchEmail } from "@/lib/server/email";
import { fail, ok } from "@/lib/server/http";
import { readJsonBody } from "@/lib/server/request-body";
import { resolveReservationStatus } from "@/lib/server/reservation-service";

const reservationAdminUpdateSchema = z.object({
  timeSlot: z.string().min(1).optional(),
  status: z.enum(["confirmed", "waitlist", "cancelled"]).optional(),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return admin.response;
  }

  const body = await readJsonBody(request);

  if (!body.ok) {
    return fail("Invalid admin reservation update", 400);
  }

  const parsed = reservationAdminUpdateSchema.safeParse(body.data);

  if (!parsed.success) {
    return fail("Invalid admin reservation update", 400, parsed.error.flatten());
  }

  const { id } = await context.params;
  const { supabase } = admin.context;
  const { data: currentReservation, error: currentError } = await supabase
    .from("reservations")
    .select("*")
    .eq("id", id)
    .single();

  if (currentError || !currentReservation) {
    return fail("Reservation not found", 404, currentError?.message);
  }

  const nextStatus = await resolveReservationStatus(supabase, {
    branchId: currentReservation.branch_id,
    date: currentReservation.reservation_date,
    timeSlot: parsed.data.timeSlot ?? currentReservation.time_slot,
    seating: currentReservation.seating,
    guestCount: currentReservation.guest_count,
    requestedStatus: parsed.data.status ?? currentReservation.status,
    excludeReservationId: id,
  });

  const { data, error } = await supabase
    .from("reservations")
    .update({
      ...(parsed.data.timeSlot ? { time_slot: parsed.data.timeSlot } : {}),
      status: nextStatus,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    return fail("Unable to update reservation", 500, error?.message);
  }

  if (data.user_id) {
    await supabase.from("notifications").insert({
      user_id: data.user_id,
      title: `${data.branch_id} · ${data.reservation_date}`,
      body: `${data.branch_id} · ${data.reservation_date} · ${data.time_slot} · ${data.status}`,
      kind: data.status === "cancelled" ? "reservation-cancelled" : "reservation-updated",
      link: "/account",
    });

    const { data: profile } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", data.user_id)
      .maybeSingle();

    if (profile?.email) {
      await enqueueAndDispatchEmail(supabase, {
        userId: data.user_id,
        toEmail: profile.email,
        subject: "Siam Lux reservation update",
        templateKey: "reservation-admin-updated",
        htmlBody: `<p>Your reservation for ${data.branch_id} on ${data.reservation_date} at ${data.time_slot} is now ${data.status}.</p>`,
      });
    }
  }

  return ok(data);
}
