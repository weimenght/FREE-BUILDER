-- Jukebox: every record a visitor presses, and one shared turntable heard in the studio, Wei's Bar and the Dog-Eared Corner.
-- No account: a device key, stored only as a one-way hash (public._bk_hash from the book corner).
-- A song is a short code: 1.<bpm>.<mood>.<instrument>.<melody 8x16 bits as 32 hex>.<drums 3x16 bits as 12 hex>
-- It is played as 16 steps x 6 loops of eighth notes, so it lasts 96 * 30 / bpm seconds (20-40 s).

create table if not exists public.jukebox_records (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 32),
  title text not null check (char_length(title) between 1 and 40),
  song text not null check (song ~ '^1\.[0-9]{2,3}\.[0-7]\.[0-7]\.[0-9a-f]{32}\.[0-9a-f]{12}$'),
  owner_hash text,
  house boolean not null default false,
  spins int not null default 0,
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists jukebox_records_created on public.jukebox_records (created_at desc) where not hidden;

create table if not exists public.jukebox_spins (
  id bigint generated always as identity primary key,
  record_id uuid not null references public.jukebox_records(id) on delete cascade,
  venue text not null check (venue in ('studio', 'bar', 'books')),
  by_name text check (char_length(by_name) <= 32),
  owner_hash text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index if not exists jukebox_spins_ends on public.jukebox_spins (ends_at desc);

alter table public.jukebox_records enable row level security;
alter table public.jukebox_spins enable row level security;
drop policy if exists jukebox_records_read on public.jukebox_records;
create policy jukebox_records_read on public.jukebox_records for select to anon, authenticated using (not hidden);
revoke all on public.jukebox_records, public.jukebox_spins from anon, authenticated;
grant select (id, name, title, song, house, spins, created_at) on public.jukebox_records to anon, authenticated;

create or replace function public._jb_secs(p_song text) returns real language sql immutable as $$
  select 96 * 30.0 / greatest(72, least(140, split_part(p_song, '.', 2)::int))
$$;

-- press a record
create or replace function public.jukebox_press(p_secret text, p_name text, p_title text, p_song text)
returns uuid language plpgsql security definer set search_path = public, extensions as $$
declare me text := public._bk_hash(p_secret); new_id uuid;
begin
  if (select count(*) from jukebox_records where owner_hash = me and created_at > now() - interval '1 day') >= 30 then raise exception 'the press needs a rest: 30 records a day'; end if;
  if (select count(*) from jukebox_records where owner_hash = me and created_at > now() - interval '20 seconds') > 0 then raise exception 'too fast'; end if;
  insert into jukebox_records (name, title, song, owner_hash) values (trim(p_name), trim(p_title), p_song, me) returning id into new_id;
  return new_id;
end $$;

-- take one of your own records out of the jukebox
create or replace function public.jukebox_hide(p_secret text, p_id uuid)
returns void language plpgsql security definer set search_path = public, extensions as $$
declare me text := public._bk_hash(p_secret);
begin
  update jukebox_records set hidden = true where id = p_id and owner_hash = me and not house;
  if not found then raise exception 'not your record'; end if;
end $$;

create or replace function public.jukebox_mine(p_secret text)
returns setof uuid language sql stable security definer set search_path = public, extensions as $$
  select id from jukebox_records where owner_hash = public._bk_hash(p_secret) and not hidden
$$;

-- drop a coin: the record joins the one queue every venue hears
create or replace function public.jukebox_spin(p_secret text, p_id uuid, p_venue text, p_name text)
returns timestamptz language plpgsql security definer set search_path = public, extensions as $$
declare me text := public._bk_hash(p_secret); r jukebox_records; last_end timestamptz; st timestamptz;
begin
  perform pg_advisory_xact_lock(4207731);
  select * into r from jukebox_records where id = p_id and not hidden;
  if not found then raise exception 'no such record'; end if;
  if exists (select 1 from jukebox_spins where owner_hash = me and created_at > now() - interval '15 seconds') then raise exception 'too fast'; end if;
  if (select count(*) from jukebox_spins where owner_hash = me and ends_at > now()) >= 3 then raise exception 'three in the queue already'; end if;
  select max(ends_at) into last_end from jukebox_spins where ends_at > now();
  if last_end > now() + interval '12 minutes' then raise exception 'the queue is full'; end if;
  st := greatest(now() + interval '2.5 seconds', coalesce(last_end + interval '3 seconds', now()));
  insert into jukebox_spins (record_id, venue, by_name, owner_hash, starts_at, ends_at)
  values (r.id, p_venue, nullif(left(trim(coalesce(p_name, '')), 32), ''), me, st, st + make_interval(secs => public._jb_secs(r.song)));
  update jukebox_records set spins = spins + 1 where id = r.id;
  return st;
end $$;

-- what is playing now and next, the same answer for everyone (read with GET /rest/v1/rpc/jukebox_now)
-- When nobody has dropped a coin, the jukebox plays a record of its own choosing every 45 seconds.
create or replace function public.jukebox_now()
returns table (record_id uuid, title text, name text, song text, house boolean, venue text, by_name text, starts_at timestamptz, ends_at timestamptz, queued boolean, server_now timestamptz)
language plpgsql stable security definer set search_path = public, extensions as $$
declare slot bigint; slot_start timestamptz; q_end timestamptz; prev uuid; pick uuid;
begin
  return query
    select s.record_id, r.title, r.name, r.song, r.house, s.venue, s.by_name, s.starts_at, s.ends_at, true, now()
      from jukebox_spins s join jukebox_records r on r.id = s.record_id
     where s.ends_at > now() and not r.hidden order by s.starts_at limit 8;
  select max(s.ends_at) into q_end from jukebox_spins s where s.ends_at > now();
  slot := floor(extract(epoch from now()) / 45)::bigint;
  -- odd slots favour the ten newest records, so a fresh pressing is heard soon; never the same record twice in a row
  for i in -1..1 loop
    select x.id into pick from (
      select r.id from jukebox_records r where not r.hidden
       order by case when (slot + i) % 2 = 1 then r.created_at end desc nulls last, r.created_at desc
       limit case when (slot + i) % 2 = 1 then 10 else 100000 end) x
     where x.id is distinct from prev
     order by md5(x.id::text || (slot + i)::text) limit 1;
    prev := pick;
    slot_start := to_timestamp((slot + i) * 45);
    if i >= 0 and pick is not null and (q_end is null or slot_start >= q_end) then
      return query
        select r.id, r.title, r.name, r.song, r.house, null::text, null::text, slot_start, slot_start + make_interval(secs => public._jb_secs(r.song)), false, now()
          from jukebox_records r where r.id = pick;
    end if;
  end loop;
end $$;

revoke execute on function public.jukebox_press(text, text, text, text), public.jukebox_hide(text, uuid), public.jukebox_mine(text),
  public.jukebox_spin(text, uuid, text, text), public.jukebox_now(), public._jb_secs(text) from public;
grant execute on function public.jukebox_press(text, text, text, text), public.jukebox_hide(text, uuid), public.jukebox_mine(text),
  public.jukebox_spin(text, uuid, text, text), public.jukebox_now() to anon, authenticated;
grant execute on function public._jb_secs(text) to anon, authenticated;
