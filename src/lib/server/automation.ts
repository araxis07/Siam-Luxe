import { dispatchEmailOutboxEntry, enqueueAndDispatchEmail } from "@/lib/server/email";
import { resolveReservationStatus } from "@/lib/server/reservation-service";
import type { ServerSupabase } from "@/lib/server/shared";

function bangkokDate(value: Date) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(value);

  const year = parts.find((part) => part.type === "year")?.value ?? "0000";
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  const day = parts.find((part) => part.type === "day")?.value ?? "01";

  return `${year}-${month}-${day}`;
}

function addDays(value: Date, days: number) {
  const next = new Date(value);
  next.setDate(next.getDate() + days);
  return next;
}

export async function dispatchQueuedEmailsBatch(
  supabase: ServerSupabase,
  payload?: {
    limit?: number;
  },
) {
  const limit = Math.max(1, Math.min(payload?.limit ?? 25, 100));
  const nowIso = new Date().toISOString();
  const { data: entries, error } = await supabase
    .from("email_outbox")
    .select("id, to_email, subject, html_body, attempt_count")
    .in("status", ["queued", "failed"])
    .lte("next_attempt_at", nowIso)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  const summary = {
    processed: 0,
    sent: 0,
    failed: 0,
    skipped: 0,
    retriableFailures: 0,
    remainingQueued: 0,
  };

  for (const entry of entries ?? []) {
    const result = await dispatchEmailOutboxEntry(supabase, entry);
    summary.processed += 1;

    if (result.status === "sent") {
      summary.sent += 1;
    } else if (result.status === "skipped") {
      summary.skipped += 1;
    } else {
      summary.failed += 1;

      if (result.nextAttemptAt) {
        summary.retriableFailures += 1;
      }
    }
  }

  const { count } = await supabase
    .from("email_outbox")
    .select("id", { count: "exact", head: true })
    .eq("status", "queued");

  summary.remainingQueued = count ?? 0;
  return summary;
}

export async function getReservationAutomationSnapshot(supabase: ServerSupabase) {
  const today = bangkokDate(new Date());
  const tomorrow = bangkokDate(addDays(new Date(), 1));

  const [waitlist, reminders, noShows] = await Promise.all([
    supabase.from("reservations").select("id", { count: "exact", head: true }).eq("status", "waitlist"),
    supabase
      .from("reservations")
      .select("id", { count: "exact", head: true })
      .eq("status", "confirmed")
      .is("reminder_sent_at", null)
      .gte("reservation_date", today)
      .lte("reservation_date", tomorrow),
    supabase
      .from("reservations")
      .select("id", { count: "exact", head: true })
      .eq("status", "confirmed")
      .is("no_show_at", null)
      .lt("reservation_date", today),
  ]);

  return {
    waitlistPending: waitlist.count ?? 0,
    remindersPending: reminders.count ?? 0,
    noShowsPending: noShows.count ?? 0,
  };
}

