<template>
  <div />
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: 'Default Title' },
  description: { type: String, default: 'Default Description' },
  image: { type: String, default: '/cfhope-logo-tranparent.png' },
  url: { type: String, default: '' }, // optional override
});

// Базова URL (SSR-safe)
const config = useRuntimeConfig();
const reqUrl = useRequestURL();
const baseUrl = reqUrl.origin || config.public.baseURL || 'https://radavpo.starkon.pp.ua';

// Повна URL-адреса сторінки
const currentUrl = computed(() => {
  if (props.url) return props.url;

  if (process.server) {
    const reqUrl = useRequestURL();
    return reqUrl.href;
  }

  if (process.client) {
    return window.location.href;
  }

  return baseUrl;
});

// Повна URL для зображення
const urlImage = computed(() => (props.image.startsWith('http') ? props.image : baseUrl + props.image));

// Генерація мета-тегів
watchEffect(() => {
  useHead({
    htmlAttrs: { lang: 'uk' },
    title: props.title,
    meta: [
      { name: 'description', content: props.description },
      { name: 'robots', content: 'index, follow' },
      { name: 'theme-color', content: '#0057b7' },

      // Open Graph
      { property: 'og:type', content: 'article' },
      { property: 'og:site_name', content: 'Рада ВПО' },
      { property: 'og:title', content: props.title },
      { property: 'og:description', content: props.description },
      { property: 'og:image', content: urlImage.value },
      { property: 'og:image:alt', content: props.title },
      { property: 'og:url', content: currentUrl.value },
      { property: 'og:locale', content: 'uk_UA' },
      { property: 'fb:app_id', content: config.public.facebookAppId },

      // Twitter
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: props.title },
      { name: 'twitter:description', content: props.description },
      { name: 'twitter:image', content: urlImage.value },
      { name: 'twitter:image:alt', content: props.title },
      { name: 'twitter:site', content: '@cfhope' },
      { name: 'twitter:creator', content: '@cfhope' },
    ],
    link: [{ rel: 'canonical', href: currentUrl.value }],
  });
});
</script>
