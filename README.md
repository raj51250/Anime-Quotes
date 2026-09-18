# KOTOBA — Anime Quotes, Panel by Panel

A frontend React + Vite site for browsing anime quotes — manga-panel
styled cards, search by series, favorites, trending, and a shuffleable
hero quote. Installable as a PWA and works offline. No required backend;
one feature (Trending) optionally connects to a free Supabase project.

## Stack

- **React 19 + Vite 6** — build tooling
- **Tailwind CSS v4** — styling (via `@tailwindcss/vite`)
- **Framer Motion** — animation
- **react-icons** — icon set (Feather + Phosphor)
- **react-hot-toast** — toast notifications
- **vite-plugin-pwa** — installable app + offline caching (Workbox)
- **[Animechan API](https://animechan.io)** — free, no-key anime quotes API (10,000+ quotes)
- **[Jikan API](https://jikan.moe)** — free, no-key MyAnimeList wrapper, used for anime cover art
- **[Supabase](https://supabase.com)** *(optional)* — powers the Trending tab

## Features

- Manga-panel styled quote cards with anime cover art
- Search quotes by anime title
- Infinite scroll (auto-loads more as you reach the bottom)
- Favorites saved to `localStorage`, with their own "shelf" view
- Trending tab — most-favorited quotes across all visitors *(needs Supabase, see below)*
- Installable PWA with offline support — works on a flaky connection or with the tab closed and reopened
- Copy-to-clipboard on every card
- Fully responsive, built mobile-first

## Data sources & rate limits

**Animechan** is free with no signup/API key, but capped at **100
requests/day per IP**. To respect that:
- Quotes fetch in small batches (9 on load, 6 per infinite-scroll page).
- Results are de-duplicated in memory per session.
- If the API is unreachable or the cap is hit, the app **falls back
  automatically** to a small bundled quote pack (`src/data/fallbackQuotes.js`)
  — you'll see an "offline pack" badge when that happens.

**Jikan** (cover art) is rate-limited client-side to roughly 2.5
requests/second and results are cached in `localStorage` for 30 days, so
repeat visits and repeat anime titles cost nothing.

If you outgrow Animechan's free tier, their Premium plan ($5/mo, self-serve)
raises the limit to 1,000 req/hour — no code changes needed beyond adding
the auth header in `src/api/animechan.js`.

## PWA / offline support

The app is installable (Android/desktop Chrome show an in-app "Install
KOTOBA" prompt automatically; iOS Safari users install via Share → Add to
Home Screen). Once visited once, the app shell, styles, and recently seen
quotes/images are cached, so it keeps working — with the bundled fallback
pack as a floor — even with no connection.

To test PWA behavior locally you need a production build (the dev server
doesn't register a service worker):

```bash
npm run build
npm run preview
```

Then open the preview URL, check DevTools → Application → Service Workers,
and try toggling "Offline" in the Network tab.

## Trending (optional — needs Supabase)

"Most favorited across all visitors" needs somewhere to add up favorites
from everyone, which a static frontend can't do alone. This app talks to
a free [Supabase](https://supabase.com) project if you configure one;
without it, the Trending tab shows a short setup note instead of pretending
to have data.

**Setup (a couple of minutes, no credit card):**

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** → **New query**, paste the contents of
   [`supabase/schema.sql`](./supabase/schema.sql), and run it. This creates
   one table (`quote_favorites`) and one function that safely increments/
   decrements counts — anonymous visitors can only call the function, never
   write to the table directly.
3. Go to **Project Settings → API** and copy the **Project URL** and
   **anon public** key.
4. Copy `.env.example` to `.env` and fill them in:
   ```
   VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
5. Restart `npm run dev` (or redeploy). Every favorite/unfavorite now also
   updates the shared count, and the Trending tab shows a live leaderboard.

**On Netlify:** add the same two variables under
**Site settings → Environment variables**, then redeploy.

If you skip this setup entirely, everything else in the app (browsing,
search, favorites, offline mode) works exactly the same.

## File structure

```
anime-quotes/
├─ index.html                  # HTML shell, fonts, meta tags, PWA meta
├─ netlify.toml                # Netlify build + SPA redirect config
├─ vite.config.js              # Vite + Tailwind + PWA plugin config
├─ .env.example                # Optional Supabase config template
├─ supabase/
│  └─ schema.sql               # Run once in Supabase SQL editor (Trending)
├─ public/
│  ├─ favicon.svg
│  ├─ apple-touch-icon.png
│  ├─ pwa-192x192.png
│  ├─ pwa-512x512.png
│  └─ maskable-icon-512x512.png
└─ src/
   ├─ main.jsx                 # React entry point
   ├─ App.jsx                  # App state: view routing, fetching, search
   ├─ index.css                # Design tokens (colors/fonts) + Tailwind import
   ├─ api/
   │  ├─ animechan.js          # Animechan API client (random / by anime / by character)
   │  ├─ jikan.js              # Anime cover-art lookup, cached + throttled
   │  └─ trending.js           # Optional Supabase client (favorite counts)
   ├─ data/
   │  └─ fallbackQuotes.js     # Offline quote pack (used if API fails)
   ├─ hooks/
   │  ├─ useFavorites.js       # localStorage-backed favorites
   │  └─ useCoverArt.js        # Resolves cover art per anime as quotes load
   └─ components/
      ├─ Navbar.jsx
      ├─ Hero.jsx              # Headline + featured/shuffle quote + search
      ├─ SearchBar.jsx
      ├─ QuoteGrid.jsx         # Grid + infinite scroll
      ├─ QuoteCard.jsx         # The manga-panel quote card
      ├─ TrendingGrid.jsx      # Trending tab (or its setup note)
      ├─ Loader.jsx            # Skeleton loading state
      ├─ EmptyState.jsx
      ├─ Footer.jsx
      ├─ ScrollTopButton.jsx
      ├─ PwaUpdater.jsx        # Offline-ready / update-available toasts
      └─ InstallPrompt.jsx     # "Install app" banner
```

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build locally (needed to test the PWA)
```

## Deploy

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit — KOTOBA anime quotes"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

### 2. Deploy to Netlify

**Option A — Netlify dashboard (no CLI):**
1. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**.
2. Connect GitHub and pick your repo.
3. Build settings are auto-detected from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. If you set up Trending, add `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY` under **Site settings → Environment variables**.
5. Click **Deploy site**.

**Option B — Netlify CLI:**
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

## Notes

- Favorites persist in `localStorage`, per browser/device.
- Trending counts persist in Supabase (if configured), shared across every
  visitor; everything else is client-side only.
- Design: a manga-panel aesthetic (thick ink borders, offset "comic"
  shadows, halftone dots, Anton display type) rather than a generic
  dark-glass template — tune the palette in `src/index.css` under `@theme`.

---

Made with love by **RAJ**
