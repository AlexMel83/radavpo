<template>
  <div class="max-w-3xl mx-auto py-8 px-4">
    <MetaTags
      v-if="post?.title"
      :title="post.title || 'Default Title'"
      :description="post.excerpt || 'Default Description'"
      :image="`/blog-images/${Array.isArray(post?.images) ? post.images[0] : post?.images || 'cfhope-logo-tranparent.png'}`"
    />
    <div class="text-center items-center mb-6">
      <NuxtLink to="/blogs" class="text-blue-600 hover:underline"> ← Назад до списку блогів </NuxtLink>
      <h1 class="text-3xl font-bold mb-4">
        {{ post.title }}
      </h1>
    </div>

    <BlogImages v-if="post.images" :images="post.images" :alt="post.title" />
    <p class="text-gray-400 text-sm mb-4">
      {{ formatDate(post.createdAt) }}
    </p>
    <div v-html="post.content" />

    <div class="flex justify-between mt-12">
      <button
        class="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
        :disabled="!prevPost"
        @click="navigateTo(`/blogs/${prevPost?.slug}`)"
      >
        ← Назад
      </button>
      <button
        class="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
        :disabled="!nextPost"
        @click="navigateTo(`/blogs/${nextPost?.slug}`)"
      >
        Вперед →
      </button>
    </div>
    <ShareButtons
      v-if="post?.title"
      :page-object="{
        title: post.title,
        description: post.excerpt,
        image: `/blog-images/${Array.isArray(post?.images) ? post.images[0] : post?.images || 'cfhope-logo-tranparent.png'}`,
      }"
    />
  </div>
</template>

<script setup>
const route = useRoute();
const slug = route.params.slug;
const { $api } = useNuxtApp();

const post = ref(null);
const allPosts = ref([]);

const fetchPost = async () => {
  try {
    const res = await $api.posts.getPosts(`?slug=${slug}`);
    post.value = res.data[0];
  } catch (err) {
    console.error('Error loading post:', err);
  }
};

const fetchAllPosts = async () => {
  try {
    const res = await $api.posts.getPosts();
    allPosts.value = res.data;
  } catch (err) {
    console.error('Error loading all posts:', err);
  }
};

await fetchPost();
await fetchAllPosts();

const currentIndex = computed(() => allPosts.value.findIndex((p) => p.slug === slug));

const prevPost = computed(() => (currentIndex.value > 0 ? allPosts.value[currentIndex.value - 1] : null));

const nextPost = computed(() =>
  currentIndex.value < allPosts.value.length - 1 ? allPosts.value[currentIndex.value + 1] : null,
);
// Формат дати
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// SEO head
definePageMeta({
  layout: 'default',
  async head() {
    const { data: post } = await useFetch(`/api/blogs/${useRoute().params.slug}`);
    const img = Array.isArray(post.value?.images)
      ? `/blog-images/${post.value.images[0]}`
      : `/blog-images/${post.value?.images}`;

    return {
      title: post.value?.title || 'Блог',
      meta: [
        { name: 'description', content: post.value?.excerpt || '' },
        { property: 'og:title', content: post.value?.title },
        { property: 'og:image', content: img },
      ],
    };
  },
});
</script>
