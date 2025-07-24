<template>
  <section class="py-6 px-4 bg-white">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-2xl font-bold text-center mb-10">
        {{ $t('Index.news') }}
      </h2>

      <!-- Контейнер для стабилизации гидратации -->
      <div>
        <!-- Состояние загрузки -->
        <div v-if="pending" class="text-center py-10">
          <p class="text-gray-600">Завантаження...</p>
        </div>
        <div v-else-if="error" class="text-center py-10">
          <p class="text-red-600">Помилка при завантаженні постів: {{ error.message }}</p>
        </div>
        <div v-else-if="!posts.length && !pending" class="text-center py-10">
          <p class="text-gray-600">Пости не знайдено</p>
        </div>
        <div v-else class="relative" ref="carousel">
          <!-- Стрілка вліво -->
          <button
            class="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2"
            aria-label="Попередні"
            @click="prevSlide"
            :disabled="currentPage === 1"
          >
            ◀
          </button>

          <!-- Карусель -->
          <div class="overflow-hidden">
            <div
              class="flex transition-transform duration-500 ease-in-out"
              :style="{ transform: `translateX(-${(currentPage.value - 1) * 100}%)` }"
            >
              <div class="flex-shrink-0 w-full flex justify-center gap-4">
                <UCard
                  v-for="post in posts"
                  :key="post.slug"
                  class="w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.666rem)] hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 group p-2"
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
            @click="nextSlide"
            :disabled="currentPage >= totalPages"
          >
            ▶
          </button>
        </div>

        <!-- Пагинация -->
        <div v-if="posts.length > 0" class="flex justify-between mt-8">
          <UButton color="gray" variant="soft" :disabled="currentPage === 1" @click="prevSlide"> ← Попередня </UButton>
          <span class="text-gray-600">Сторінка {{ currentPage }} з {{ totalPages }}</span>
          <UButton color="gray" variant="soft" :disabled="currentPage >= totalPages" @click="nextSlide">
            Наступна →
          </UButton>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const route = useRoute();
const currentPage = ref(Number(route.query.page) || 1);
const postsPerPage = ref(3);
const totalPosts = useState('totalPosts', () => 0);
const isMounted = ref(false);

// Загрузка постов
const {
  data: postsDataApi,
  pending,
  error,
  refresh,
} = useAsyncData(
  `posts-page-${currentPage.value}-${postsPerPage.value}`,
  async () => {
    try {
      const query = `?status=published&limit=${postsPerPage.value}&offset=${
        (currentPage.value - 1) * postsPerPage.value
      }&sort_field=created_at&sortDirection=desc`;
      const { $api } = useNuxtApp();
      const response = await $api.posts.getPosts(query);
      totalPosts.value = parseInt(response.data.total_count, 10) || 0;
      return response.data.data || [];
    } catch (err) {
      console.error('Error fetching posts:', err.message);
      totalPosts.value = 0;
      return [];
    }
  },
  {
    server: true,
    lazy: true,
    default: () => [],
  },
);

// Computed для постов
const cachedPosts = ref([]);

const posts = computed(() => {
  const postArray = Array.isArray(postsDataApi.value) ? postsDataApi.value : postsDataApi.value?.data || [];
  if (postArray.length) {
    cachedPosts.value = postArray.map((post) => ({
      ...post,
      images: post.images || ['default-preview.jpg'],
    }));
  }
  return cachedPosts.value;
});

// Динамическая ширина окна
const windowWidth = ref(1024);

// Обработка свайпов
const touchStartX = ref(0);
const touchEndX = ref(0);
const carousel = ref(null);

if (process.client) {
  onMounted(async () => {
    isMounted.value = true;
    windowWidth.value = window.innerWidth;
    await nextTick();
    if (windowWidth.value < 640) {
      postsPerPage.value = 1;
    } else if (windowWidth.value < 868) {
      postsPerPage.value = 2;
    } else {
      postsPerPage.value = 3;
    }
    await refresh(); // Инициализация данных на клиенте
    window.addEventListener(
      'resize',
      () => {
        windowWidth.value = window.innerWidth;
      },
      { passive: true },
    );

    // Обработчики свайпов
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
  });
}

const totalPages = computed(() => {
  const pages = Math.ceil(totalPosts.value / postsPerPage.value);
  return pages || 1;
});

// Управление каруселью
async function prevSlide() {
  if (currentPage.value > 1) {
    currentPage.value--;
    await refresh();
    await nextTick();
  }
}

async function nextSlide() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    await refresh();
    await nextTick();
  }
}

// Обработка свайпа
function handleSwipe() {
  const swipeDistance = touchStartX.value - touchEndX.value;
  const minSwipeDistance = 50;
  if (swipeDistance > minSwipeDistance) {
    nextSlide();
  } else if (swipeDistance < -minSwipeDistance) {
    prevSlide();
  }
}

watch([windowWidth, currentPage], async () => {
  const newPostsPerPage = windowWidth.value < 640 ? 1 : windowWidth.value < 868 ? 2 : 3;
  if (newPostsPerPage !== postsPerPage.value) {
    postsPerPage.value = newPostsPerPage;
    currentPage.value = 1;
  }
  await nextTick();
  await refresh();
});

// Обработка изображений
function getImage(images) {
  const { origin } = useRequestURL();
  const base = `${origin}/blog-images/`;
  if (!images || !images.length) return `${origin}/blog-images/default-preview.jpg`;
  return base + images[0];
}

// Форматирование даты
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
