# KOTOBA — Anime Quotes, Panel by Panel

A fully static, frontend-only React + Vite site for browsing anime quotes -
manga-panel styled cards, search by series, favorites, and a shuffleable
hero quote. No backend, no database: everything runs in the browser.

## Stack

- **React 19 + Vite** - build tooling
- **Tailwind CSS v4** - styling (via `@tailwindcss/vite`)
- **Framer Motion** - animation
- **react-icons** - icon set (Feather + Phosphor)
- **react-hot-toast** - toast notifications
- **[Animechan API](https://animechan.io)** - free, no-key anime quotes API (10,000+ quotes)

## Data source & the 100 req/day limit

Animechan is free with **no signup/API key**, but capped at **100 requests
per IP per day**. To keep the app feeling snappy and to respect that limit:

- Quotes are fetched in small batches (9 on load, 6 per "Load more").
- Results are de-duplicated in memory so you don't see repeats in one session.
- If the API is unreachable or you hit the daily cap, the app **automatically
  falls back** to a small bundled quote pack (`src/data/fallbackQuotes.js`)
  so the site never looks broken - you'll see a small "offline pack" badge
  when that happens.

If you outgrow the free tier, Animechan Premium (self-serve, $5/mo) raises
the limit to 1,000 req/hour - just add the header per their
[auth docs](https://animechan.io/docs/auth). No code changes needed beyond
`src/api/animechan.js`.

## File structure

```
anime-quotes/
├─ index.html                  # HTML shell, fonts, meta tags
├─ netlify.toml                # Netlify build + SPA redirect config
├─ vite.config.js              # Vite + Tailwind plugin
├─ public/
│  └─ favicon.svg
└─ src/
   ├─ main.jsx                 # React entry point
   ├─ App.jsx                  # App state: view routing, fetching, search
   ├─ index.css                # Design tokens (colors/fonts) + Tailwind import
   ├─ api/
   │  └─ animechan.js          # Animechan API client (random / by anime / by character)
   ├─ data/
   │  └─ fallbackQuotes.js     # Offline quote pack (used if API fails)
   ├─ hooks/
   │  └─ useFavorites.js       # localStorage-backed favorites
   └─ components/
      ├─ Navbar.jsx
      ├─ Hero.jsx              # Headline + featured/shuffle quote + search
      ├─ SearchBar.jsx
      ├─ QuoteGrid.jsx
      ├─ QuoteCard.jsx         # The manga-panel quote card
      ├─ Loader.jsx            # Skeleton loading state
      ├─ EmptyState.jsx
      ├─ Footer.jsx
      └─ ScrollTopButton.jsx
```

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build locally
```

## Deploy

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - KOTOBA anime quotes"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

### 2. Deploy to Netlify

**Option A - Netlify dashboard (no CLI):**
1. Go to app.netlify.com -> **Add new site** -> **Import an existing project**.
2. Connect GitHub and pick your repo.
3. Build settings are auto-detected from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Click **Deploy site**.

**Option B - Netlify CLI:**
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

No environment variables are required - the Animechan API needs no key.

## Notes

- Everything is client-side; there's no server or database.
- Favorites persist in `localStorage`, per browser/device.
- Design: a manga-panel aesthetic (thick ink borders, offset "comic"
  shadows, halftone dots, Anton display type) rather than a generic
  dark-glass template - tune the palette in `src/index.css` under `@theme`.

---

Made with love by **RAJ**
