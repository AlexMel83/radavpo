<template>
  <section class="py-6 px-4 bg-white">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-2xl font-bold text-center mb-10">
        {{ $t('Index.news') }}
      </h2>

      <div>
        <div v-if="pending" class="text-center py-10">
          <p class="text-gray-600">Завантаження...</p>
        </div>

        <div v-else-if="error" class="text-center py-10">
          <p class="text-red-600">Помилка при завантаженні постів: {{ error.message }}</p>
          <button class="mt-2 px-4 py-2 bg-blue-500 text-white rounded" @click="refresh">Спробувати знову</button>
        </div>

        <div v-else-if="posts.length === 0" class="text-center py-10">
          <p class="text-gray-600">Пости не знайдено</p>
        </div>

        <div v-else ref="carousel" class="relative">
          <button
            v-if="isMounted && totalPages > 1"
            class="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 transition-opacity"
            aria-label="Попередні"
            :disabled="currentPage === 1 || pending"
            @click="prevSlide"
          >
            ◀
          </button>

          <div class="overflow-hidden">
            <div
              class="flex transition-transform duration-500 ease-in-out"
              :style="{ transform: `translateX(-${(currentPage - 1) * (100 / postsPerPage.valueOf)}%)` }"
            >
              <div
                v-if="posts.length > 0"
                :key="`carousel-${currentPage}`"
                class="flex-shrink-0 w-full flex justify-center gap-4"
                :style="{ width: `${100 * postsPerPage.valueOf}%` }"
              >
                <div
                  v-for="post in posts"
                  :key="post.slug || post.id"
                  class="w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.666rem)] p-2"
                >
                  <UCard
                    class="hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 group"
                    :ui="{
                      base: 'flex flex-col overflow-hidden',
                      body: 'p-4 flex flex-col flex-grow',
                    }"
                  >
                    <NuxtLink :to="`/blogs/${post.slug}`">
                      <div class="h-48 w-full bg-white overflow-hidden flex items-center justify-center">
                        <img
                          :src="getImage(post.images)"
                          :alt="post.title || 'Post image'"
                          class="w-full h-full object-cover rounded transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </NuxtLink>

                    <div class="mt-4 flex flex-col justify-between flex-grow p-2">
                      <NuxtLink :to="`/blogs/${post.slug}`">
                        <h3 class="text-lg font-semibold text-gray-800 leading-tight hover:underline mb-2">
                          {{ post.title || 'Untitled' }}
                        </h3>
                      </NuxtLink>

                      <p class="text-sm text-gray-600 line-clamp-4 mb-2">
                        {{ post.excerpt || 'No excerpt available' }}
                      </p>

                      <p class="text-xs text-gray-400 mt-auto">
                        {{ formatDate(post.created_at) }}
                      </p>
                    </div>
                  </UCard>
                </div>
              </div>
            </div>
          </div>

          <button
            v-if="isMounted && totalPages > 1"
            class="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 transition-opacity"
            aria-label="Наступні"
            :disabled="currentPage >= totalPages || pending"
            @click="nextSlide"
          >
            ▶
          </button>
        </div>

        <div v-if="posts.length > 0 && isMounted && totalPages > 1" class="flex justify-between items-center mt-8">
          <UButton color="gray" variant="soft" :disabled="currentPage === 1 || pending" @click="prevSlide">
            ← Попередня
          </UButton>
          <span class="text-gray-600">Сторінка {{ currentPage }} з {{ totalPages }}</span>
          <UButton color="gray" variant="soft" :disabled="currentPage >= totalPages || pending" @click="nextSlide">
            Наступна →
          </UButton>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const route = useRoute();

// Инициализация currentPage
const initialPage = Math.max(1, Number(route.query.page) || 1);
const currentPage = ref(initialPage);

const getInitialPostsPerPage = () => {
  if (process.server) return 3;
  if (typeof window !== 'undefined') {
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 868) return 2;
    return 3;
  }
  return 3;
};

const postsPerPage = ref(getInitialPostsPerPage());
const totalPosts = useState('totalPosts', () => 0);
const isMounted = ref(false);

const totalPages = computed(() => {
  if (!totalPosts.value || !postsPerPage.value) return 1;
  return Math.max(1, Math.ceil(totalPosts.value / postsPerPage.value));
});

