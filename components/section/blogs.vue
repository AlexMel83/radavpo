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

        <!-- Состояние ошибки -->
        <div v-else-if="error" class="text-center py-10">
          <p class="text-red-600">Помилка при завантаженні постів: {{ error.message }}</p>
          <button class="mt-2 px-4 py-2 bg-blue-500 text-white rounded" @click="refresh">Спробувати знову</button>
        </div>

        <!-- Состояние отсутствия постов -->
        <div v-else-if="posts.length === 0" class="text-center py-10">
          <p class="text-gray-600">Пости не знайдено</p>
        </div>

        <!-- Основной контент с постами -->
        <div v-else ref="carousel" class="relative">
          <!-- Стрілка вліво -->
          <button
            v-if="isMounted && totalPages > 1"
            class="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 transition-opacity"
            aria-label="Попередні"
            :disabled="currentPage === 1 || pending"
            @click="prevSlide"
          >
            ◀
          </button>

          <!-- Карусель -->
          <div class="overflow-hidden">
            <div
              class="flex transition-transform duration-500 ease-in-out"
              :style="{ transform: `translateX(-${(currentPage - 1) * 100}%)` }"
            >
              <div class="flex-shrink-0 w-full flex justify-center gap-4">
                <UCard
                  v-for="post in posts"
                  :key="post.slug || post.id"
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
                        :alt="post.title || 'Post image'"
                        class="w-full h-full object-cover rounded transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </NuxtLink>

                  <div class="mt-4 flex flex-col justify-between flex-grow">
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

          <!-- Стрілка вправо -->
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

        <!-- Пагинация -->
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
const router = useRouter();

// Инициализация currentPage с валидацией
const initialPage = Math.max(1, Number(route.query.page) || 1);
const currentPage = ref(initialPage);

// Определяем postsPerPage на сервере статично
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

// Вычисляемое значение для totalPages с защитой от деления на 0
const totalPages = computed(() => {
  if (!totalPosts.value || !postsPerPage.value) return 1;
  return Math.max(1, Math.ceil(totalPosts.value / postsPerPage.value));
});

// Функция загрузки постов с лучшей обработкой ошибок
const fetchPosts = async () => {
  try {
    const offset = Math.max(0, (currentPage.value - 1) * postsPerPage.value);
    const query = `?status=published&limit=${postsPerPage.value}&offset=${offset}&sort_field=created_at&sortDirection=desc`;

    console.log('Fetching posts with query:', query);
    console.log('Current page:', currentPage.value, 'Posts per page:', postsPerPage.value);

    const { $api } = useNuxtApp();
    const response = await $api.posts.getPosts(query);

    console.log('API Response:', response);

    if (!response?.data) {
      throw new Error('Invalid response structure');
    }

    // Обновляем общее количество постов
    const newTotalPosts = parseInt(response.data.total_count, 10) || 0;
    totalPosts.value = newTotalPosts;

    console.log('Total posts updated to:', newTotalPosts);

    // Проверяем, не превышает ли текущая страница максимальную
    const maxPages = Math.max(1, Math.ceil(newTotalPosts / postsPerPage.value));
    if (currentPage.value > maxPages) {
      console.log('Current page exceeds max pages, correcting...');
      currentPage.value = Math.max(1, maxPages);
      // Перезагружаем с корректной страницей
      return await fetchPosts();
    }

    const posts = response.data.data || [];
    console.log(`Loaded ${posts.length} posts for page ${currentPage.value}:`, posts);

    return posts;
  } catch (err) {
    console.error('Error fetching posts:', err);
    totalPosts.value = 0;
    throw err;
  }
};

// Загрузка постов с статичным ключом
const {
  data: postsDataApi,
  pending,
  error,
  refresh,
} = await useAsyncData('posts-carousel', fetchPosts, {
  server: true,
  default: () => [],
});

// Computed для постов с дополнительной обработкой
const posts = computed(() => {
  console.log('Computing posts, postsDataApi.value:', postsDataApi.value);

  if (!postsDataApi.value) {
    console.log('No postsDataApi.value');
    return [];
  }

  const postArray = Array.isArray(postsDataApi.value) ? postsDataApi.value : postsDataApi.value?.data || [];

  console.log('Post array:', postArray, 'length:', postArray.length);

  const processedPosts = postArray.map((post) => ({
    ...post,
    images: post.images || ['default-preview.jpg'],
  }));

  console.log('Processed posts:', processedPosts);
  return processedPosts;
});

// Управление каруселью с улучшенной логикой
async function prevSlide() {
  if (pending.value || currentPage.value <= 1) return;

  try {
    currentPage.value = Math.max(1, currentPage.value - 1);
    await refresh();

    // Обновляем URL без перезагрузки страницы
    await router.replace({
      query: { ...route.query, page: currentPage.value.toString() },
    });
  } catch (err) {
    console.error('Error in prevSlide:', err);
    // Возвращаем страницу назад при ошибке
    currentPage.value = Math.min(totalPages.value, currentPage.value + 1);
  }
}

async function nextSlide() {
  if (pending.value || currentPage.value >= totalPages.value) return;

  try {
    currentPage.value = Math.min(totalPages.value, currentPage.value + 1);
    await refresh();

    // Обновляем URL без перезагрузки страницы
    await router.replace({
      query: { ...route.query, page: currentPage.value.toString() },
    });
  } catch (err) {
    console.error('Error in nextSlide:', err);
    // Возвращаем страницу назад при ошибке
    currentPage.value = Math.max(1, currentPage.value - 1);
  }
}

// Обработка свайпов
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

// Клиентская инициализация
onMounted(async () => {
  isMounted.value = true;

  // Пересчитываем postsPerPage для клиента
  const newPostsPerPage = window.innerWidth < 640 ? 1 : window.innerWidth < 868 ? 2 : 3;

  if (newPostsPerPage !== postsPerPage.value) {
    postsPerPage.value = newPostsPerPage;

    // Пересчитываем текущую страницу с учетом нового количества постов на страницу
    const currentOffset = (currentPage.value - 1) * (postsPerPage.value === 3 ? 3 : postsPerPage.value === 2 ? 2 : 1);
    currentPage.value = Math.max(1, Math.floor(currentOffset / newPostsPerPage) + 1);

    await refresh();
  }

  // Обработчик изменения размера окна
  const handleResize = debounce(async () => {
    const newPostsPerPage = window.innerWidth < 640 ? 1 : window.innerWidth < 868 ? 2 : 3;

    if (newPostsPerPage !== postsPerPage.value) {
      postsPerPage.value = newPostsPerPage;
      currentPage.value = 1;
      await refresh();
    }
  }, 300);

  window.addEventListener('resize', handleResize, { passive: true });

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

  // Очистка при размонтировании
  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
  });
});

// Простая функция debounce
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

// Обработка изображений
function getImage(images) {
  const { origin } = useRequestURL();
  const base = `${origin}/blog-images/`;
  if (!images || !images.length) return `${base}default-preview.jpg`;
  return base + images[0];
}

// Форматирование даты
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

// Следим за изменениями роута
watch(
  () => route.query.page,
  (newPage) => {
    const pageNum = Math.max(1, Number(newPage) || 1);
    if (pageNum !== currentPage.value) {
      currentPage.value = pageNum;
    }
  },
);

// Следим за изменениями параметров пагинации
watch(
  [currentPage, postsPerPage],
  async () => {
    await refresh();
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
