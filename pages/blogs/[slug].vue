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

    <BlogImages :images="post.images" :alt="post.title ? `${post.title} зображення` : 'Зображення блогу'" />
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
    <p v-if="error || fetchError">Помилка: {{ error?.message || fetchError?.message || 'Запис не знайдено' }}</p>
    <p v-else>Запис ще завантажується...</p>
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

if (!slug) {
  error.value = new Error('Slug is missing in route parameters');
}

const {
  data,
  pending,
  error: fetchError,
} = await useAsyncData(
  `post-${slug}`,
  async () => {
    try {
      const query = `?slug=${slug}&status=published`;
      const response = await $api.posts.getPosts(query);
      if (!Array.isArray(response.data.data) || response.data.data.length === 0) {
        throw new Error(`Post with slug ${slug} not found or not published`);
      }
      return response.data.data[0];
    } catch (err) {
      console.error('Error fetching post data:', err.message);
      return null;
    }
  },
  {
    server: true,
    lazy: false,
    immediate: true,
  },
);

watch(
  [data, pending, fetchError],
  ([newData, newPending, newError]) => {
    post.value = newData;
    isLoading.value = newPending;
    error.value = newError;
  },
  { immediate: true },
);

const prevPost = computed(() => ({
  slug: post.value?.prev_slug || null,
}));
const nextPost = computed(() => ({
  slug: post.value?.next_slug || null,
}));

useHead({
  link: computed(() => [
    prevPost.value?.slug ? { rel: 'prev', href: `https://radavpo.starkon.pp.ua/blogs/${prevPost.value.slug}` } : {},
    nextPost.value?.slug ? { rel: 'next', href: `https://radavpo.starkon.pp.ua/blogs/${nextPost.value.slug}` } : {},
  ]),
});

const postImage = computed(() => {
  if (!post.value?.images) return 'https://radavpo.starkon.pp.ua/blog-images/cfhope-logo-transparent.png';
  const image = Array.isArray(post.value.images) ? post.value.images[0] : post.value.images;
  return image
    ? `https://radavpo.starkon.pp.ua/blog-images/${image}`
    : 'https://radavpo.starkon.pp.ua/blog-images/cfhope-logo-transparent.png';
});

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

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
</script>
