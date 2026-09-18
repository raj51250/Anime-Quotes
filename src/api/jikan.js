// Free, no-key client for the Jikan API (https://docs.api.jikan.moe/) —
// used only to fetch a poster/cover image for a given anime title so quote
// cards can show artwork. Jikan's public tier is soft-limited to ~3
// requests/second, so lookups are queued and throttled, and results are
// cached in localStorage for 30 days (posters rarely change).

const BASE_URL = "https://api.jikan.moe/v4";
const CACHE_KEY = "kotoba:cover-art-cache:v1";
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const REQUEST_GAP_MS = 400; // ~2.5 req/sec, safely under Jikan's limit

function loadCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) ?? {};
  } catch {
    return {};
  }
}

function saveCache(cache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    /* storage unavailable or full — degrade to in-memory only */
  }
}

const cache = loadCache();
const inFlight = new Map(); // name -> Promise<string|null>
let queueTail = Promise.resolve();

function normalize(name) {
  return name.trim().toLowerCase();
}

function enqueue(task) {
  const result = queueTail.then(task);
  // Swallow errors here so one failed lookup doesn't stall the queue;
  // the caller's own promise still rejects/resolves normally.
  queueTail = result.catch(() => {});
  return result;
}

async function fetchCoverArt(animeName) {
  const res = await fetch(
    `${BASE_URL}/anime?q=${encodeURIComponent(animeName)}&limit=1&sfw=true`
  );
  if (!res.ok) throw new Error(`Jikan request failed (${res.status})`);
  const json = await res.json();
  const entry = json?.data?.[0];
  const url =
    entry?.images?.webp?.large_image_url ??
    entry?.images?.webp?.image_url ??
    entry?.images?.jpg?.large_image_url ??
    entry?.images?.jpg?.image_url ??
    null;
  return url;
}

/** Resolve a poster/cover image URL for an anime title, or null if none
 *  could be found. Cached, throttled, and de-duplicated across callers. */
export function getCoverArt(animeName) {
  if (!animeName) return Promise.resolve(null);
  const key = normalize(animeName);

  const cached = cache[key];
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return Promise.resolve(cached.url);
  }

  if (inFlight.has(key)) return inFlight.get(key);

  const promise = enqueue(async () => {
    await new Promise((r) => setTimeout(r, REQUEST_GAP_MS));
    let url = null;
    try {
      url = await fetchCoverArt(animeName);
    } catch {
      url = null;
    }
    cache[key] = { url, ts: Date.now() };
    saveCache(cache);
    inFlight.delete(key);
    return url;
  });

  inFlight.set(key, promise);
  return promise;
}
