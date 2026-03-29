import { z } from "zod";

import { enqueueAndDispatchEmail } from "@/lib/server/email";
import { fail, ok } from "@/lib/server/http";
import { getCurrentUser } from "@/lib/server/auth";
import { readJsonBody } from "@/lib/server/request-body";
import { resolveReservationStatus } from "@/lib/server/reservation-service";

const reservationSchema = z.object({
  branchId: z.enum(["bangrak", "sukhumvit", "chiangmai"]),
  guestCount: z.number().int().positive(),
  date: z.string().min(1),
  timeSlot: z.string().min(1),
  seating: z.string().min(1),
  occasion: z.string().min(1),
  contactName: z.string().min(2),
  phone: z.string().min(7),
  notes: z.string().optional().default(""),
  status: z.enum(["confirmed", "waitlist"]).default("confirmed"),
  locale: z.enum(["th", "en", "ja", "zh", "ko"]).default("th"),
});

export async function GET() {
  const { supabase, user } = await getCurrentUser();

  if (!user) {
    return ok([]);
  }

  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return fail("Unable to load reservations", 500, error.message);
  }

  return ok(
    (data ?? []).map((item) => ({
      id: item.id,
      branchId: item.branch_id,
      guestCount: item.guest_count,
      date: item.reservation_date,
      timeSlot: item.time_slot,
      seating: item.seating,
      occasion: item.occasion,
      contactName: item.contact_name,
      phone: item.phone,
      notes: item.notes,
      status: item.status,
    })),
  );
}

export async function POST(request: Request) {
  const { supabase, user } = await getCurrentUser();
  const body = await readJsonBody(request);

  if (!body.ok) {
    return fail("Invalid reservation payload", 400);
  }

  const parsed = reservationSchema.safeParse(body.data);

  if (!parsed.success) {
    return fail("Invalid reservation payload", 400, parsed.error.flatten());
  }

  const payload = parsed.data;
  let finalStatus;

  try {
    finalStatus = await resolveReservationStatus(supabase, {
      branchId: payload.branchId,
      date: payload.date,
      timeSlot: payload.timeSlot,
      seating: payload.seating,
      guestCount: payload.guestCount,
      requestedStatus: payload.status,
    });
  } catch (error) {
    return fail("Unable to resolve reservation availability", 500, error instanceof Error ? error.message : null);
  }

  const { data, error } = await supabase
    .from("reservations")
    .insert({
      user_id: user?.id ?? null,
      branch_id: payload.branchId,
      guest_count: payload.guestCount,
      reservation_date: payload.date,
      time_slot: payload.timeSlot,
      seating: payload.seating,
      occasion: payload.occasion,
      contact_name: payload.contactName,
      phone: payload.phone,
      notes: payload.notes,
      status: finalStatus,
      locale: payload.locale,
    })
    .select("*")
    .single();

  if (error) {
    return fail("Unable to create reservation", 500, error.message);
  }

  if (user?.id) {
    await supabase.from("notifications").insert({
      user_id: user.id,
      title: `${payload.branchId} · ${payload.date}`,
      body: `${payload.branchId} · ${payload.date} · ${payload.timeSlot}`,
      kind: finalStatus === "waitlist" ? "reservation-waitlist" : "reservation-created",
      link: "/reservation",
    });

    if (user.email) {
      await enqueueAndDispatchEmail(supabase, {
        userId: user.id,
        toEmail: user.email,
        subject: finalStatus === "waitlist" ? "Siam Lux waitlist confirmation" : "Siam Lux reservation confirmation",
        templateKey: finalStatus === "waitlist" ? "reservation-waitlist" : "reservation-confirmed",
        htmlBody: `<p>Your reservation for ${payload.branchId} on ${payload.date} at ${payload.timeSlot} has been ${finalStatus === "waitlist" ? "placed on the waitlist" : "captured"}.</p>`,
      });
    }
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
