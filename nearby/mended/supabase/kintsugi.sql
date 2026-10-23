-- Kintsugi Studio: the public book of mended pieces (already applied to the project).
-- No account: a device key, stored only as a one-way hash (public._bk_hash from the book corner).
create table if not exists public.kintsugi_book (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 32),
  title text check (char_length(title) <= 80),
  vessel text check (char_length(vessel) <= 80),
  metal text check (char_length(metal) <= 40),
  img text not null check (char_length(img) <= 160000 and (img like 'data:image/webp;base64,%' or img like 'data:image/jpeg;base64,%')),
  owner_hash text,
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);
-- RLS: everyone may read pages that aren't hidden; writes only through kintsugi_add / kintsugi_hide / kintsugi_mine.
