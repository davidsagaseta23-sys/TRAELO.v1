-- Contenido editable. Ejecutar DESPUÉS de schema_v2.sql.
create table public.site_settings (key text primary key, value text not null default '');
create table public.faqs (
  id uuid primary key default gen_random_uuid(), question text not null, answer text not null,
  position int not null default 0, active boolean not null default true);
create table public.pages (
  slug text primary key, title text not null, body text not null default '', updated_at timestamptz not null default now());
alter table public.site_settings enable row level security;
alter table public.faqs enable row level security;
alter table public.pages enable row level security;
create policy "settings read" on public.site_settings for select using (true);
create policy "settings admin" on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "faqs read" on public.faqs for select using (active = true or public.is_admin());
create policy "faqs admin" on public.faqs for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "pages read" on public.pages for select using (true);
create policy "pages admin" on public.pages for all to authenticated using (public.is_admin()) with check (public.is_admin());
insert into public.site_settings (key, value) values ('whatsapp',''),('instagram',''),('storage_days','15'),('min_kg','1');
insert into public.faqs (question, answer, position) values
 ('¿Qué productos puedo traer?','Aceptamos carga general. No transportamos medicamentos, drogas, armas, alimentos ni perecederos, ni ningún producto que legalmente no podamos transportar.',1),
 ('¿Desde dónde puedo traer?','Desde Miami y China.',2),
 ('¿Cómo se calcula el precio?','Peso facturable × precio por kg. El precio depende del origen y del tipo de producto. Usá la calculadora para estimarlo.',3),
 ('¿Cuál es el peso mínimo?','{{peso_minimo}} kg. Si tu paquete pesa menos, se calcula como {{peso_minimo}} kg. Por encima de eso se cobra el peso exacto.',4),
 ('¿Puedo consolidar varios paquetes?','Sí, la consolidación es gratis. Podés juntar varios paquetes y enviarlos juntos.',5),
 ('¿Cuánto tiempo puedo dejar mi paquete?','Tenés {{dias_gratis}} días de almacenamiento sin cargo, contados desde la llegada del primer paquete.',6),
 ('¿El precio incluye la entrega dentro de Argentina?','No. El valor de la calculadora es el del envío internacional. La entrega dentro de Argentina se cotiza por separado.',7);
insert into public.pages (slug, title, body) values ('terminos','Términos y Condiciones','');
