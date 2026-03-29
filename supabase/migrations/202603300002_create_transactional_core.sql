do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('customer', 'staff', 'admin');
  end if;
  if not exists (select 1 from pg_type where typname = 'service_mode') then
    create type public.service_mode as enum ('delivery', 'pickup');
  end if;
  if not exists (select 1 from pg_type where typname = 'reservation_status') then
    create type public.reservation_status as enum ('confirmed', 'waitlist', 'cancelled');
  end if;
  if not exists (select 1 from pg_type where typname = 'order_status') then
    create type public.order_status as enum ('pending', 'confirmed', 'preparing', 'ready', 'dispatching', 'arriving', 'completed', 'cancelled');
  end if;
  if not exists (select 1 from pg_type where typname = 'payment_status') then
    create type public.payment_status as enum ('pending', 'paid', 'failed', 'refunded');
  end if;
  if not exists (select 1 from pg_type where typname = 'payment_method_kind') then
    create type public.payment_method_kind as enum ('cash', 'card', 'promptpay');
  end if;
  if not exists (select 1 from pg_type where typname = 'occasion_kind') then
    create type public.occasion_kind as enum ('casual', 'date', 'celebration', 'business', 'family');
  end if;
end
$$;

alter table public.profiles add column if not exists role public.app_role not null default 'customer';
alter table public.profiles add column if not exists notes text not null default '';
alter table public.profiles add column if not exists address_line text not null default '';
alter table public.profiles add column if not exists district text not null default '';
alter table public.profiles add column if not exists city text not null default 'Bangkok';
alter table public.profiles add column if not exists payment_method public.payment_method_kind not null default 'promptpay';

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'staff')
  );
$$;

