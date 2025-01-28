import { defineNuxtConfig } from 'nuxt/config';
import 'dotenv/config';

export default defineNuxtConfig({
  ssr: true,
  nitro: {
    preset:
      process.env.NUXT_PUBLIC_IS_DOCKER === 'true'
        ? 'node-server'
        : 'cloudflare-pages',
    static: process.env.NUXT_PUBLIC_IS_DOCKER === 'true' ? false : true,
    publicAssets: [
      {
        dir: 'public',
        maxAge: 60 * 60 * 24 * 365,
      },
    ],
    prerender: {
      routes: ['/howtohelp',
      '/privacy-policy',
      '/terms',],
    },
  },
  plugins: [
    '~/plugins/axios.js',
    // '~/plugins/errorHandler.js',
    // '~/plugins/google-maps.js',
  ],
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    target: 'esnext',
    supported: {
      optionalChaining: true,
    },
  },
  build: {
    transpile: ['@nuxt/ui'], // if using Nuxt UI
  },
  devtools: { enabled: true },
  css: ['~/assets/src/tailwind.css', '~/assets/src/styles.css'],
  modules: [
    '@nuxt/ui',
    '@formkit/auto-animate/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    // '@nuxtjs/leaflet',
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@pinia/nuxt',
  ],
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
  // leaflet: {
  //   markerCluster: true,
  // },
  colorMode: {
    preference: 'light',
  },
  i18n: {
    locales: [
      { code: 'en', name: 'EN' },
      { code: 'uk', name: 'UA' },
    ],
    vueI18n: './i18n/i18n.config.ts',
    defaultLocale: 'uk',
    strategy: 'prefix_except_default',
      useCookie: false, 
      redirectOn: 'no',
      fallbackLocale: 'uk', 
    },
  app: {
    head: {
      htmlAttrs: {
        lang: 'uk',
      },
      meta: [
        { charset: 'UTF-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        { name: 'robots', content: 'width=device-width, initial-scale=1' },
        { property: 'og:locale', content: 'uk_UA' },
        { property: 'og:type', content: 'article' },
        { property: 'og:site_name', content: 'The Council of the IDPs' },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
          integrity: 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=',
          crossorigin: '',
        },
        {
          rel: 'icon',
          type: 'image/png',
          href: '/icons/favicon.png',
        },
      ],
      script: [
        // {
        //   src: 'https://www.googletagmanager.com/gtag/js?id=G-FZVJ94GP97',
        //   async: true,
        // },
        // {
        //   children: `
        //     window.dataLayer = window.dataLayer || [];
        //     function gtag(){dataLayer.push(arguments);}
        //     gtag('js', new Date());
        //     gtag('config', 'G-FZVJ94GP97');
        //   `,
        // },
      ],
    },
  },
  runtimeConfig: {
    public: {
      apiKeyMapbox: process.env.APIKEY_MAPBOX,
      apiBase: process.env.API_BASE_URL || 'https://api.memory.pp.ua',
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      isDocker: process.env.NUXT_PUBLIC_IS_DOCKER || 'false',
      gtagId: process.env.NUXT_PUBLIC_GTAG_ID || 'G-6RYNGNQ3ZB',
    },
    private: {
      // Значения здесь доступны только на стороне сервера
    },
  },
  devServer: {
    port: parseInt(process.env.NUXT_PORT as string, 10) || 3000,
    host: process.env.NUXT_HOST || '0.0.0.0',
  },
  vite: {
    server: {
      hmr: {
        protocol: 'wss',
        host: 'radavpo.starkon.pp.ua',
        port: parseInt(process.env.NUXT_PORT as string, 10) || 3000,
      },
    },
  },
  compatibilityDate: '2024-08-13',
});
