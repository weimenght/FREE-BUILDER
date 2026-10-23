-- The Dog-Eared Corner, part 2: the three functions that delete things on a visitor's behalf.
-- (Part 1 — tables and the add / ask / reply functions — is already in the project.)
-- Run once in Supabase → SQL editor.

-- take your own book off the shelf
create or replace function public.book_remove(p_secret text, p_id uuid)
returns void language plpgsql security definer set search_path = public, extensions as $$
declare me text := public._bk_hash(p_secret);
begin
  delete from book_shelf where id = p_id and owner_hash = me;
  if not found then raise exception 'not your book'; end if;
end $$;

-- your shelf: your books with who asked for them (and how to reach them), and what you asked for.
-- Retention: closed requests (and the contact line in them) are erased after 30 days.
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

-- "Forget me": every book you brought and every request you made
create or replace function public.book_forget(p_secret text)
returns json language plpgsql security definer set search_path = public, extensions as $$
declare me text := public._bk_hash(p_secret); nb int; nr int;
begin
  update book_shelf s set requests = greatest(s.requests - 1, 0) from book_request q where q.book_id = s.id and q.requester_hash = me and q.status = 'open';
  delete from book_request where requester_hash = me; get diagnostics nr = row_count;
  delete from book_shelf where owner_hash = me; get diagnostics nb = row_count;
  return json_build_object('books', nb, 'requests', nr);
end $$;

revoke execute on function public.book_remove(text,uuid), public.book_mine(text), public.book_forget(text) from public;
grant execute on function public.book_remove(text,uuid), public.book_mine(text), public.book_forget(text) to anon, authenticated;
