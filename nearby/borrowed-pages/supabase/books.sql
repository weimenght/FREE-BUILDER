-- The Dog-Eared Corner: a no-account book swap.  Run once in Supabase → SQL editor.
-- Privacy model: a visitor's device keeps a random secret; the database stores only its SHA-256.
-- Shelves are public (titles, notes, pen names). Contact lines live in book_request, readable by nobody directly:
-- only the book's current owner sees them, through book_mine(). Closed requests are erased after 30 days.

create table if not exists public.book_shelf (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  author text check (char_length(author) <= 80),
  year text check (char_length(year) <= 8),
  cover text check (cover is null or cover ~ '^https://covers\.openlibrary\.org/'),
  room text not null check (room in ('attic','parlor','basement','garden')),
  spot text check (char_length(spot) <= 24),
  color text check (color ~ '^#[0-9a-fA-F]{6}$'),
  h smallint check (h between 90 and 240),
  w smallint check (w between 14 and 60),
  tilt real check (tilt between -25 and 25),
  lying boolean not null default false,
  wear text check (char_length(wear) <= 80),
  note text check (char_length(note) <= 500),
  owner_name text not null check (char_length(owner_name) between 1 and 32),
  owner_hash text,
  house boolean not null default false,
  handovers int not null default 0,
  requests smallint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.book_lineage (
  id bigint generated always as identity primary key,
  book_id uuid not null references public.book_shelf(id) on delete cascade,
  owner_name text not null check (char_length(owner_name) between 1 and 32),
  line text check (char_length(line) <= 120),
  since timestamptz not null default now()
);
create table if not exists public.book_request (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.book_shelf(id) on delete cascade,
  requester_hash text not null,
  requester_name text not null check (char_length(requester_name) between 1 and 32),
  contact text not null check (char_length(contact) between 3 and 120),
  message text check (char_length(message) <= 300),
  status text not null default 'open' check (status in ('open','done','declined','withdrawn')),
  created_at timestamptz not null default now(),
  closed_at timestamptz
);
create index if not exists book_lineage_book on public.book_lineage (book_id);
create index if not exists book_request_open on public.book_request (book_id) where status = 'open';
create index if not exists book_request_who on public.book_request (requester_hash);
create index if not exists book_shelf_owner on public.book_shelf (owner_hash);

alter table public.book_shelf enable row level security;
alter table public.book_lineage enable row level security;
alter table public.book_request enable row level security;
drop policy if exists "shelves are public" on public.book_shelf;
drop policy if exists "lineage is public" on public.book_lineage;
create policy "shelves are public" on public.book_shelf for select to anon, authenticated using (true);
create policy "lineage is public" on public.book_lineage for select to anon, authenticated using (true);

revoke all on public.book_shelf, public.book_lineage, public.book_request from anon, authenticated;
grant select (id, title, author, year, cover, room, spot, color, h, w, tilt, lying, wear, note, owner_name, house, handovers, requests, created_at, updated_at) on public.book_shelf to anon, authenticated;
grant select on public.book_lineage to anon, authenticated;

create or replace function public._bk_hash(p_secret text) returns text
language plpgsql immutable set search_path = public, extensions as $$
begin
  if p_secret is null or char_length(p_secret) < 32 or char_length(p_secret) > 128 then raise exception 'bad key'; end if;
  return encode(extensions.digest(p_secret, 'sha256'), 'hex');
end $$;
revoke execute on function public._bk_hash(text) from public, anon, authenticated;

create or replace function public.book_add(p_secret text, p_name text, p_title text, p_author text, p_year text, p_cover text,
  p_room text, p_spot text, p_color text, p_h int, p_w int, p_tilt real, p_lying boolean, p_wear text, p_note text)
returns uuid language plpgsql security definer set search_path = public, extensions as $$
declare me text := public._bk_hash(p_secret); new_id uuid;
begin
  if (select count(*) from book_shelf where owner_hash = me) >= 40 then raise exception 'shelf full: 40 books per visitor'; end if;
  insert into book_shelf (title, author, year, cover, room, spot, color, h, w, tilt, lying, wear, note, owner_name, owner_hash)
  values (trim(p_title), nullif(trim(p_author), ''), nullif(trim(p_year), ''), nullif(p_cover, ''), p_room, p_spot, p_color, p_h, p_w, p_tilt, coalesce(p_lying, false),
          nullif(trim(p_wear), ''), nullif(trim(p_note), ''), trim(p_name), me)
  returning id into new_id;
  insert into book_lineage (book_id, owner_name, line) values (new_id, trim(p_name), 'Tucked it in');
  return new_id;
end $$;

create or replace function public.book_edit(p_secret text, p_id uuid, p_note text, p_room text, p_spot text)
returns void language plpgsql security definer set search_path = public, extensions as $$
declare me text := public._bk_hash(p_secret);
begin
  update book_shelf set note = nullif(trim(p_note), ''), room = coalesce(p_room, room), spot = coalesce(p_spot, spot), updated_at = now()
   where id = p_id and owner_hash = me;
  if not found then raise exception 'not your book'; end if;
end $$;

create or replace function public.book_remove(p_secret text, p_id uuid)
returns void language plpgsql security definer set search_path = public, extensions as $$
declare me text := public._bk_hash(p_secret);
begin
  delete from book_shelf where id = p_id and owner_hash = me;
  if not found then raise exception 'not your book'; end if;
end $$;

create or replace function public.book_ask(p_secret text, p_id uuid, p_name text, p_contact text, p_message text)
returns uuid language plpgsql security definer set search_path = public, extensions as $$
declare me text := public._bk_hash(p_secret); b book_shelf; rid uuid;
begin
  select * into b from book_shelf where id = p_id;
  if not found then raise exception 'no such book'; end if;
  if b.house then raise exception 'this copy stays in the corner'; end if;
  if b.owner_hash = me then raise exception 'this is already your book'; end if;
  if (select count(*) from book_request where requester_hash = me and created_at > now() - interval '1 day') >= 20 then raise exception 'too many requests today'; end if;
  select id into rid from book_request where book_id = p_id and requester_hash = me and status = 'open';
  if rid is not null then
    update book_request set requester_name = trim(p_name), contact = trim(p_contact), message = nullif(trim(p_message), '') where id = rid;
  else
    insert into book_request (book_id, requester_hash, requester_name, contact, message)
    values (p_id, me, trim(p_name), trim(p_contact), nullif(trim(p_message), '')) returning id into rid;
    update book_shelf set requests = requests + 1 where id = p_id;
  end if;
  return rid;
end $$;

create or replace function public.book_cancel(p_secret text, p_req uuid)
returns void language plpgsql security definer set search_path = public, extensions as $$
declare me text := public._bk_hash(p_secret); bid uuid;
begin
  update book_request set status = 'withdrawn', closed_at = now(), contact = '(withdrawn)'
   where id = p_req and requester_hash = me and status = 'open' returning book_id into bid;
  if bid is not null then update book_shelf set requests = greatest(requests - 1, 0) where id = bid; end if;
end $$;

create or replace function public.book_reply(p_secret text, p_req uuid, p_handover boolean)
returns void language plpgsql security definer set search_path = public, extensions as $$
declare me text := public._bk_hash(p_secret); r book_request;
begin
  select q.* into r from book_request q join book_shelf s on s.id = q.book_id
   where q.id = p_req and q.status = 'open' and s.owner_hash = me;
  if not found then raise exception 'no such request'; end if;
  if p_handover then
    update book_shelf set owner_hash = r.requester_hash, owner_name = r.requester_name, handovers = handovers + 1, requests = 0, updated_at = now() where id = r.book_id;
    insert into book_lineage (book_id, owner_name, line) values (r.book_id, r.requester_name, 'Received it by hand');
    update book_request set status = 'done', closed_at = now() where id = r.id;
    update book_request set status = 'declined', closed_at = now(), contact = '(closed)' where book_id = r.book_id and status = 'open';
  else
    update book_request set status = 'declined', closed_at = now(), contact = '(closed)' where id = r.id;
    update book_shelf set requests = greatest(requests - 1, 0) where id = r.book_id;
  end if;
end $$;

create or replace function public.book_mine(p_secret text)
returns json language plpgsql security definer set search_path = public, extensions as $$
declare me text := public._bk_hash(p_secret);
begin
  delete from book_request where status <> 'open' and closed_at < now() - interval '30 days';
  return json_build_object(
    'books', coalesce((select json_agg(json_build_object('id', s.id, 'title', s.title, 'author', s.author, 'room', s.room, 'note', s.note, 'owner_name', s.owner_name,
        'asks', coalesce((select json_agg(json_build_object('id', q.id, 'name', q.requester_name, 'contact', q.contact, 'message', q.message, 'at', q.created_at) order by q.created_at)
                          from book_request q where q.book_id = s.id and q.status = 'open'), '[]'::json)) order by s.created_at desc)
       from book_shelf s where s.owner_hash = me), '[]'::json),
    'asks', coalesce((select json_agg(json_build_object('id', q.id, 'book', q.book_id, 'title', s.title, 'status', q.status, 'at', q.created_at) order by q.created_at desc)
       from book_request q join book_shelf s on s.id = q.book_id where q.requester_hash = me), '[]'::json)
  );
end $$;

create or replace function public.book_forget(p_secret text)
returns json language plpgsql security definer set search_path = public, extensions as $$
declare me text := public._bk_hash(p_secret); nb int; nr int;
begin
  update book_shelf s set requests = greatest(s.requests - 1, 0) from book_request q where q.book_id = s.id and q.requester_hash = me and q.status = 'open';
  delete from book_request where requester_hash = me; get diagnostics nr = row_count;
  delete from book_shelf where owner_hash = me; get diagnostics nb = row_count;
  return json_build_object('books', nb, 'requests', nr);
end $$;

revoke execute on function public.book_add(text,text,text,text,text,text,text,text,text,int,int,real,boolean,text,text), public.book_edit(text,uuid,text,text,text),
  public.book_remove(text,uuid), public.book_ask(text,uuid,text,text,text), public.book_cancel(text,uuid), public.book_reply(text,uuid,boolean),
  public.book_mine(text), public.book_forget(text) from public;
grant execute on function public.book_add(text,text,text,text,text,text,text,text,text,int,int,real,boolean,text,text), public.book_edit(text,uuid,text,text,text),
  public.book_remove(text,uuid), public.book_ask(text,uuid,text,text,text), public.book_cancel(text,uuid), public.book_reply(text,uuid,boolean),
  public.book_mine(text), public.book_forget(text) to anon, authenticated;
