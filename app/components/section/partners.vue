<template>
  <section class="py-6">
    <UContainer>
      <h2 class="text-2xl font-bold text-center mb-10">
        {{ $t('Index.partners') }}
      </h2>
      <div v-if="isLoading" class="text-center py-10">
        <span class="text-gray-500">Завантаження партнерів...</span>
      </div>
      <div v-else-if="error" class="text-center py-10 text-red-600">
        Помилка при завантаженні партнерів: {{ error.message }}
      </div>
      <div v-else-if="partners.length === 0" class="text-center py-10 text-gray-500">Партнерів не знайдено.</div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <NuxtLink v-for="partner in partners" :key="partner.slug" :to="`/partners/${partner.slug}`">
          <UCard
            class="hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 group p-2"
            :ui="{
              base: 'flex flex-col items-center text-center h-full overflow-hidden',
              body: { base: 'p-4 flex flex-col flex-grow items-center' },
            }"
          >
            <div class="flex items-center justify-center h-48 w-full bg-white p-4">
              <NuxtImg
                :src="getPartnerImage(partner)"
                :alt="partner.title || 'Зображення партнера'"
                class="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div class="mt-4">
              <h3 class="text-lg font-semibold text-gray-800 leading-tight break-words">
                {{ partner.title }}
              </h3>
              <p class="text-sm text-gray-500 mt-1">
                {{ typeof partner.contacts === 'object' && partner.contacts?.address ? partner.contacts.address : '' }}
              </p>
            </div>
          </UCard>
        </NuxtLink>
      </div>
    </UContainer>
  </section>
</template>

<script setup>
const { $api } = useNuxtApp();

// Reactive state for loading, error, and data
const {
  data: partnersDataApi,
  pending: isLoading,
  error,
} = await useAsyncData(
  'partners',
  async () => {
    try {
      const response = await $api.partners.getPartners(null);
      return response.data || [];
    } catch (err) {
      console.error('Error fetching partners data:', err);
      return [];
    }
  },
  {
    server: true,
    lazy: false,
    immediate: true,
    // default: () => [],
  },
);

// Computed property to transform partner data
const partners = computed(() => {
  if (!Array.isArray(partnersDataApi.value)) {
    console.warn('partnersDataApi.value is not an array:', partnersDataApi.value);
    return [];
  }
  return partnersDataApi.value.map((partner) => ({
    ...partner,
    images: partner.images || null,
  }));
});

// Function to get partner image with fallback
const getPartnerImage = (partner) => {
  // Отримуємо "http://localhost:3001" або домен вашого сайту в продакшені
  const { origin } = useRequestURL();
  const base = `${origin}/org-images/`;

  if (!partner.images || (Array.isArray(partner.images) && partner.images.length === 0)) {
    return `${base}default.png`; // Також робимо повний шлях для дефолтного зображення
  }

  const imageName = Array.isArray(partner.images) ? partner.images[0] : partner.images;
  return `${base}${imageName}`;
};
</script>
