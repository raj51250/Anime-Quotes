-- Run this once in your Supabase project's SQL editor
-- (Project -> SQL Editor -> New query -> paste -> Run).
--
-- This sets up the one table trending needs, plus a function that safely
-- increments/decrements a quote's favorite count without letting anonymous
-- visitors write to the table directly.

create table if not exists quote_favorites (
  id text primary key,
  anime text not null,
  character text not null,
  content text not null,
  favorite_count integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table quote_favorites enable row level security;

-- Anyone (including the anon key used by the frontend) can read counts.
create policy "Public read access"
  on quote_favorites for select
  using (true);

-- No direct inserts/updates from the client — everything goes through
-- the bump_favorite_count() function below, which runs as the table
-- owner (security definer) so the RLS policy above doesn't need an
-- insert/update rule at all.

create or replace function bump_favorite_count(
  p_id text,
  p_anime text,
  p_character text,
  p_content text,
  p_delta integer
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into quote_favorites (id, anime, character, content, favorite_count, updated_at)
  values (p_id, p_anime, p_character, p_content, greatest(p_delta, 0), now())
  on conflict (id) do update
    set favorite_count = greatest(quote_favorites.favorite_count + p_delta, 0),
        anime = excluded.anime,
        character = excluded.character,
        content = excluded.content,
        updated_at = now();
end;
$$;

-- Let the anonymous (public) role call the function above.
grant execute on function bump_favorite_count(text, text, text, text, integer) to anon;
