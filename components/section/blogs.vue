<template>
  <section class="py-6 px-4 bg-white">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-2xl font-bold text-center mb-10">
        {{ $t('Index.news') }}
      </h2>

      <div class="relative">
        <!-- Стрілка вліво -->
        <button
          class="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2"
          aria-label="Попередні"
          @click="prevSlide"
        >
          ◀
        </button>

        <!-- Карусель -->
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
                    {{ formatDate(post.createdAt) }}
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
        >
          ▶
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
const isLoading = ref(false);
const { $api } = useNuxtApp();
const postsDataApi = ref([]);
const posts = computed(() => {
  const response = postsDataApi.value.map((post) => ({
    ...post,
    images: post.images || 'default-preview.jpg',
  }));
  return response;
});

onMounted(async () => {
  try {
    await fetchPosts();
  } catch (error) {
    console.error('Error in onMounted:', error);
  }
});

const fetchPosts = async (searchQuery = null) => {
  isLoading.value = true;
  try {
    const response = await $api.posts.getPosts(searchQuery);
    postsDataApi.value = response.data;
  } catch (error) {
    isLoading.value = false;
    console.error('Error fetching posts data:', error);
  } finally {
    isLoading.value = false;
  }
};

const windowWidth = ref(process.client ? window.innerWidth : 1024);
// Динамічний розмір пачки
const chunkSize = computed(() => {
  if (windowWidth.value < 640) return 1; // мобільні
  if (windowWidth.value < 868) return 2; // планшети
  return 3; // десктоп
});
// Стежимо за шириною екрана
if (process.client) {
  window.addEventListener('resize', () => {
    windowWidth.value = window.innerWidth;
  });
}

// Слайди
const chunkedPosts = computed(() => {
  if (!posts.value) return [];
  const chunks = [];
  for (let i = 0; i < posts.value.length; i += chunkSize.value) {
    chunks.push(posts.value.slice(i, i + chunkSize.value));
  }
  return chunks;
});

const currentIndex = ref(0);

function prevSlide() {
  if (currentIndex.value > 0) currentIndex.value--;
}

function nextSlide() {
  if (currentIndex.value < chunkedPosts.value.length - 1) currentIndex.value++;
}

// Фолбек-картинка
function getImage(images) {
  const base = '/blog-images/';
  if (!images) return '/default-preview.jpg';
  if (Array.isArray(images)) return base + (images[0] || 'default-preview.jpg');
  return base + images;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
</script>

<style scoped>
/* Трохи стилів для плавної роботи */
</style>