const fetchPosts = async () => {
  try {
    const offset = Math.max(0, (currentPage.value - 1) * postsPerPage.value);
    const query = `?status=published&limit=${postsPerPage.value}&offset=${offset}&sort_field=created_at&sortDirection=desc`;

    const { $api } = useNuxtApp();
    const response = await $api.posts.getPosts(query);

    if (!response?.data?.data) {
      throw new Error('No posts data received from API');
    }

    const newTotalPosts = parseInt(response.data.total_count, 10) || 0;
    totalPosts.value = newTotalPosts;

    const maxPages = Math.max(1, Math.ceil(newTotalPosts / postsPerPage.value));
    if (currentPage.value > maxPages) {
      currentPage.value = Math.max(1, maxPages);
      return await fetchPosts();
    }
    const posts = response.data.data || [];
    return posts;
  } catch (err) {
    console.error('Error fetching posts:', err);
    totalPosts.value = 0;
    throw err;
  }
};

const {
  data: postsDataApi,
  pending,
  error,
  refresh,
} = await useAsyncData(`posts-carousel-${currentPage.value}-${postsPerPage.value}`, fetchPosts, {
  server: true,
  // default: () => [],
});

const posts = computed(() => {
  if (!postsDataApi.value) {
    return [];
  }
  const postArray = Array.isArray(postsDataApi.value) ? postsDataApi.value : postsDataApi.value?.data || [];

  const processedPosts = postArray.map((post) => ({
    ...post,
    images: post.images || ['default-preview.jpg'],
  }));

  return processedPosts;
});

async function prevSlide() {
  if (pending.value || currentPage.value <= 1) return;

  try {
    currentPage.value = Math.max(1, currentPage.value - 1);
    await refresh();
    // Принудительное обновление DOM
    await nextTick();
  } catch (err) {
    console.error('Error in prevSlide:', err);
    currentPage.value = Math.min(totalPages.value, currentPage.value + 1);
  }
}

async function nextSlide() {
  if (pending.value || currentPage.value >= totalPages.value) return;

  try {
    currentPage.value = Math.min(totalPages.value, currentPage.value + 1);
    await refresh();
    // Принудительное обновление DOM
    await nextTick();
  } catch (err) {
    console.error('Error in nextSlide:', err);
    currentPage.value = Math.max(1, currentPage.value - 1);
  }
}

const touchStartX = ref(0);
const touchEndX = ref(0);
const carousel = ref(null);

function handleSwipe() {
  const swipeDistance = touchStartX.value - touchEndX.value;
  const minSwipeDistance = 50;

  if (Math.abs(swipeDistance) < minSwipeDistance) return;

  if (swipeDistance > 0) {
    nextSlide();
  } else {
    prevSlide();
  }
}

onMounted(async () => {
  isMounted.value = true;

  const newPostsPerPage = window.innerWidth < 640 ? 1 : window.innerWidth < 868 ? 2 : 3;

  if (newPostsPerPage !== postsPerPage.value) {
    postsPerPage.value = newPostsPerPage;
    const currentOffset = (currentPage.value - 1) * (postsPerPage.value === 3 ? 3 : postsPerPage.value === 2 ? 2 : 1);
    currentPage.value = Math.max(1, Math.floor(currentOffset / newPostsPerPage) + 1);
    await refresh();
  }

  const handleResize = debounce(async () => {
    const newPostsPerPage = window.innerWidth < 640 ? 1 : window.innerWidth < 868 ? 2 : 3;

    if (newPostsPerPage !== postsPerPage.value) {
      postsPerPage.value = newPostsPerPage;
      currentPage.value = 1;
      await refresh();
    }
  }, 300);

  window.addEventListener('resize', handleResize, { passive: true });

  const carouselEl = carousel.value;
  if (carouselEl) {
    carouselEl.addEventListener(
      'touchstart',
      (e) => {
        touchStartX.value = e.changedTouches[0].screenX;
      },
      { passive: true },
    );

    carouselEl.addEventListener(
      'touchend',
      (e) => {
        touchEndX.value = e.changedTouches[0].screenX;
        handleSwipe();
      },
      { passive: true },
    );
  }

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
  });
});

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function getImage(images) {
  const { origin } = useRequestURL();
  const base = `${origin}/blog-images/`;
  if (!images || !images.length) return `${base}default-preview.jpg`;
  return base + images[0];
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
}

watch(
  [currentPage, postsPerPage],
  async () => {
    if (!pending.value) {
      await refresh();
    }
  },
  { flush: 'post' },
);
</script>

<style scoped>
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.transition-opacity {
  transition: opacity 0.2s ease-in-out;
}
</style>
