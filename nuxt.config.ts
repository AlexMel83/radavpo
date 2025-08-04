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
      }
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
  css: ['~/assets/src/tailwind.css', '~/assets/src/styles.css'],
  modules: [
    '@nuxt/ui',
    '@formkit/auto-animate/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@pinia/nuxt',
    'shadcn-nuxt',
    '@nuxt/icon',
  ],
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  image: {
    dir: 'public',
    format: ['webp', 'avif'],
  },
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
    defaultLocale: "uk",
    locales: [
      { code: "uk", iso: "uk-UA", name: "Українська", file: "uk.json" },
      { code: "en", iso: "en-US", name: "English", file: "en.json" },
    ],
    strategy: "prefix_except_default",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
      alwaysRedirect: false,
    },
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
        { property: 'og:locale', content: 'uk' },
        { property: 'og:type', content: 'article' },
        { property: 'og:site_name', content: 'Рада з питань ВПО при Старокостянтинівський міський раді' },
        { name: 'google-site-verification', content: '4oenAoJxtD-JUqm5e3ajGvAigOo9BTUQluabs7_6jBY' },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/icons/favicon.png',
        },
      ],
      script: [
        {
          src: 'https://www.googletagmanager.com/gtag/js?id=G-SFWPTFCSK7',
          async: true,
        },
        {
          innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SFWPTFCSK7');
          `,
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || 'api-vpo.starkon.pp.ua',
      isDocker: process.env.NUXT_PUBLIC_IS_DOCKER || 'false',
      API_URL: process.env.API_BASE || 'https://api-vpo.starkon.pp.ua',
      API_KEY: process.env.API_KEY,
      gtagId: process.env.NUXT_PUBLIC_GTAG_ID || 'G-6RYNGNQ3ZB',
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      facebookAppId: process.env.FACEBOOK_APP_ID,
    },
  },
  compatibilityDate: '2025-01-29',
});