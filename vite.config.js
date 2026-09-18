import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'KOTOBA — Anime Quotes',
        short_name: 'KOTOBA',
        description: 'Anime quotes, panel by panel — browse, search and save your favorite lines.',
        theme_color: '#14110F',
        background_color: '#F5EFE1',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // App shell + build assets are precached automatically.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        runtimeCaching: [
          {
            // Random / search quote calls — try the network first (fresh
            // quotes), fall back to the cache when offline or rate-limited.
            urlPattern: ({ url }) => url.hostname === 'api.animechan.io',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'animechan-api',
              networkTimeoutSeconds: 4,
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Anime cover art lookups.
            urlPattern: ({ url }) => url.hostname === 'api.jikan.moe',
            handler: 'CacheFirst',
            options: {
              cacheName: 'jikan-api',
              expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // The poster images themselves.
            urlPattern: ({ url }) => url.hostname.includes('myanimelist.net'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'anime-posters',
              expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
})
