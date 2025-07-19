<template>
  <div />
</template>

<script setup>
const props = defineProps({
  url: { type: String, default: '' },
  title: { type: String, default: 'Default Title' },
  description: { type: String, default: 'Default Description' },
  image: { type: String, default: '/cfhope-logo-tranparent.png' },
});

const config = useRuntimeConfig().public;
const baseUrl = config.baseURL || 'https://radavpo.starkon.pp.ua';

const urlImage = computed(() => (props.image.startsWith('http') ? props.image : baseUrl + props.image));

// 🧩 Автовизначення повної URL-адреси сторінки
const currentUrl = computed(() => {
  if (props.url) return props.url;

  if (process.server) {
    const reqUrl = useRequestURL();
    return reqUrl.href; // Абсолютна адреса з хостом
  }

  if (process.client) {
    return window.location.href;
  }

  return baseUrl; // fallback
});

useHead({
  htmlAttrs: {
    lang: 'uk',
  },
  title: props.title,
  meta: [
    { name: 'description', content: props.description },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:type', content: 'article' },
    { property: 'og:site_name', content: 'Рада ВПО' },
    { property: 'og:title', content: props.title },
    { property: 'og:description', content: props.description },
    { property: 'og:image', content: urlImage.value },
    { property: 'og:image:type', content: 'image/png' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:url', content: currentUrl.value },

    { property: 'fb:app_id', content: config.facebookAppId },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: props.title },
    { name: 'twitter:description', content: props.description },
    { name: 'twitter:image', content: urlImage.value },
    { name: 'twitter:site', content: '@cfhope' },
    { name: 'twitter:creator', content: '@cfhope' },
    { name: 'theme-color', content: '#0057b7' },
  ],
});
</script>
