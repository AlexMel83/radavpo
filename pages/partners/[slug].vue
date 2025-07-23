<template>
  <div v-if="partner" class="max-w-3xl mx-auto py-12 px-4">
    <div v-if="isLoading" class="text-center py-10">
      <span class="text-gray-500">Завантаження партнерів...</span>
    </div>
    <div v-else>
      <div class="text-center mb-6">
        <h1 class="text-3xl font-bold">
          {{ partner.title }}
        </h1>
      </div>

      <div class="mb-6">
        <Images v-if="partner.images" :images="partner.images" type="org" :alt="partner.title" />
      </div>

      <div class="prose prose-gray max-w-none" v-html="partner.content" />

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
              {{ partner.contacts.email }}
            </a>
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

      <div class="flex justify-between mt-12">
        <UButton
          color="gray"
          variant="soft"
          :disabled="!prevPartner?.slug"
          @click="navigateTo(`/partners/${prevPartner.slug}`)"
        >
          ← Назад
        </UButton>
        <UButton
          color="gray"
          variant="soft"
          :disabled="!nextPartner?.slug"
          @click="navigateTo(`/partners/${nextPartner.slug}`)"
        >
          Вперед →
        </UButton>
      </div>
      <ShareButtons
        v-if="partner?.title"
        :page-object="{
          title: partner.title,
          description: partner.excerpt,
          image: partnerImage,
        }"
      />
    </div>
  </div>

  <div v-else class="text-center py-20 text-gray-500">
    <p v-if="error">Помилка: {{ error.message }}</p>
    <p v-else>Запис не знайдено або ще завантажується.</p>
  </div>
</template>

<script setup>
const route = useRoute();
const { $api } = useNuxtApp();
const slug = route.params.slug;

// Fetch partner data with useAsyncData for SSR
const {
  data: partner,
  pending: isLoading,
  error,
} = useAsyncData(
  `partner-${slug}`,
  async () => {
    try {
      const response = await $api.partners.getPartners(`?slug=${slug}&status=published`);
      if (!response.data?.[0]) {
        console.warn('No data found for slug:', slug);
      }
      return response.data?.[0] || null;
    } catch (err) {
      console.error('Error fetching partner data:', err.message);
      console.error('Full error:', JSON.stringify(err, null, 2));
      return null;
    }
  },
  {
    server: true,
    lazy: false,
    immediate: true, // Виконувати запит одразу
  },
);

const prevPartner = computed(() => ({
  slug: partner.value?.prev_slug || null,
}));
const nextPartner = computed(() => ({
  slug: partner.value?.next_slug || null,
}));

// Compute the partner image
const partnerImage = computed(() => {
  if (!partner.value?.images) return '/org-images/cfhope-logo-transparent.png';
  return `/org-images/${Array.isArray(partner.value.images) ? partner.value.images[0] : partner.value.images}`;
});

// Set meta tags using useHead for SSR
useHead({
  title: computed(() => partner.value?.title || 'Партнер'),
  meta: [
    {
      name: 'description',
      content: computed(() => partner.value?.excerpt || 'Опис партнера'),
    },
    {
      property: 'og:title',
      content: computed(() => partner.value?.title || 'Партнер'),
    },
    {
      property: 'og:description',
      content: computed(() => partner.value?.excerpt || 'Опис партнера'),
    },
    {
      property: 'og:image',
      content: partnerImage,
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:title',
      content: computed(() => partner.value?.title || 'Партнер'),
    },
    {
      name: 'twitter:description',
      content: computed(() => partner.value?.excerpt || 'Опис партнера'),
    },
    {
      name: 'twitter:image',
      content: partnerImage,
    },
  ],
});
</script>
