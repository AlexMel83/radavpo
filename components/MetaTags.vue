<template>
  <div />
</template>

<script setup>
const { url, title, description, image } = defineProps({
  url: {
    type: String,
    required: false,
    default: '',
  },
  title: {
    type: String,
    required: false,
    default: 'Default Title',
  },
  description: {
    type: String,
    required: false,
    default: 'Default Description',
  },
  image: {
    type: String,
    required: false,
    default: '/cfhope-logo-tranparent.png',
  },
});

const store = useAppStore();

const baseUrl =
  store.baseURL === 'https://radavpo_apidev.starkon.pp.ua'
    ? 'https://radavpo_dev.starkon.pp.ua'
    : 'https://radavpo.starkon.pp.ua';

const urlImage = computed(() => {
  return image.startsWith('http') ? image : baseUrl + image;
});

useHead({
  htmlAttrs: {
    lang: 'uk',
  },
  title,
  meta: [
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: urlImage.value },
    { property: 'og:url', content: url },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: urlImage.value },
  ],
});

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: urlImage.value,
});
</script>
