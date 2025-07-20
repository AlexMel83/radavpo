<template>
  <div v-if="partner" class="max-w-3xl mx-auto py-12 px-4">
    <MetaTags
      :title="partner.title || 'Default Title'"
      :description="partner.excerpt || 'Default Description'"
      :image="`/org-images/${Array.isArray(partner?.images) ? partner.images[0] : partner?.images || 'cfhope-logo-tranparent.png'}`"
    />
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
      <ShareButtons
        v-if="partner?.title"
        :page-object="{
          title: partner.title,
          description: partner.excerpt,
          image: `/org-images/${Array.isArray(partner?.images) ? partner.images[0] : partner?.images || 'cfhope-logo-tranparent.png'}`,
        }"
      />
    </div>
  </div>

  <div v-else class="text-center py-20 text-gray-500">
    <p>Запис не знайдено або ще завантажується.</p>
  </div>
</template>

<script setup>
const route = useRoute();
const slug = route.params.slug;

const isLoading = ref(false);
const { $api } = useNuxtApp();
const partner = ref([]);
const prevPartner = ref(null);
const nextPartner = ref(null);

onMounted(async () => {
  await fetchPartners(`?slug=${slug}`);
});

const fetchPartners = async (searchQuery = null) => {
  isLoading.value = true;
  try {
    const response = await $api.partners.getPartners(searchQuery);
    partner.value = response.data[0] || null;
    return response.data[0] || null;
  } catch (error) {
    isLoading.value = false;
    console.error('Error fetching partners data:', error);
    return null;
  } finally {
    isLoading.value = false;
  }
};

watch(partner, async (partner) => {
  const id = partner?.id;
  if (!id) return;

  const prevId = id > 1 ? id - 1 : null;
  const nextId = id + 1;

  try {
    const [prev, next] = await Promise.all([
      prevId ? $api.partners.getPartners(`?id=${prevId}`) : null,
      $api.partners.getPartners(`?id=${nextId}`),
    ]);

    prevPartner.value = prev?.data[0] ?? null;
    nextPartner.value = next?.data[0] ?? null;
  } catch (err) {
    console.error('Error loading prev/next partners:', err);
    prevPartner.value = null;
    nextPartner.value = null;
  }
});

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
