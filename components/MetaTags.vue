<template>
  <div />
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  url: { type: String, default: '' }, // optional override
});
console.log('MetaTags props:', props);

// Базова URL (SSR-safe)
const config = useRuntimeConfig();
const reqUrl = useRequestURL();
const baseUrl = reqUrl.origin || config.public.baseURL || 'https://radavpo.starkon.pp.ua';

// Повна URL-адреса сторінки
const currentUrl = computed(() => {
  if (props.url) return props.url;

  return baseUrl;
});

// Повна URL для зображення
const urlImage = computed(() => (props.image.startsWith('http') ? props.image : baseUrl + props.image));

useHead({
  htmlAttrs: {
    lang: 'uk',
    locale: 'uk',
    title: computed(() => partner.value?.title || 'Партнер'),
  },
  meta: [
    // базові
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'robots', content: 'index, follow' },
    { name: 'description', content: props.description },
    { name: 'keywords', content: 'Рада ВПО, Старокостянтинів, допомога ВПО, партнерство' },
    { name: 'author', content: 'Рада з питань ВПО при Старокостянтинівський міський раді' },
    // OpenGraph для Facebook та LinkedIn
    { property: 'og:type', content: 'article' },
    { property: 'og:site_name', content: 'Рада з питань ВПО при Старокостянтинівський міський раді' }, // або назва проєкту
    { property: 'og:title', content: props.title },
    { property: 'og:description', content: props.description },
    { property: 'og:image', content: urlImage.value },
    { property: 'og:image:type', content: 'image/png' }, // або image/jpeg
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:url', content: currentUrl.value },
    { property: 'og:locale', content: 'uk' }, // або 'uk' для української
    // Facebook специфіка
    { property: 'fb:app_id', content: config.public.facebookAppId },
    // Twitter Cards
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: props.title },
    { name: 'twitter:description', content: props.description },
    { name: 'twitter:image', content: urlImage.value },
    { name: 'twitter:site', content: '@cfhope' }, // якщо є акаунт
    { name: 'twitter:creator', content: '@cfhope' }, // якщо є акаунт
    // для telegram / whatsapp
    { name: 'theme-color', content: '#0057b7' }, // покращує вигляд лінку в месенджерах
  ],
});
</script>
