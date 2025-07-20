<template>
  <section class="py-6">
    <UContainer>
      <h2 class="text-2xl font-bold text-center mb-10">
        {{ $t('Index.partners') }}
      </h2>
      <div v-if="isLoading" class="text-center py-10">
        <span class="text-gray-500">Завантаження партнерів...</span>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <NuxtLink v-for="partner in partners" :key="partner.slug" :to="`/partners/${partner.slug}`">
          <UCard
            class="hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 group p-2"
            :ui="{
              base: 'flex flex-col items-center text-center h-full overflow-hidden',
              body: 'p-4 flex flex-col flex-grow items-center',
            }"
          >
            <div class="flex items-center justify-center h-48 w-full bg-white p-4">
              <img
                :src="`/org-images/${Array.isArray(partner.images) && partner.images.length > 0 ? partner.images[0] : 'default.png'}`"
                :alt="partner.title"
                class="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div class="mt-4">
              <h3 class="text-lg font-semibold text-gray-800 leading-tight break-words">
                {{ partner.title }}
              </h3>
              <p class="text-sm text-gray-500 mt-1">
                {{ typeof partner.contacts === 'object' ? partner.contacts?.address : '' }}
              </p>
            </div>
          </UCard>
        </NuxtLink>
      </div>
    </UContainer>
  </section>
</template>

<script setup>
const isLoading = ref(false);
const { $api } = useNuxtApp();
const partnersDataApi = ref([]);
const partners = computed(() => {
  return partnersDataApi.value.map((partner) => ({
    ...partner,
    images: partner.images || 'default.png', // Fallback image if none provided
  }));
});

onMounted(async () => {
  try {
    await fetchPartners();
  } catch (error) {
    console.error('Error in onMounted:', error);
  }
});

const fetchPartners = async (searchQuery = null) => {
  isLoading.value = true;
  try {
    const response = await $api.partners.getPartners(searchQuery);
    partnersDataApi.value = response.data;
  } catch (error) {
    isLoading.value = false;
    console.error('Error fetching partners data:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>
