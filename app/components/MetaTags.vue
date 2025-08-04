<template>
  <div />
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: 'Рада з питань ВПО' },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  url: { type: String, default: '' },
  keywords: { type: String, default: 'Рада ВПО, Старокостянтинів, допомога ВПО, партнерство' },
  structuredData: { type: Object, default: null },
});

// Базова URL (SSR-safe)
const config = useRuntimeConfig();
const reqUrl = useRequestURL();
const baseUrl = reqUrl.origin || config.public.baseURL || 'https://radavpo.starkon.pp.ua';

// Повна URL-адреса сторінки
const currentUrl = computed(() => (props.url ? props.url : baseUrl));

// Повна URL для зображення
const urlImage = computed(() => {
  if (!props.image) return 'https://radavpo.starkon.pp.ua/org-images/cfhope-logo-transparent.png';
  return props.image.startsWith('http')
    ? props.image
    : `${baseUrl}${props.image.startsWith('/') ? '' : '/'}${props.image}`;
});

useHead({
  htmlAttrs: {
    lang: 'uk',
    locale: 'uk',
  },
  title: props.title || 'Рада з питань ВПО',
  meta: [
    // Базові
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'robots', content: 'index, follow' },
    { name: 'description', content: props.description },
    { name: 'keywords', content: props.keywords },
    { name: 'author', content: 'Рада з питань ВПО при Старокостянтинівській міській раді' },
    // OpenGraph для Facebook та LinkedIn
    { property: 'og:type', content: 'article' },
    { property: 'og:site_name', content: 'Рада з питань ВПО при Старокостянтинівській міській раді' },
    { property: 'og:title', content: props.title },
    { property: 'og:description', content: props.description },
    { property: 'og:image', content: urlImage.value },
    { property: 'og:image:type', content: 'image/png' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:url', content: currentUrl.value },
    { property: 'og:locale', content: 'uk' },
    { property: 'fb:app_id', content: config.public.facebookAppId || '714008411407083' },
    // Twitter Cards
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: props.title },
    { name: 'twitter:description', content: props.description },
    { name: 'twitter:image', content: urlImage.value },
    { name: 'twitter:site', content: '@cfhope' },
    { name: 'twitter:creator', content: '@cfhope' },
    // Для Telegram/WhatsApp
    { name: 'theme-color', content: '#0057b7' },
  ],
  script: props.structuredData
    ? [
        {
          type: 'application/ld+json',
          children: JSON.stringify(props.structuredData),
        },
      ]
    : [],
});
</script>
