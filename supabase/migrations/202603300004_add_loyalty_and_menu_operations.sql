create table if not exists public.loyalty_accounts (
  user_id uuid primary key references auth.users (id) on delete cascade,
  current_points integer not null default 1280,
  lifetime_points integer not null default 1280,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.dish_operations (
  dish_id text primary key,
  price_override numeric(10,2),
  is_available boolean not null default true,
  featured_override boolean,
  status_override text check (status_override in ('available', 'limited', 'soldOut', 'chefToday')),
  kitchen_note text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_dish_operations_status on public.dish_operations (status_override);

drop trigger if exists set_loyalty_accounts_updated_at on public.loyalty_accounts;
create trigger set_loyalty_accounts_updated_at before update on public.loyalty_accounts for each row execute procedure public.set_updated_at();
drop trigger if exists set_dish_operations_updated_at on public.dish_operations;
create trigger set_dish_operations_updated_at before update on public.dish_operations for each row execute procedure public.set_updated_at();

alter table public.loyalty_accounts enable row level security;
alter table public.dish_operations enable row level security;

drop policy if exists "Owners and admins manage loyalty accounts" on public.loyalty_accounts;
create policy "Owners and admins manage loyalty accounts"
on public.loyalty_accounts
for all
to authenticated
using (public.is_admin() or (select auth.uid()) = user_id)
with check (public.is_admin() or (select auth.uid()) = user_id);

drop policy if exists "Public can read dish operations" on public.dish_operations;
create policy "Public can read dish operations"
on public.dish_operations
for select
to anon, authenticated
using (true);

drop policy if exists "Admins manage dish operations" on public.dish_operations;
create policy "Admins manage dish operations"
on public.dish_operations
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
