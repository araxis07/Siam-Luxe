do $$
begin
  if not exists (select 1 from pg_type where typname = 'payment_attempt_status') then
    create type public.payment_attempt_status as enum ('pending', 'requires_action', 'paid', 'failed', 'cancelled');
  end if;
  if not exists (select 1 from pg_type where typname = 'email_delivery_status') then
    create type public.email_delivery_status as enum ('queued', 'sent', 'failed', 'skipped');
  end if;
end
$$;

alter table public.orders add column if not exists payment_reference text;
alter table public.orders add column if not exists paid_at timestamptz;

create table if not exists public.payment_attempts (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  provider text not null,
  method public.payment_method_kind not null,
  reference text not null unique,
  amount numeric(10,2) not null default 0,
  currency text not null default 'THB',
  status public.payment_attempt_status not null default 'pending',
  client_secret text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.email_outbox (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  to_email text not null,
  subject text not null,
  html_body text not null,
  template_key text not null default 'generic',
  status public.email_delivery_status not null default 'queued',
  provider text not null default 'resend',
  provider_message_id text,
  error_message text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  sent_at timestamptz
);

create index if not exists idx_payment_attempts_order_id on public.payment_attempts (order_id);
create index if not exists idx_payment_attempts_reference on public.payment_attempts (reference);
create index if not exists idx_email_outbox_status on public.email_outbox (status);
create index if not exists idx_email_outbox_user_id on public.email_outbox (user_id);

drop trigger if exists set_payment_attempts_updated_at on public.payment_attempts;
create trigger set_payment_attempts_updated_at before update on public.payment_attempts for each row execute procedure public.set_updated_at();
drop trigger if exists set_email_outbox_updated_at on public.email_outbox;
create trigger set_email_outbox_updated_at before update on public.email_outbox for each row execute procedure public.set_updated_at();

alter table public.payment_attempts enable row level security;
alter table public.email_outbox enable row level security;

drop policy if exists "Owners and admins read payment attempts" on public.payment_attempts;
create policy "Owners and admins read payment attempts"
on public.payment_attempts
for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.orders
    where orders.id = payment_attempts.order_id
      and orders.user_id = (select auth.uid())
  )
);

drop policy if exists "Owners and admins create payment attempts" on public.payment_attempts;
create policy "Owners and admins create payment attempts"
on public.payment_attempts
for insert
to authenticated
with check (
  public.is_admin()
  or exists (
    select 1
    from public.orders
    where orders.id = payment_attempts.order_id
      and orders.user_id = (select auth.uid())
  )
);

drop policy if exists "Admins manage payment attempts" on public.payment_attempts;
create policy "Admins manage payment attempts"
on public.payment_attempts
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins manage email outbox" on public.email_outbox;
drop policy if exists "Owners and admins manage email outbox" on public.email_outbox;
create policy "Owners and admins manage email outbox"
on public.email_outbox
for all
to authenticated
using (public.is_admin() or (user_id is not null and (select auth.uid()) = user_id))
with check (public.is_admin() or (user_id is not null and (select auth.uid()) = user_id));
