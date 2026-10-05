-- Cuentas de cliente + seguimiento. Ejecutar DESPUÉS de schema.sql. Reemplazá TU_EMAIL_ADMIN.
create sequence if not exists public.client_seq start 1;
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  client_code text unique not null default ('TRL-' || lpad(nextval('public.client_seq')::text, 4, '0')),
  full_name text not null default '',
  phone text not null default '',
  created_at timestamptz not null default now()
);
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name',''), coalesce(new.raw_user_meta_data->>'phone',''));
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.is_admin() returns boolean language sql stable as $$
  select (auth.jwt() ->> 'email') = 'TU_EMAIL_ADMIN' $$;

create table public.packages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  description text not null,
  origin text not null,
  store_tracking text,
  weight_kg numeric(10,2),
  status text not null default 'received'
    check (status in ('received','in_transit','arrived_ar','delivered','dispatched')),
  transport_company text,
  transport_tracking text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger packages_touch before update on public.packages for each row execute function public.touch_updated_at();
create table public.package_events (
  id uuid primary key default gen_random_uuid(),
  package_id uuid not null references public.packages(id) on delete cascade,
  status text not null,
  note text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
alter table public.packages enable row level security;
alter table public.package_events enable row level security;
create policy "own profile" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "own profile update" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "own packages" on public.packages for select using (user_id = auth.uid() or public.is_admin());
create policy "admin packages write" on public.packages for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "own events" on public.package_events for select
  using (public.is_admin() or exists (select 1 from public.packages p where p.id = package_id and p.user_id = auth.uid()));
create policy "admin events write" on public.package_events for all to authenticated using (public.is_admin()) with check (public.is_admin());
