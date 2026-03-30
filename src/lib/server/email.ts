import type { ServerSupabase } from "@/lib/server/shared";

const MAX_EMAIL_ATTEMPTS = 5;

function getEmailEnv() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    return null;
  }

  return { apiKey, from };
}

function computeNextAttemptIso(attemptCount: number) {
  if (attemptCount >= MAX_EMAIL_ATTEMPTS) {
    return null;
  }

  const delayMinutes = Math.min(60, 5 * 2 ** Math.max(0, attemptCount - 1));
  return new Date(Date.now() + delayMinutes * 60_000).toISOString();
}

export async function enqueueEmailOutbox(
  supabase: ServerSupabase,
  payload: {
    userId?: string | null;
    toEmail: string;
    subject: string;
    htmlBody: string;
    templateKey: string;
  },
) {
  const { data, error } = await supabase
    .from("email_outbox")
    .insert({
      user_id: payload.userId ?? null,
      to_email: payload.toEmail,
      subject: payload.subject,
      html_body: payload.htmlBody,
      template_key: payload.templateKey,
      status: "queued",
      provider: "resend",
      attempt_count: 0,
      next_attempt_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function dispatchEmailOutboxEntry(
  supabase: ServerSupabase,
  entry: {
    id: string;
    to_email: string;
    subject: string;
    html_body: string;
    attempt_count?: number | null;
  },
) {
  const env = getEmailEnv();
  const attemptedAt = new Date().toISOString();
  const nextAttemptCount = Number(entry.attempt_count ?? 0) + 1;

  if (!env) {
    await supabase
      .from("email_outbox")
      .update({
        status: "skipped",
        error_message: "Resend is not configured",
        attempt_count: nextAttemptCount,
        last_attempt_at: attemptedAt,
        next_attempt_at: null,
      })
      .eq("id", entry.id);
    return {
      status: "skipped" as const,
      providerMessageId: null,
      attemptCount: nextAttemptCount,
      nextAttemptAt: null,
    };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.from,
        to: [entry.to_email],
        subject: entry.subject,
        html: entry.html_body,
      }),
    });

    const payload = (await response.json()) as { id?: string; message?: string };

    if (!response.ok) {
      const nextAttemptAt = computeNextAttemptIso(nextAttemptCount);

      await supabase
        .from("email_outbox")
        .update({
          status: "failed",
          error_message: payload.message ?? "Email dispatch failed",
          attempt_count: nextAttemptCount,
          last_attempt_at: attemptedAt,
          next_attempt_at: nextAttemptAt,
        })
        .eq("id", entry.id);
      return {
        status: "failed" as const,
        providerMessageId: null,
        attemptCount: nextAttemptCount,
        nextAttemptAt,
      };
    }

    await supabase
      .from("email_outbox")
      .update({
        status: "sent",
        provider_message_id: payload.id ?? null,
        sent_at: new Date().toISOString(),
        error_message: null,
        attempt_count: nextAttemptCount,
        last_attempt_at: attemptedAt,
        next_attempt_at: null,
      })
      .eq("id", entry.id);

    return {
      status: "sent" as const,
      providerMessageId: payload.id ?? null,
      attemptCount: nextAttemptCount,
      nextAttemptAt: null,
    };
  } catch (error) {
    const nextAttemptAt = computeNextAttemptIso(nextAttemptCount);

    await supabase
      .from("email_outbox")
      .update({
        status: "failed",
        error_message: error instanceof Error ? error.message : "Email dispatch failed",
        attempt_count: nextAttemptCount,
        last_attempt_at: attemptedAt,
        next_attempt_at: nextAttemptAt,
      })
      .eq("id", entry.id);
    return {
      status: "failed" as const,
      providerMessageId: null,
      attemptCount: nextAttemptCount,
      nextAttemptAt,
    };
  }
}

export async function enqueueAndDispatchEmail(
  supabase: ServerSupabase,
  payload: Parameters<typeof enqueueEmailOutbox>[1],
) {
  const entry = await enqueueEmailOutbox(supabase, payload);
  await dispatchEmailOutboxEntry(supabase, entry);
  return entry;
}
