<template>
  <div class="p-4 max-w-3xl mx-auto">
    <MetaTags
      title="Блог | Рада з питань ВПО при Старокостянтинівській міській раді"
      description="Останні новини, статті та освітні матеріали про підтримку ВПО у Старокостянтинові"
      :image="`${origin}/blog-images/default-preview.jpg`"
      url="https://radavpo.starkon.pp.ua/blogs"
      keywords="Рада ВПО, Старокостянтинів, блог, допомога ВПО, освіта"
      :structured-data="structuredData"
    />
    <h1 class="text-3xl font-bold mb-6 text-center">Блог</h1>
    <div v-if="isLoading" class="text-center py-10 text-gray-500">Завантаження...</div>
    <div v-else-if="error" class="text-center py-10 text-red-600">
      Помилка при завантаженні постів: {{ error.message }}
    </div>
    <div v-else-if="posts.length === 0 && !isLoading" class="text-center py-10 text-gray-500">Пости не знайдено.</div>
    <ul v-else class="grid gap-6">
      <li
        v-for="post in posts"
        :key="post.slug"
        class="bg-white rounded-lg shadow-md overflow-hidden transition hover:shadow-lg"
      >
        <NuxtLink :to="`/blogs/${post.slug}`" class="block hover:bg-gray-50 transition">
          <img
            :src="getImage(post)"
            :alt="post.title ? `${post.title} зображення` : 'Зображення блогу'"
            class="w-full h-48 object-cover"
            loading="lazy"
          />
          <div class="p-4">
            <h2 class="text-xl font-semibold mb-2 text-blue-600">
              {{ post.title }}
            </h2>
            <p class="text-sm text-gray-600 mb-2 line-clamp-2">
              {{ post.excerpt }}
            </p>
            <p class="text-xs text-gray-400">
              {{ formatDate(post.created_at) }}
            </p>
          </div>
        </NuxtLink>
      </li>
    </ul>
    <div v-if="posts.length > 0" class="flex justify-between mt-8">
      <UButton
        color="gray"
        variant="soft"
        :disabled="currentPage === 1"
        @click="currentPage = Math.max(1, currentPage - 1)"
      >
        ← Попередня
      </UButton>
      <span class="text-gray-600">Сторінка {{ currentPage }} з {{ totalPages }}</span>
      <UButton color="gray" variant="soft" :disabled="currentPage >= totalPages" @click="nextPage">
        Наступна →
      </UButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter, useAsyncData, useRequestURL, useHead, useState } from '#app';

const route = useRoute();
const router = useRouter();
const { $api } = useNuxtApp();
const { origin } = useRequestURL();

const currentPage = ref(1);
const postsPerPage = 5;
const totalPosts = useState('totalPosts', () => 0);

currentPage.value = Number(route.query.page) || 1;

const {
  data: postsDataApi,
  pending: isLoading,
  error,
  refresh,
} = useAsyncData(
  `posts-page-${currentPage.value}`,
  async () => {
    try {
      const query = `?status=published&limit=${postsPerPage}&offset=${(currentPage.value - 1) * postsPerPage}&sort_field=created_at&sortDirection=desc`;
      const response = await $api.posts.getPosts(query);
      totalPosts.value = parseInt(response.data.total_count, 10) || 0;
      return response.data.data || [];
    } catch (err) {
      console.error('Error fetching posts:', err.message);
      console.error('Error details:', err);
      totalPosts.value = 0;
      return [];
    }
  },
  {
    server: true,
    lazy: false,
    immediate: true,
    watch: [currentPage],
    default: () => [],
  },
);

const posts = computed(() => {
  if (postsDataApi.value == null) {
    console.warn('postsDataApi.value is null or undefined, returning empty array');
    return [];
  }
  if (!Array.isArray(postsDataApi.value)) {
    console.error('postsDataApi.value is not an array:', postsDataApi.value);
    return [];
  }
  return postsDataApi.value.map((post) => ({
    ...post,
    images: post.images || null,
  }));
});

const totalPages = computed(() => {
  const pages = Math.ceil(totalPosts.value / postsPerPage);
  return pages;
});

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
  }
}

useHead({
  link: computed(() => {
    const links = [];
    if (currentPage.value < totalPages.value) {
      links.push({
        rel: 'next',
        href: `${origin}/blogs?page=${currentPage.value + 1}`,
      });
    }
    if (currentPage.value > 1) {
      links.push({
        rel: 'prev',
        href: `${origin}/blogs${currentPage.value - 1 > 1 ? `?page=${currentPage.value - 1}` : ''}`,
      });
    }
    return links;
  }),
});

watch(currentPage, () => {
  router.replace({ query: { page: currentPage.value > 1 ? currentPage.value : undefined } });
});

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'Блог Ради ВПО',
  description: 'Останні новини, статті та освітні матеріали про підтримку ВПО у Старокостянтинові',
  url: `${origin}/blogs`,
  publisher: {
    '@type': 'Organization',
    name: 'Рада з питань ВПО при Старокостянтинівській міській раді',
    logo: {
      '@type': 'ImageObject',
      url: `${origin}/cfhope-logo-transparent.png`,
    },
  },
}));

if (process.client) {
  onMounted(async () => {
    if (!postsDataApi.value && !isLoading.value) {
      await refresh();
    }
  });
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getImage(post) {
  const fallback = `${origin}/blog-images/default-preview.jpg`;
  if (!post.images) return fallback;
  if (Array.isArray(post.images)) {
    return post.images.length > 0 ? `${origin}/blog-images/${post.images[0]}` : fallback;
  }
  return post.images ? `${origin}/blog-images/${post.images}` : fallback;
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
