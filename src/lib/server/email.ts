import type { ServerSupabase } from "@/lib/server/shared";

function getEmailEnv() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    return null;
  }

  return { apiKey, from };
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
  },
) {
  const env = getEmailEnv();

  if (!env) {
    await supabase
      .from("email_outbox")
      .update({
        status: "skipped",
        error_message: "Resend is not configured",
      })
      .eq("id", entry.id);
    return entry;
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
      await supabase
        .from("email_outbox")
        .update({
          status: "failed",
          error_message: payload.message ?? "Email dispatch failed",
        })
        .eq("id", entry.id);
      return null;
    }

    await supabase
      .from("email_outbox")
      .update({
        status: "sent",
        provider_message_id: payload.id ?? null,
        sent_at: new Date().toISOString(),
        error_message: null,
      })
      .eq("id", entry.id);

    return payload;
  } catch (error) {
    await supabase
      .from("email_outbox")
      .update({
        status: "failed",
        error_message: error instanceof Error ? error.message : "Email dispatch failed",
      })
      .eq("id", entry.id);
    return null;
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
