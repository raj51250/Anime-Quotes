// Thin client for the free Animechan API (https://animechan.io/docs)
// No API key required. Free tier: 100 requests/day per IP.
// Every function throws on network/HTTP failure so callers can fall back
// to the bundled local quote pack in src/data/fallbackQuotes.js.

const BASE_URL = "https://api.animechan.io/v1";

async function request(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    const err = new Error(`Animechan request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  const json = await res.json();
  return json.data;
}

/** Get a single random quote. */
export function getRandomQuote() {
  return request("/quotes/random");
}

/** Get `count` random quotes, de-duplicated by content. Runs requests
 *  in parallel since the API has no bulk-random endpoint. */
export async function getRandomQuotes(count = 9) {
  const results = await Promise.allSettled(
    Array.from({ length: count }, () => getRandomQuote())
  );

  const seen = new Set();
  const quotes = [];
  for (const r of results) {
    if (r.status !== "fulfilled" || !r.value) continue;
    const key = r.value.content;
    if (seen.has(key)) continue;
    seen.add(key);
    quotes.push(r.value);
  }

  // Surface a rate-limit error only if literally nothing came back.
  if (quotes.length === 0) {
    const rateLimited = results.some(
      (r) => r.status === "rejected" && r.reason?.status === 429
    );
    const err = new Error(
      rateLimited ? "Rate limited" : "Could not reach Animechan"
    );
    err.status = rateLimited ? 429 : 0;
    throw err;
  }

  return quotes;
}

/** Get one page of quotes for a given anime title. */
export function getQuotesByAnime(anime, page = 1) {
  return request(`/quotes?anime=${encodeURIComponent(anime)}&page=${page}`);
}

/** Get one page of quotes for a given character name. */
export function getQuotesByCharacter(character, page = 1) {
  return request(
    `/quotes?character=${encodeURIComponent(character)}&page=${page}`
  );
}
