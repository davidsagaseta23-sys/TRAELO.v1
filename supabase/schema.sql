-- Ejecutar en Supabase > SQL Editor. Reemplazá TU_EMAIL_ADMIN.
create extension if not exists pgcrypto;
create table public.shipping_rates (
  id uuid primary key default gen_random_uuid(),
  origin text not null,
  product_name text not null,
  price_per_kg numeric(10,2) check (price_per_kg is null or price_per_kg >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create or replace function public.touch_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end; $$ language plpgsql;
create trigger shipping_rates_touch before update on public.shipping_rates
  for each row execute function public.touch_updated_at();
alter table public.shipping_rates enable row level security;
create policy "public read active" on public.shipping_rates for select using (active = true);
create policy "admin all" on public.shipping_rates for all to authenticated
  using ((auth.jwt() ->> 'email') = 'TU_EMAIL_ADMIN')
  with check ((auth.jwt() ->> 'email') = 'TU_EMAIL_ADMIN');
insert into public.shipping_rates (origin, product_name, price_per_kg) values
  ('Miami','Carga general',33), ('Miami','Celular alta gama',75), ('Miami','Último iPhone',85),
  ('China','Carga general',null);
