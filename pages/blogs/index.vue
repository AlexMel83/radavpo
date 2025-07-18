<template>
  <div class="p-4 max-w-2xl mx-auto">
    <h1 class="text-3xl font-bold mb-4">Блог</h1>
    <ul>
      <li v-for="post in posts" :key="post.slug" class="mb-6">
        <NuxtLink :to="`/blogs/${post.slug}`" class="text-xl text-blue-600 hover:underline">
          {{ post.title }}
        </NuxtLink>
        <p class="text-gray-600 text-sm">
          {{ post.excerpt }}
        </p>
        <p class="text-gray-400 text-xs">
          {{ formatDate(post.createdAt) }}
        </p>
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
</script>
