// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  ssr: false,
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxtjs/tailwindcss',
    '@vite-pwa/nuxt',
  ],
  css: ['~/assets/css/reset.css', '~/assets/css/tailwind.css', '~/assets/css/main.css'],
  tailwindcss: {
    // Options
  },
  pwa: {
    manifest: {
      "name": "Do your Daily Tracker",
      "short_name": "DyDaily",
      "start_url": "/",
      "icons": [
        {
          "src": "/android-chrome-192x192.png",
          "sizes": "192x192",
          "type": "image/png"
        },
        {
          "src": "/android-chrome-512x512.png",
          "sizes": "512x512",
          "type": "image/png"
        }
      ],
      "theme_color": "#06b6d4",
      "background_color": "#ffffff",
      "display": "standalone"
    },
    registerWebManifestInRouteRules: true,
    devOptions: {
      enabled: true
    },
    strategies: 'generateSW',
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      navigateFallback: '/',
    }
  },
});
