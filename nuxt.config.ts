import { defineNuxtConfig } from 'nuxt/config';
import 'dotenv/config';

export default defineNuxtConfig({
  ssr: true,
  devServer: {
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
    host: process.env.NUXT_HOST || '0.0.0.0'
  },
  nitro: {
    compressPublicAssets: true,
    publicAssets: [
      {
        dir: 'public',
        maxAge: 60 * 60 * 24 * 365,
      },
    ],
    devProxy: {
      "/api/alerts": {
        target: "https://api.ukrainealarm.com/api/v3/alerts/1396",
        changeOrigin: true,
        headers: { "X-API-Key": "e3434354546456" }
      },
    },
    prerender: {
      routes: ['/'],
    },
    routeRules: {
      '/blog-images/**': {
        headers: {
          'cache-control': 'public, max-age=31536000, immutable',
        },
      },
      '/org-images/**': {
        headers: {
          'cache-control': 'public, max-age=31536000, immutable',
        },
      },
      '/icons/**': {
        headers: {
          'cache-control': 'public, max-age=31536000, immutable',
        },
      },
    },
  },
  plugins: [
    '~/plugins/axios.js',
  ],
  build: {
    transpile: ['@nuxt/ui'], // if using Nuxt UI
  },
  devtools: { enabled: false },
  css: ['~/assets/src/styles.css'],
  modules: [
    '@nuxt/ui',
    '@formkit/auto-animate/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    'nuxt-gtag',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@pinia/nuxt',
    '@nuxt/icon',
  ],
  gtag: {
    id: 'G-SFWPTFCSK7',
    loadingStrategy: 'defer',
  },
  robots: {
    allow: '/',
    sitemap: 'https://radavpo.starkon.pp.ua/sitemap.xml',
  },  
  // image: {
  //   dir: 'public',
  //   format: ['webp', 'avif'],
  // },
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
    config: {
      content: [
        './components/**/*.{js,vue,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './app.vue',
        './error.vue',
      ],
      theme: {
        extend: {},
      },
    },
  },
  colorMode: {
    preference: 'light',
  },
  i18n: {
    locales: [
      { code: 'uk', name: 'UA' },
      { code: 'en', name: 'EN' },
    ],
    vueI18n: 'i18n.config.ts',
    defaultLocale: 'uk',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
  },
   app: {
      head: {
        link: [
          { rel: 'preconnect', href: 'https://www.googletagmanager.com', crossorigin: '' },
          { rel: 'preconnect', href: 'https://maps.googleapis.com', crossorigin: '' },
          { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
          { rel: 'icon', type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
          { rel: 'icon', type: "image/png", sizes: "36x16", href: "/favicon-16x16.png" },
          { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: "180x180" },
        ],
      },
    },
  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL || 'https://radavpo.starkon.pp.ua',
      apiBase: process.env.API_BASE || 'api-vpo.starkon.pp.ua',
      isDocker: process.env.NUXT_PUBLIC_IS_DOCKER || 'false',
      API_URL: process.env.API_BASE || 'https://api-vpo.starkon.pp.ua',
      API_KEY: process.env.API_KEY,
      gtagId: process.env.NUXT_PUBLIC_GTAG_ID || 'G-6RYNGNQ3ZB',
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      googleMapsApiKeyStatic: process.env.GOOGLE_MAPS_API_KEY_STATIC,
      facebookAppId: process.env.FACEBOOK_APP_ID,
    },
  },
  compatibilityDate: '2025-01-29',
});
