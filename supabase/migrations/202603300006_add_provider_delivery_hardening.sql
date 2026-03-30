alter table public.email_outbox
  add column if not exists attempt_count integer not null default 0,
  add column if not exists last_attempt_at timestamptz,
  add column if not exists next_attempt_at timestamptz default timezone('utc', now());

alter table public.payment_attempts
  add column if not exists provider_session_id text,
  add column if not exists checkout_url text,
  add column if not exists failure_reason text,
  add column if not exists last_status_at timestamptz;

create index if not exists idx_email_outbox_next_attempt_at
  on public.email_outbox (next_attempt_at);

create index if not exists idx_email_outbox_attempt_count
  on public.email_outbox (attempt_count);

create index if not exists idx_payment_attempts_provider_session_id
  on public.payment_attempts (provider_session_id);
