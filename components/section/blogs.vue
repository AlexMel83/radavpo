<template>
  <section class="py-6 px-4 bg-white">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-2xl font-bold text-center mb-10">
        {{ $t('Index.news') }}
      </h2>

      <!-- Состояние загрузки -->
      <div v-if="pending" class="text-center py-10">
        <p class="text-gray-600">Завантаження...</p>
      </div>
      <!-- Состояние ошибки -->
      <div v-else-if="error" class="text-center py-10">
        <p class="text-red-600">Помилка при завантаженні постів: {{ error.message }}</p>
      </div>
      <!-- Состояние пустых данных -->
      <div v-else-if="!chunkedPosts.length" class="text-center py-10">
        <p class="text-gray-600">Пости не знайдено</p>
      </div>

      <!-- Карусель -->
      <ClientOnly>
        <div v-if="chunkedPosts.length" class="relative">
          <!-- Стрілка вліво -->
          <button
            class="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2"
            aria-label="Попередні"
            :disabled="currentIndex === 0"
            @click="prevSlide"
          >
            ◀
          </button>

          <div class="overflow-hidden">
            <div
              class="flex transition-transform duration-500 ease-in-out"
              :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
            >
              <div
                v-for="(chunk, i) in chunkedPosts"
                :key="i"
                class="flex-shrink-0 w-full flex flex-wrap justify-center gap-4 sm:gap-6"
              >
                <UCard
                  v-for="post in chunk"
                  :key="post.slug"
                  class="w-full sm:w-[32%] md:w-[25%] hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 group p-2"
                  :ui="{
                    base: 'flex flex-col overflow-hidden',
                    body: 'p-4 flex flex-col flex-grow',
                  }"
                >
                  <NuxtLink :to="`/blogs/${post.slug}`">
                    <div class="h-48 w-full bg-white overflow-hidden flex items-center justify-center">
                      <img
                        :src="getImage(post.images)"
                        :alt="post.title"
                        class="w-full h-full object-cover rounded transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </NuxtLink>

                  <div class="mt-4 flex flex-col justify-between flex-grow">
                    <NuxtLink :to="`/blogs/${post.slug}`">
                      <h3 class="text-lg font-semibold text-gray-800 leading-tight hover:underline mb-2">
                        {{ post.title }}
                      </h3>
                    </NuxtLink>

                    <p class="text-sm text-gray-600 line-clamp-4 mb-2">
                      {{ post.excerpt }}
                    </p>

                    <p class="text-xs text-gray-400 mt-auto">
                      {{ formatDate(post.created_at) }}
                    </p>
                  </div>
                </UCard>
              </div>
            </div>
          </div>

          <!-- Стрілка вправо -->
          <button
            class="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2"
            aria-label="Наступні"
            :disabled="currentIndex >= chunkedPosts.length - 1"
            @click="nextSlide"
          >
            ▶
          </button>
        </div>
      </ClientOnly>

      <!-- Пагинация -->
      <div v-if="chunkedPosts.length > 0" class="flex justify-between mt-8">
        <UButton
          color="gray"
          variant="soft"
          :disabled="currentPage === 1"
          @click="currentPage = Math.max(1, currentPage - 1)"
        >
          ← Попередня
        </UButton>
        <span class="text-gray-600">Сторінка {{ currentPage }} з {{ totalPages }}</span>
        <UButton color="gray" variant="soft" :disabled="currentPage >= totalPages" @click="currentPage += 1">
          Наступна →
        </UButton>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useAsyncData, useRoute, useRouter, useRequestURL } from '#app';

const route = useRoute();
const router = useRouter();
const { origin } = useRequestURL();
const currentPage = ref(Number(route.query.page) || 1);
const postsPerPage = 9;
const totalPosts = ref(0);
const currentIndex = ref(0);

const {
  data: postsDataApi,
  pending,
  error,
} = await useAsyncData(
  `posts-page-${currentPage.value}`,
  async () => {
    try {
      const query = `?status=published&limit=${postsPerPage}&offset=${(currentPage.value - 1) * postsPerPage}&sort_field=created_at&sortDirection=desc`;
      const { $api } = useNuxtApp();
      const response = await $api.posts.getPosts(query);
      totalPosts.value = parseInt(response.total_count, 10) || 0;
      return response.data || [];
    } catch (err) {
      totalPosts.value = 0;
      throw err;
    }
  },
  {
    server: true,
    lazy: false,
    default: () => [],
    watch: [currentPage],
  },
);

const posts = computed(() => {
  const postArray = postsDataApi.value?.data || [];
  if (!Array.isArray(postArray)) return [];
  return postArray.map((post) => ({
    ...post,
    images: post.images || ['default-preview.jpg'],
  }));
});

const windowWidth = ref(process.client ? window.innerWidth : 1024);

if (process.client) {
  window.addEventListener('resize', () => (windowWidth.value = window.innerWidth), { passive: true });
}

const chunkSize = computed(() => {
  if (windowWidth.value < 640) return 1;
  if (windowWidth.value < 868) return 2;
  return 3;
});

const chunkedPosts = computed(() => {
  if (!posts.value.length) return [];
  const chunks = [];
  for (let i = 0; i < posts.value.length; i += chunkSize.value) {
    chunks.push(posts.value.slice(i, i + chunkSize.value));
  }
  return chunks;
});

function prevSlide() {
  if (currentIndex.value > 0) currentIndex.value--;
}

function nextSlide() {
  if (currentIndex.value < chunkedPosts.value.length - 1) currentIndex.value++;
}

const totalPages = computed(() => Math.ceil(totalPosts.value / postsPerPage));

watch(currentPage, () => {
  router.replace({ query: { page: currentPage.value > 1 ? currentPage.value : undefined } });
});

function getImage(images) {
  const base = `${origin}/blog-images/`;
  if (!images || !images.length) return `${origin}/blog-images/default-preview.jpg`;
  return base + images[0];
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
</script>

<style scoped>
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
