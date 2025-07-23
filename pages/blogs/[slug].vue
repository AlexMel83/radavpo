<template>
  <div v-if="post && !isLoading" class="max-w-3xl mx-auto py-8 px-4 bg-gray-50">
    <MetaTags
      :title="post.title || 'Блог'"
      :description="post.excerpt || 'Опис блогу'"
      :image="postImage"
      :url="`https://radavpo.starkon.pp.ua/blogs/${slug}`"
      :keywords="post.tags?.join(', ') || 'Рада ВПО, Старокостянтинів, блог, допомога ВПО'"
      :structured-data="structuredData"
    />
    <div class="text-center items-center mb-6">
      <NuxtLink to="/blogs" class="text-blue-600 hover:underline"> ← Назад до списку блогів </NuxtLink>
      <h1 class="text-3xl font-bold mb-4">
        {{ post.title }}
      </h1>
    </div>

    <BlogImages
      v-if="post.images"
      :images="post.images"
      :alt="post.title ? `${post.title} зображення` : 'Зображення блогу'"
    />
    <p class="text-gray-400 text-sm mb-4">
      {{ formatDate(post.created_at) }}
    </p>
    <div class="max-w-none" v-html="post.content" />

    <div class="flex justify-between mt-12">
      <UButton color="gray" variant="soft" :disabled="!prevPost?.slug" @click="navigateTo(`/blogs/${prevPost.slug}`)">
        ← Назад
      </UButton>
      <UButton color="gray" variant="soft" :disabled="!nextPost?.slug" @click="navigateTo(`/blogs/${nextPost.slug}`)">
        Вперед →
      </UButton>
    </div>
    <ShareButtons
      v-if="post.title"
      :page-object="{
        title: post.title,
        description: post.excerpt,
        image: postImage,
      }"
    />
  </div>
  <div v-else class="text-center py-20 text-gray-500">
    <p v-if="error">Помилка: {{ error.message }}</p>
    <p v-else>Запис не знайдено або ще завантажується.</p>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useAsyncData, useHead } from '#app';

const route = useRoute();
const { $api } = useNuxtApp();
const slug = route.params.slug;

const post = ref(null);
const isLoading = ref(true);
const error = ref(null);

// Використовуємо useAsyncData для SSR
const {
  data,
  pending,
  error: fetchError,
} = await useAsyncData(
  `post-${slug}`,
  async () => {
    try {
      const response = await $api.posts.getPosts(`?slug=${slug}&status=published`);
      if (!response.data?.[0]) {
        console.warn('No data found for slug:', slug);
        return null;
      }
      return response.data[0];
    } catch (err) {
      console.error('Error fetching post data:', err.message);
      console.error('Full error:', JSON.stringify(err, null, 2));
      return null;
    }
  },
  {
    server: true,
    lazy: false,
    immediate: true,
  },
);

// Синхронізуємо post.value, isLoading, і error
watch(
  [data, pending, fetchError],
  ([newData, newPending, newError]) => {
    post.value = newData;
    isLoading.value = newPending;
    error.value = newError;
  },
  { immediate: true },
);

// Використовуємо prev_slug і next_slug з даних поста
const prevPost = computed(() => ({
  slug: post.value?.prev_slug || null,
}));
const nextPost = computed(() => ({
  slug: post.value?.next_slug || null,
}));

// Додаємо <link rel="prev"> і <link rel="next"> для SEO
useHead({
  link: computed(() => [
    prevPost.value?.slug ? { rel: 'prev', href: `https://radavpo.starkon.pp.ua/blogs/${prevPost.value.slug}` } : {},
    nextPost.value?.slug ? { rel: 'next', href: `https://radavpo.starkon.pp.ua/blogs/${nextPost.value.slug}` } : {},
  ]),
});

// Compute the post image
const postImage = computed(() => {
  if (!post.value?.images) return 'https://radavpo.starkon.pp.ua/blog-images/cfhope-logo-transparent.png';
  const image = Array.isArray(post.value.images) ? post.value.images[0] : post.value.images;
  return `https://radavpo.starkon.pp.ua/blog-images/${image}`;
});

// Структуровані дані для SEO (JSON-LD)
const structuredData = computed(() => {
  if (!post.value) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.value.title || 'Блог',
    description: post.value.excerpt || 'Опис блогу',
    url: `https://radavpo.starkon.pp.ua/blogs/${slug}`,
    image: postImage.value,
    datePublished: post.value.created_at ? new Date(post.value.created_at).toISOString() : undefined,
    dateModified: post.value.updated_at ? new Date(post.value.updated_at).toISOString() : undefined,
    author: {
      '@type': 'Organization',
      name: 'Рада з питань ВПО при Старокостянтинівській міській раді',
      url: 'https://radavpo.starkon.pp.ua',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Рада з питань ВПО при Старокостянтинівській міській раді',
      logo: {
        '@type': 'ImageObject',
        url: 'https://radavpo.starkon.pp.ua/cfhope-logo-transparent.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://radavpo.starkon.pp.ua/blogs/${slug}`,
    },
    keywords: post.value.tags?.join(', ') || 'Рада ВПО, Старокостянтинів, блог, допомога ВПО',
  };
});

// Формат дати
function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
</script>
