<template>
  <div v-if="partner" class="max-w-3xl mx-auto py-8 px-4">
    <div class="text-center items-center mb-6">
      <NuxtLink to="/blogs" class="text-blue-600 hover:underline"> ← Назад до списку блогів </NuxtLink>
      <h1 class="text-3xl font-bold mb-4">
        {{ partner.title }}
      </h1>
    </div>

    <PartnerImages v-if="partner.images" :images="partner.images" :alt="partner.title" />
    <p class="text-gray-400 text-sm mb-4">
      {{ formatDate(partner.createdAt) }}
    </p>
    <div v-html="partner.content" />

    <div class="flex justify-between mt-12">
      <button
        class="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
        :disabled="!prevPartner"
        @click="navigateTo(`/partners/${prevPartner?.slug}`)"
      >
        ← Назад
      </button>
      <button
        class="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
        :disabled="!nextPartner"
        @click="navigateTo(`partners/${nextPartner?.slug}`)"
      >
        Вперед →
      </button>
    </div>
  </div>
  <div v-else class="text-center py-20 text-gray-500">
    <p>Запис не знайдено або ще завантажується.</p>
  </div>
</template>

<script setup>
const route = useRoute();
const slug = route.params.slug;
const { data: partner } = await useFetch(`/api/partners/${slug}`);

// Завантаження всіх блогів (для навігації)
const { data: allPartners } = await useFetch('/api/partners');

const currentIndex = computed(() => allPartners.value?.findIndex((p) => p.slug === slug));

const prevPartner = computed(() => (currentIndex.value > 0 ? allPartners.value[currentIndex.value - 1] : null));

const nextPartner = computed(() =>
  currentIndex.value < allPartners.value.length - 1 ? allPartners.value[currentIndex.value + 1] : null,
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
    const { data: partner } = await useFetch(`/api/partners/${useRoute().params.slug}`);
    const img = Array.isArray(partner.value?.images)
      ? `/blog-images/${partner.value.images[0]}`
      : `/blog-images/${partner.value?.images}`;

    return {
      title: partner.value?.title || 'Партнер',
      meta: [
        { name: 'description', content: partner.value?.excerpt || '' },
        { property: 'og:title', content: partner.value?.title },
        { property: 'og:image', content: img },
      ],
    };
  },
});
</script>