export async function runReservationAutomation(
  supabase: ServerSupabase,
  payload?: {
    limit?: number;
  },
) {
  const limit = Math.max(1, Math.min(payload?.limit ?? 20, 50));
  const today = bangkokDate(new Date());
  const tomorrow = bangkokDate(addDays(new Date(), 1));
  const nowIso = new Date().toISOString();
  const summary = {
    remindersSent: 0,
    waitlistPromoted: 0,
    noShowsMarked: 0,
  };

  const { data: reminderCandidates, error: reminderError } = await supabase
    .from("reservations")
    .select("id, user_id, branch_id, reservation_date, time_slot, contact_name")
    .eq("status", "confirmed")
    .is("reminder_sent_at", null)
    .gte("reservation_date", today)
    .lte("reservation_date", tomorrow)
    .order("reservation_date", { ascending: true })
    .limit(limit);

  if (reminderError) {
    throw new Error(reminderError.message);
  }

  for (const reservation of reminderCandidates ?? []) {
    if (!reservation.user_id) {
      continue;
    }

    const [{ data: profile }, { data: preferences }] = await Promise.all([
      supabase.from("profiles").select("email").eq("id", reservation.user_id).maybeSingle(),
      supabase
        .from("notification_preferences")
        .select("reservation_reminders")
        .eq("user_id", reservation.user_id)
        .maybeSingle(),
    ]);

    if (preferences && !preferences.reservation_reminders) {
      continue;
    }

    await supabase
      .from("reservations")
      .update({
        reminder_sent_at: nowIso,
      })
      .eq("id", reservation.id);

    await supabase.from("notifications").insert({
      user_id: reservation.user_id,
      title: `Reservation · ${reservation.branch_id}`,
      body: `${reservation.reservation_date} · ${reservation.time_slot}`,
      kind: "reservation-reminder",
      link: "/account",
    });

    if (profile?.email) {
      await enqueueAndDispatchEmail(supabase, {
        userId: reservation.user_id,
        toEmail: profile.email,
        subject: "Siam Lux reservation reminder",
        templateKey: "reservation-reminder",
        htmlBody: `<p>Your table at ${reservation.branch_id} is scheduled for ${reservation.reservation_date} at ${reservation.time_slot}.</p>`,
      });
    }

    summary.remindersSent += 1;
  }

  const { data: waitlistEntries, error: waitlistError } = await supabase
    .from("reservations")
    .select("*")
    .eq("status", "waitlist")
    .order("created_at", { ascending: true })
    .limit(limit);

  if (waitlistError) {
    throw new Error(waitlistError.message);
  }

  for (const reservation of waitlistEntries ?? []) {
    const nextStatus = await resolveReservationStatus(supabase, {
      branchId: reservation.branch_id,
      date: reservation.reservation_date,
      timeSlot: reservation.time_slot,
      seating: reservation.seating,
      guestCount: reservation.guest_count,
      requestedStatus: "confirmed",
      excludeReservationId: reservation.id,
    });

    if (nextStatus !== "confirmed") {
      continue;
    }

    await supabase
      .from("reservations")
      .update({
        status: "confirmed",
        waitlist_promoted_at: nowIso,
      })
      .eq("id", reservation.id);

    if (reservation.user_id) {
      await supabase.from("notifications").insert({
        user_id: reservation.user_id,
        title: `Reservation confirmed · ${reservation.branch_id}`,
        body: `${reservation.reservation_date} · ${reservation.time_slot}`,
        kind: "reservation-promoted",
        link: "/account",
      });

      const { data: profile } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", reservation.user_id)
        .maybeSingle();

      if (profile?.email) {
        await enqueueAndDispatchEmail(supabase, {
          userId: reservation.user_id,
          toEmail: profile.email,
          subject: "Siam Lux waitlist promoted",
          templateKey: "reservation-waitlist-promoted",
          htmlBody: `<p>Your waitlist request at ${reservation.branch_id} on ${reservation.reservation_date} at ${reservation.time_slot} is now confirmed.</p>`,
        });
      }
    }

    summary.waitlistPromoted += 1;
  }

  const { data: staleReservations, error: staleError } = await supabase
    .from("reservations")
    .select("id, internal_note")
    .eq("status", "confirmed")
    .is("no_show_at", null)
    .lt("reservation_date", today)
    .limit(limit);

  if (staleError) {
    throw new Error(staleError.message);
  }

  for (const reservation of staleReservations ?? []) {
    const note = reservation.internal_note?.trim().length
      ? `${reservation.internal_note}\n[Auto] No-show marked ${today}`
      : `[Auto] No-show marked ${today}`;

    await supabase
      .from("reservations")
      .update({
        no_show_at: nowIso,
        internal_note: note,
      })
      .eq("id", reservation.id);

    summary.noShowsMarked += 1;
  }

  return summary;
}
