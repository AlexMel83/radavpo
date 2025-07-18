<template>
  <section class="py-10 px-4 bg-white">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-2xl font-bold mb-6">Новини</h2>

      <div class="relative">
        <!-- Стрілка вліво -->
        <button
          class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2"
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
            <div v-for="(chunk, i) in chunkedPosts" :key="i" class="flex-shrink-0 w-full flex justify-center gap-4">
              <div v-for="post in chunk" :key="post.slug" class="w-1/3 bg-white rounded shadow p-4 flex flex-col">
                <NuxtLink :to="`/blogs/${post.slug}`">
                  <img :src="getImage(post.images)" :alt="post.title" class="w-full h-40 object-cover rounded mb-2" />
                </NuxtLink>
                <NuxtLink :to="`/blogs/${post.slug}`">
                  <h3 class="text-lg font-semibold hover:underline mb-1">
                    {{ post.title }}
                  </h3>
                </NuxtLink>
                <p class="text-sm text-gray-600 line-clamp-4">
                  {{ post.excerpt }}
                </p>
                <p class="text-xs text-gray-400">
                  {{ formatDate(post.createdAt) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Стрілка вправо -->
        <button
          class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2"
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
const { data: posts } = await useFetch('/api/blogs');

// Показуємо по 3 пости на слайд
const chunkSize = 3;
const chunkedPosts = computed(() => {
  if (!posts.value) return [];
  const chunks = [];
  for (let i = 0; i < posts.value.length; i += chunkSize) {
    chunks.push(posts.value.slice(i, i + chunkSize));
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
