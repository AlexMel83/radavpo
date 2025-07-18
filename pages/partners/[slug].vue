<template>
  <div v-if="partner" class="max-w-3xl mx-auto py-12 px-4">
    <!-- Заголовок -->
    <div class="text-center mb-6">
      <h1 class="text-3xl font-bold">
        {{ partner.title }}
      </h1>
    </div>

    <!-- Зображення -->
    <div class="mb-6">
      <PartnerImages v-if="partner.images" :images="partner.images" :alt="partner.title" />
    </div>

    <!-- Дата -->
    <!-- <p class="text-gray-400 text-sm text-right mb-6">
      {{ formatDate(partner.createdAt) }}
    </p> -->

    <!-- Контент -->
    <div class="prose prose-gray max-w-none" v-html="partner.content" />

    <!-- Контакти -->
    <div v-if="partner.contacts" class="mt-8 bg-gray-50 rounded-xl p-6 shadow-sm">
      <h2 class="text-lg font-semibold mb-4">Контакти</h2>
      <ul class="space-y-1 text-sm text-gray-700">
        <li v-if="partner.contacts.address">
          <strong>Адреса: </strong>
          <a
            :href="`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(partner.contacts.address)}`"
            target="_blank"
            class="text-blue-600 hover:underline"
          >
            {{ partner.contacts.address }}
          </a>
        </li>

        <li v-if="partner.contacts.phone">
          <strong>Телефон: </strong>
          <a :href="`tel:${partner.contacts.phone.replace(/[^+\d]/g, '')}`" class="text-blue-600 hover:underline">
            {{ partner.contacts.phone }}
          </a>
        </li>
        <li v-if="partner.contacts.email">
          <strong>Email: </strong>
          <a :href="`mailto:${partner.contacts.email}`" class="text-blue-600 hover:underline">
            {{ partner.contacts.email }}</a
          >
        </li>
        <li v-if="partner.url">
          <strong>Вебсайт: </strong>
          <a :href="partner.url" target="_blank" class="text-blue-600 hover:underline"> {{ partner.url }}</a>
        </li>
        <li v-if="partner.contacts.socials">
          <strong>Соцмережі: </strong>
          <span v-for="(link, key, index) in partner.contacts.socials" :key="key">
            <a :href="link" target="_blank" class="text-blue-600 hover:underline"> {{ key }}</a
            ><span v-if="index < Object.keys(partner.contacts.socials).length - 1">, </span>
          </span>
        </li>
      </ul>
    </div>

    <!-- Навігація між партнерами -->
    <div class="flex justify-between mt-12">
      <UButton
        color="gray"
        variant="soft"
        :disabled="!prevPartner"
        @click="navigateTo(`/partners/${prevPartner?.slug}`)"
      >
        ← Назад
      </UButton>
      <UButton
        color="gray"
        variant="soft"
        :disabled="!nextPartner"
        @click="navigateTo(`/partners/${nextPartner?.slug}`)"
      >
        Вперед →
      </UButton>
    </div>
  </div>

  <div v-else class="text-center py-20 text-gray-500">
    <p>Запис не знайдено або ще завантажується.</p>
  </div>
</template>

<script setup>
const route = useRoute();
const slug = route.params.slug;

// Поточний партнер
const { data: partner } = await useFetch(`/api/partners/${slug}`);

// Усі партнери — для навігації
const { data: allPartners } = await useFetch('/api/partners');

const currentIndex = computed(() => allPartners.value?.findIndex((p) => p.slug === slug));

const prevPartner = computed(() => (currentIndex.value > 0 ? allPartners.value[currentIndex.value - 1] : null));

const nextPartner = computed(() =>
  currentIndex.value < allPartners.value.length - 1 ? allPartners.value[currentIndex.value + 1] : null,
);

// Формат дати
// function formatDate(dateStr) {
//   return new Date(dateStr).toLocaleDateString('uk-UA', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//   });
// }

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
