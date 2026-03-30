alter table public.orders add column if not exists cancel_reason text not null default '';
alter table public.orders add column if not exists staff_note text not null default '';
alter table public.orders add column if not exists kitchen_note text not null default '';
alter table public.orders add column if not exists dispatch_note text not null default '';
alter table public.orders add column if not exists refunded_amount numeric(10,2) not null default 0;

alter table public.reservations add column if not exists internal_note text not null default '';
alter table public.reservations add column if not exists table_assignment text not null default '';
alter table public.reservations add column if not exists reminder_sent_at timestamptz;
alter table public.reservations add column if not exists waitlist_promoted_at timestamptz;
alter table public.reservations add column if not exists checked_in_at timestamptz;
alter table public.reservations add column if not exists no_show_at timestamptz;

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users (id) on delete set null,
  actor_email text,
  actor_role public.app_role,
  scope text not null,
  action text not null,
  target_table text not null,
  target_id text not null,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.menu_categories (
  id text primary key,
  label jsonb not null default '{}'::jsonb,
  description jsonb not null default '{}'::jsonb,
  icon text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.menu_regions (
  id text primary key,
  label jsonb not null default '{}'::jsonb,
  description jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.menu_toppings (
  id text primary key,
  label jsonb not null default '{}'::jsonb,
  price numeric(10,2) not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.menu_dishes (
  id text primary key,
  category_id text not null references public.menu_categories (id),
  region_id text not null references public.menu_regions (id),
  image text not null,
  name jsonb not null default '{}'::jsonb,
  description jsonb not null default '{}'::jsonb,
  price numeric(10,2) not null default 0,
  rating numeric(3,2) not null default 0,
  prep_minutes integer not null default 0,
  base_spice integer not null default 0,
  featured boolean not null default false,
  accent_class text not null default '',
  available_toppings jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_orders_status_payment on public.orders (status, payment_status);
create index if not exists idx_reservations_status_date on public.reservations (status, reservation_date);
create index if not exists idx_audit_logs_created_at on public.audit_logs (created_at desc);
create index if not exists idx_audit_logs_target on public.audit_logs (target_table, target_id);
create index if not exists idx_menu_dishes_category on public.menu_dishes (category_id);
create index if not exists idx_menu_dishes_region on public.menu_dishes (region_id);
create index if not exists idx_menu_dishes_active on public.menu_dishes (is_active);

drop trigger if exists set_menu_categories_updated_at on public.menu_categories;
create trigger set_menu_categories_updated_at before update on public.menu_categories for each row execute procedure public.set_updated_at();
drop trigger if exists set_menu_regions_updated_at on public.menu_regions;
create trigger set_menu_regions_updated_at before update on public.menu_regions for each row execute procedure public.set_updated_at();
drop trigger if exists set_menu_toppings_updated_at on public.menu_toppings;
create trigger set_menu_toppings_updated_at before update on public.menu_toppings for each row execute procedure public.set_updated_at();
drop trigger if exists set_menu_dishes_updated_at on public.menu_dishes;
create trigger set_menu_dishes_updated_at before update on public.menu_dishes for each row execute procedure public.set_updated_at();

alter table public.audit_logs enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_regions enable row level security;
alter table public.menu_toppings enable row level security;
alter table public.menu_dishes enable row level security;

drop policy if exists "Admins manage audit logs" on public.audit_logs;
create policy "Admins manage audit logs"
on public.audit_logs
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read menu categories" on public.menu_categories;
create policy "Public can read menu categories"
on public.menu_categories
for select
to anon, authenticated
using (true);

drop policy if exists "Admins manage menu categories" on public.menu_categories;
create policy "Admins manage menu categories"
on public.menu_categories
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read menu regions" on public.menu_regions;
create policy "Public can read menu regions"
on public.menu_regions
for select
to anon, authenticated
using (true);

drop policy if exists "Admins manage menu regions" on public.menu_regions;
create policy "Admins manage menu regions"
on public.menu_regions
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read menu toppings" on public.menu_toppings;
create policy "Public can read menu toppings"
on public.menu_toppings
for select
to anon, authenticated
using (true);

drop policy if exists "Admins manage menu toppings" on public.menu_toppings;
create policy "Admins manage menu toppings"
on public.menu_toppings
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read menu dishes" on public.menu_dishes;
create policy "Public can read menu dishes"
on public.menu_dishes
for select
to anon, authenticated
using (true);

drop policy if exists "Admins manage menu dishes" on public.menu_dishes;
create policy "Admins manage menu dishes"
on public.menu_dishes
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