create table if not exists public.branches (
  id text primary key,
  name text not null,
  neighborhood text not null,
  address text not null,
  hours text not null,
  phone text not null,
  eta_min_minutes integer not null default 20,
  eta_max_minutes integer not null default 45,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.promo_codes (
  code text primary key,
  title text not null,
  description text not null default '',
  minimum_subtotal numeric(10,2) not null default 0,
  kind text not null check (kind in ('percent', 'amount')),
  value numeric(10,2) not null,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  spice_level integer not null default 3,
  allergen_notes text not null default '',
  favorite_occasion public.occasion_kind not null default 'date',
  preferred_branch_id text not null default 'bangrak' references public.branches (id),
  preferred_service_mode public.service_mode not null default 'delivery',
  needs_receipt boolean not null default true,
  tax_invoice boolean not null default false,
  company_name text not null default '',
  tax_id text not null default '',
  invoice_email text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.notification_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  marketing boolean not null default true,
  order_updates boolean not null default true,
  reservation_reminders boolean not null default true,
  loyalty_digest boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.saved_addresses (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  label text not null,
  recipient text not null,
  phone text not null,
  address_line text not null,
  district text not null,
  city text not null default 'Bangkok',
  is_primary boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.saved_payment_methods (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  label text not null,
  kind public.payment_method_kind not null,
  last4 text,
  is_primary boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.favorite_dishes (
  user_id uuid not null references auth.users (id) on delete cascade,
  dish_id text not null,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, dish_id)
);

create table if not exists public.gift_wallet_entries (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  code text not null,
  title text not null,
  amount numeric(10,2) not null default 0,
  expires_at date not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.reward_redemptions (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  reward_id text not null,
  title text not null,
  points_used integer not null,
  wallet_amount numeric(10,2) not null default 0,
  redeemed_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  body text not null,
  kind text not null default 'info',
  link text,
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  dish_id text not null,
  guest text not null,
  region text not null,
  body text not null,
  rating integer not null check (rating between 1 and 5),
  locale text not null default 'th',
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  branch_id text not null references public.branches (id),
  guest_count integer not null check (guest_count > 0),
  reservation_date date not null,
  time_slot text not null,
  seating text not null,
  occasion text not null,
  contact_name text not null,
  phone text not null,
  notes text not null default '',
  status public.reservation_status not null default 'confirmed',
  locale text not null default 'th',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  user_id uuid references auth.users (id) on delete set null,
  branch_id text not null references public.branches (id),
  service_mode public.service_mode not null,
  status public.order_status not null default 'pending',
  payment_status public.payment_status not null default 'pending',
  payment_method public.payment_method_kind not null,
  promo_code text,
  subtotal numeric(10,2) not null default 0,
  discount numeric(10,2) not null default 0,
  discounted_subtotal numeric(10,2) not null default 0,
  delivery_fee numeric(10,2) not null default 0,
  service_fee numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  currency text not null default 'THB',
  delivery_time text not null default 'asap',
  contact_name text not null,
  phone text not null,
  address_line text not null,
  district text not null,
  city text not null default 'Bangkok',
  notes text not null default '',
  eta_minutes integer not null default 35,
  needs_receipt boolean not null default true,
  tax_invoice boolean not null default false,
  company_name text not null default '',
  tax_id text not null default '',
  invoice_email text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  dish_id text not null,
  dish_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null default 0,
  spice_level integer not null default 0,
  toppings jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  status public.order_status not null,
  occurred_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_saved_addresses_user_id on public.saved_addresses (user_id);
create index if not exists idx_saved_payment_methods_user_id on public.saved_payment_methods (user_id);
create index if not exists idx_favorite_dishes_user_id on public.favorite_dishes (user_id);
create index if not exists idx_gift_wallet_entries_user_id on public.gift_wallet_entries (user_id);
create index if not exists idx_reward_redemptions_user_id on public.reward_redemptions (user_id);
create index if not exists idx_notifications_user_id on public.notifications (user_id);
create index if not exists idx_reviews_user_id on public.reviews (user_id);
create index if not exists idx_reviews_dish_id on public.reviews (dish_id);
create index if not exists idx_reservations_user_id on public.reservations (user_id);
create index if not exists idx_reservations_branch_date on public.reservations (branch_id, reservation_date, time_slot);
create index if not exists idx_orders_user_id on public.orders (user_id);
create index if not exists idx_orders_branch_id on public.orders (branch_id);
create index if not exists idx_order_items_order_id on public.order_items (order_id);
create index if not exists idx_order_status_history_order_id on public.order_status_history (order_id);

drop trigger if exists set_branches_updated_at on public.branches;
create trigger set_branches_updated_at before update on public.branches for each row execute procedure public.set_updated_at();
drop trigger if exists set_promo_codes_updated_at on public.promo_codes;
create trigger set_promo_codes_updated_at before update on public.promo_codes for each row execute procedure public.set_updated_at();
drop trigger if exists set_user_preferences_updated_at on public.user_preferences;
create trigger set_user_preferences_updated_at before update on public.user_preferences for each row execute procedure public.set_updated_at();
drop trigger if exists set_notification_preferences_updated_at on public.notification_preferences;
create trigger set_notification_preferences_updated_at before update on public.notification_preferences for each row execute procedure public.set_updated_at();
drop trigger if exists set_saved_addresses_updated_at on public.saved_addresses;
create trigger set_saved_addresses_updated_at before update on public.saved_addresses for each row execute procedure public.set_updated_at();
drop trigger if exists set_saved_payment_methods_updated_at on public.saved_payment_methods;
create trigger set_saved_payment_methods_updated_at before update on public.saved_payment_methods for each row execute procedure public.set_updated_at();
drop trigger if exists set_reviews_updated_at on public.reviews;
create trigger set_reviews_updated_at before update on public.reviews for each row execute procedure public.set_updated_at();
drop trigger if exists set_reservations_updated_at on public.reservations;
create trigger set_reservations_updated_at before update on public.reservations for each row execute procedure public.set_updated_at();
drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at before update on public.orders for each row execute procedure public.set_updated_at();

insert into public.branches (id, name, neighborhood, address, hours, phone, eta_min_minutes, eta_max_minutes)
values
  ('bangrak', 'Bangrak Salon', 'Bangrak', '145 Charoen Krung Road, Bangrak, Bangkok', 'Daily 11:30–22:30', '+66 2 514 8890', 25, 42),
  ('sukhumvit', 'Sukhumvit House', 'Sukhumvit', '18 Soi Sukhumvit 31, Bangkok', 'Daily 11:00–22:00', '+66 2 118 2740', 20, 38),
  ('chiangmai', 'Chiang Mai Courtyard', 'Old City', '51 Moon Muang Road, Chiang Mai', 'Daily 11:00–21:30', '+66 53 887 214', 18, 35)
on conflict (id) do update
set
  name = excluded.name,
  neighborhood = excluded.neighborhood,
  address = excluded.address,
  hours = excluded.hours,
  phone = excluded.phone,
  eta_min_minutes = excluded.eta_min_minutes,
  eta_max_minutes = excluded.eta_max_minutes,
  updated_at = timezone('utc', now());

insert into public.promo_codes (code, title, description, minimum_subtotal, kind, value, is_active)
values
  ('GOLD15', 'Gold Evening Offer', '15% off qualifying dinner orders', 1200, 'percent', 15, true),
  ('SIAM120', 'Siam Table Credit', '120 THB off qualifying orders', 900, 'amount', 120, true),
  ('TASTING10', 'Tasting Menu Privilege', '10% off curated tasting sets', 1500, 'percent', 10, true)
on conflict (code) do update
set
  title = excluded.title,
  description = excluded.description,
  minimum_subtotal = excluded.minimum_subtotal,
  kind = excluded.kind,
  value = excluded.value,
  is_active = excluded.is_active,
  updated_at = timezone('utc', now());

alter table public.branches enable row level security;
alter table public.promo_codes enable row level security;
alter table public.user_preferences enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.saved_addresses enable row level security;
alter table public.saved_payment_methods enable row level security;
alter table public.favorite_dishes enable row level security;
alter table public.gift_wallet_entries enable row level security;
alter table public.reward_redemptions enable row level security;
alter table public.notifications enable row level security;
alter table public.reviews enable row level security;
alter table public.reservations enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;

drop policy if exists "Profiles admin access" on public.profiles;
create policy "Profiles admin access"
on public.profiles
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read branches" on public.branches;
create policy "Public can read branches"
on public.branches
for select
to anon, authenticated
using (true);

drop policy if exists "Admins manage branches" on public.branches;
create policy "Admins manage branches"
on public.branches
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read promo codes" on public.promo_codes;
create policy "Public can read promo codes"
on public.promo_codes
for select
to anon, authenticated
using (is_active = true or public.is_admin());

drop policy if exists "Admins manage promo codes" on public.promo_codes;
create policy "Admins manage promo codes"
on public.promo_codes
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Users manage own preferences" on public.user_preferences;
create policy "Users manage own preferences"
on public.user_preferences
for all
to authenticated
using ((select auth.uid()) = user_id or public.is_admin())
with check ((select auth.uid()) = user_id or public.is_admin());

drop policy if exists "Users manage own notification preferences" on public.notification_preferences;
create policy "Users manage own notification preferences"
on public.notification_preferences
for all
to authenticated
using ((select auth.uid()) = user_id or public.is_admin())
with check ((select auth.uid()) = user_id or public.is_admin());

drop policy if exists "Users manage own addresses" on public.saved_addresses;
create policy "Users manage own addresses"
on public.saved_addresses
for all
to authenticated
using ((select auth.uid()) = user_id or public.is_admin())
with check ((select auth.uid()) = user_id or public.is_admin());

drop policy if exists "Users manage own payment methods" on public.saved_payment_methods;
create policy "Users manage own payment methods"
on public.saved_payment_methods
for all
to authenticated
using ((select auth.uid()) = user_id or public.is_admin())
with check ((select auth.uid()) = user_id or public.is_admin());

drop policy if exists "Users manage own favorites" on public.favorite_dishes;
create policy "Users manage own favorites"
on public.favorite_dishes
for all
to authenticated
using ((select auth.uid()) = user_id or public.is_admin())
with check ((select auth.uid()) = user_id or public.is_admin());

drop policy if exists "Users manage own wallet" on public.gift_wallet_entries;
create policy "Users manage own wallet"
on public.gift_wallet_entries
for all
to authenticated
using ((select auth.uid()) = user_id or public.is_admin())
with check ((select auth.uid()) = user_id or public.is_admin());

drop policy if exists "Users manage own redemptions" on public.reward_redemptions;
create policy "Users manage own redemptions"
on public.reward_redemptions
for all
to authenticated
using ((select auth.uid()) = user_id or public.is_admin())
with check ((select auth.uid()) = user_id or public.is_admin());

drop policy if exists "Users manage own notifications" on public.notifications;
create policy "Users manage own notifications"
on public.notifications
for all
to authenticated
using ((select auth.uid()) = user_id or public.is_admin())
with check ((select auth.uid()) = user_id or public.is_admin());

drop policy if exists "Public can read published reviews" on public.reviews;
create policy "Public can read published reviews"
on public.reviews
for select
to anon, authenticated
using (is_published = true or public.is_admin() or (user_id is not null and (select auth.uid()) = user_id));

drop policy if exists "Guests and users can create reviews" on public.reviews;
create policy "Guests and users can create reviews"
on public.reviews
for insert
to anon, authenticated
with check (user_id is null or (select auth.uid()) = user_id);

drop policy if exists "Owners and admins update reviews" on public.reviews;
create policy "Owners and admins update reviews"
on public.reviews
for update
to authenticated
using (public.is_admin() or (user_id is not null and (select auth.uid()) = user_id))
with check (public.is_admin() or (user_id is not null and (select auth.uid()) = user_id));

drop policy if exists "Owners and admins read reservations" on public.reservations;
create policy "Owners and admins read reservations"
on public.reservations
for select
to authenticated
using (public.is_admin() or (user_id is not null and (select auth.uid()) = user_id));

drop policy if exists "Guests and users can create reservations" on public.reservations;
create policy "Guests and users can create reservations"
on public.reservations
for insert
to anon, authenticated
with check (user_id is null or (select auth.uid()) = user_id);

drop policy if exists "Owners and admins update reservations" on public.reservations;
create policy "Owners and admins update reservations"
on public.reservations
for update
to authenticated
using (public.is_admin() or (user_id is not null and (select auth.uid()) = user_id))
with check (public.is_admin() or (user_id is not null and (select auth.uid()) = user_id));

drop policy if exists "Owners and admins read orders" on public.orders;
create policy "Owners and admins read orders"
on public.orders
for select
to authenticated
using (public.is_admin() or (user_id is not null and (select auth.uid()) = user_id));

drop policy if exists "Guests and users can create orders" on public.orders;
create policy "Guests and users can create orders"
on public.orders
for insert
to anon, authenticated
with check (user_id is null or (select auth.uid()) = user_id);

drop policy if exists "Owners and admins update orders" on public.orders;
create policy "Owners and admins update orders"
on public.orders
for update
to authenticated
using (public.is_admin() or (user_id is not null and (select auth.uid()) = user_id))
with check (public.is_admin() or (user_id is not null and (select auth.uid()) = user_id));

drop policy if exists "Owners and admins read order items" on public.order_items;
create policy "Owners and admins read order items"
on public.order_items
for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
      and orders.user_id = (select auth.uid())
  )
);

drop policy if exists "Guests and users can create order items" on public.order_items;
create policy "Guests and users can create order items"
on public.order_items
for insert
to anon, authenticated
with check (true);

drop policy if exists "Owners and admins read order status history" on public.order_status_history;
create policy "Owners and admins read order status history"
on public.order_status_history
for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.orders
    where orders.id = order_status_history.order_id
      and orders.user_id = (select auth.uid())
  )
);

drop policy if exists "Guests and users can create order status history" on public.order_status_history;
create policy "Guests and users can create order status history"
on public.order_status_history
for insert
to anon, authenticated
with check (true);
