<template>
  <div v-if="partner && !isLoading" class="max-w-3xl mx-auto py-12 px-4 bg-gray-50 p-6 shadow-sm">
    <MetaTags
      :title="partner.title || 'Партнер'"
      :description="partner.excerpt || 'Опис партнера'"
      :image="partnerImage"
      :url="`https://radavpo.starkon.pp.ua/partners/${slug}`"
      :keywords="partner.tags?.join(', ') || 'Рада ВПО, Старокостянтинів, допомога ВПО, партнерство'"
      :structured-data="structuredData"
    />
    <div class="text-center mb-6">
      <h1 class="text-3xl font-bold">
        {{ partner.title }}
      </h1>
    </div>
    <div class="mb-6">
      <Images
        v-if="partner.images"
        :images="partner.images"
        type="org"
        :alt="partner.title ? `${partner.title} logo` : 'Partner logo'"
      />
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
          <a :href="partner.url" target="_blank" class="text-blue-600 hover:underline">
            {{ partner.url }}
          </a>
        </li>
        <li v-if="partner.contacts.socials">
          <strong>Соцмережі: </strong>
          <span class="inline-flex gap-2 flex-wrap">
            <span v-for="(link, key, index) in partner.contacts.socials" :key="key">
              <a :href="link" target="_blank" class="inline-flex items-center gap-1 text-blue-600 hover:underline">
                <Icon
                  :name="getSocialIcon(key)"
                  class="w-5 h-5"
                  :class="{
                    'text-blue-600': key === 'facebook',
                    'text-pink-500': key === 'instagram',
                    'text-blue-400': key === 'twitter',
                    'text-green-500': key === 'whatsapp',
                    'text-purple-500': key === 'viber',
                    'text-blue-500': key === 'telegram',
                  }"
                />
                {{ formatSocialName(key) }}
              </a>
              <span v-if="index < Object.keys(partner.contacts.socials).length - 1">, </span>
            </span>
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
      v-if="partner.title"
      :page-object="{
        title: partner.title,
        description: partner.excerpt,
        image: partnerImage,
      }"
    />
  </div>
  <div v-else class="text-center py-20 text-gray-500">
    <p v-if="error">Помилка: {{ error.message }}</p>
    <p v-else>Запис не знайдено або ще завантажується.</p>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useAsyncData } from '#app';

const route = useRoute();
const { $api } = useNuxtApp();
const slug = route.params.slug;

// Явно оголошуємо реактивні змінні
const partner = ref(null);
const isLoading = ref(true);
const error = ref(null);

// Функція для отримання іконки соціальної мережі
function getSocialIcon(key) {
  const icons = {
    facebook: 'fa-brands:facebook-f',
    instagram: 'fa-brands:instagram',
    twitter: 'fa-brands:twitter',
    whatsapp: 'fa-brands:whatsapp',
    viber: 'fa-brands:viber',
    telegram: 'fa-brands:telegram',
    linkedin: 'fa-brands:linkedin-in',
    youtube: 'fa-brands:youtube',
  };
  const icon = icons[key] || 'fa-solid:link';
  return icon;
}

// Функція для форматування назви соціальної мережі
function formatSocialName(key) {
  const names = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    twitter: 'Twitter',
    whatsapp: 'WhatsApp',
    viber: 'Viber',
    telegram: 'Telegram',
    linkedin: 'LinkedIn',
    youtube: 'YouTube',
  };
  const name = names[key] || key.charAt(0).toUpperCase() + key.slice(1);
  return name;
}

// Використовуємо useAsyncData для SSR
const {
  data,
  pending,
  error: fetchError,
} = await useAsyncData(
  `partner-${slug}`,
  async () => {
    try {
      const response = await $api.partners.getPartners(`?slug=${slug}&status=published`);
      if (!response.data?.[0]) {
        console.warn('No data found for slug:', slug);
        return null;
      }
      return response.data[0];
    } catch (err) {
      console.error('Error fetching partner data:', err.message);
      console.error('Full error:', JSON.stringify(err, null, 2));
      return null;
    }
  },
  {
    server: true,
    lazy: false,
    immediate: true,
  },
);

// Синхронізуємо partner.value, isLoading, і error
watch(
  [data, pending, fetchError],
  ([newData, newPending, newError]) => {
    partner.value = newData;
    isLoading.value = newPending;
    error.value = newError;
  },
  { immediate: true },
);

// Використовуємо prev_slug і next_slug з даних партнера
const prevPartner = computed(() => ({
  slug: partner.value?.prev_slug || null,
}));
const nextPartner = computed(() => ({
  slug: partner.value?.next_slug || null,
}));

// Compute the partner image
const partnerImage = computed(() => {
  if (!partner.value?.images) return 'https://radavpo.starkon.pp.ua/org-images/cfhope-logo-transparent.png';
  const image = Array.isArray(partner.value.images) ? partner.value.images[0] : partner.value.images;
  return `https://radavpo.starkon.pp.ua/org-images/${image}`;
});

// Структуровані дані для SEO (JSON-LD)
const structuredData = computed(() => {
  if (!partner.value) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: partner.value.title || 'Партнер',
    description: partner.value.excerpt || 'Опис партнера',
    url: partner.value.url || `https://radavpo.starkon.pp.ua/partners/${slug}`,
    logo: partnerImage.value,
    address: partner.value.contacts?.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: partner.value.contacts.address,
          addressLocality: 'Старокостянтинів',
          addressCountry: 'UA',
        }
      : undefined,
    contactPoint: partner.value.contacts
      ? [
          {
            '@type': 'ContactPoint',
            telephone: partner.value.contacts.phone || undefined,
            email: partner.value.contacts.email || undefined,
            contactType: 'customer service',
          },
        ]
      : undefined,
    sameAs: partner.value.contacts?.socials ? Object.values(partner.value.contacts.socials) : undefined,
  };
});
</script>
