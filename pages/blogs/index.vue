<template>
  <div class="p-4 max-w-3xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-center">Блог</h1>
    <ul class="grid gap-6">
      <li
        v-for="post in posts"
        :key="post.slug"
        class="bg-white rounded-lg shadow-md overflow-hidden transition hover:shadow-lg"
      >
        <NuxtLink :to="`/blogs/${post.slug}`" class="block hover:bg-gray-50 transition">
          <img :src="getImage(post)" :alt="post.title" class="w-full h-48 object-cover" loading="lazy" />
          <div class="p-4">
            <h2 class="text-xl font-semibold mb-2 text-blue-600">
              {{ post.title }}
            </h2>
            <p class="text-sm text-gray-600 mb-2 line-clamp-2">
              {{ post.excerpt }}
            </p>
            <p class="text-xs text-gray-400">
              {{ formatDate(post.createdAt) }}
            </p>
          </div>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
const { data: posts } = await useFetch('/api/blogs');

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getImage(post) {
  const fallback = '/default-preview.jpg'; // 👈 шлях до запасного зображення
  if (!post.images) return fallback;
  if (Array.isArray(post.images)) {
    return post.images.length > 0 ? `/blog-images/${post.images[0]}` : fallback;
  }
  return post.images ? `/blog-images/${post.images}` : fallback;
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
