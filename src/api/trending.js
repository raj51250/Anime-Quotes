// Trending is the one feature here that genuinely can't work without a
// backend — "most favorited across all users" requires somewhere to
// aggregate counts. Rather than fake it locally, this talks to a Supabase
// project (Postgres + auto REST API) if the site owner has set one up via
// env vars. If not configured, every function below is a harmless no-op
// and the Trending tab explains what to do — see README.md > "Trending".

import { quoteId } from "../hooks/useFavorites.js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isTrendingEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const headers = {
  "Content-Type": "application/json",
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
};

/** Increment (delta > 0) or decrement (delta < 0) a quote's global
 *  favorite count. Fire-and-forget — failures never surface to the user,
 *  since this is a "nice to have" layered on top of local favorites. */
export async function bumpFavoriteCount(quote, delta) {
  if (!isTrendingEnabled) return;

  try {
    await fetch(`${SUPABASE_URL}/rest/v1/rpc/bump_favorite_count`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        p_id: quoteId(quote),
        p_anime: quote.anime?.name ?? "",
        p_character: quote.character?.name ?? "",
        p_content: quote.content,
        p_delta: delta,
      }),
    });
  } catch {
    /* best-effort only */
  }
}

/** Fetch the current most-favorited quotes across all visitors. Returns
 *  quotes shaped like the Animechan API so they drop straight into
 *  <QuoteGrid>, plus a `favorite_count` field. */
export async function getTrendingQuotes(limit = 12) {
  if (!isTrendingEnabled) return [];

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/quote_favorites?select=*&order=favorite_count.desc&limit=${limit}`,
    { headers }
  );
  if (!res.ok) throw new Error(`Supabase request failed (${res.status})`);

  const rows = await res.json();
  return rows
    .filter((r) => r.favorite_count > 0)
    .map((r) => ({
      content: r.content,
      anime: { name: r.anime },
      character: { name: r.character },
      favorite_count: r.favorite_count,
    }));
}
