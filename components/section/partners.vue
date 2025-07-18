<template>
  <section class="py-10 px-4 bg-white">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-2xl font-bold mb-6">Наші партнери</h2>

      <div class="relative">
        <!-- Стрілка вліво -->
        <button
          class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 disabled:opacity-50"
          @click="prevSlide"
          :disabled="currentIndex === 0"
          aria-label="Попередні"
        >
          ◀
        </button>

        <!-- Карусель -->
        <div class="overflow-hidden">
          <div
            class="flex transition-transform duration-500 ease-in-out"
            :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
          >
            <div v-for="(chunk, i) in chunkedPartners" :key="i" class="flex-shrink-0 w-full flex justify-center gap-4">
              <div
                v-for="partner in chunk"
                :key="partner.slug"
                class="w-full sm:w-[48%] lg:w-[30%] bg-white rounded shadow p-4 flex flex-col"
              >
                <NuxtLink :to="`/partners/${partner.slug}`">
                  <img
                    :src="getImage(partner.images)"
                    :alt="partner.title"
                    class="w-full h-40 object-cover rounded mb-2"
                  />
                </NuxtLink>
                <NuxtLink :to="`/partners/${partner.slug}`">
                  <h3 class="text-lg font-semibold hover:underline mb-1 line-clamp-2">
                    {{ partner.title }}
                  </h3>
                </NuxtLink>
                <p class="text-xs text-gray-400 line-clamp-2">
                  {{ partner.contacts?.address || 'Адресу не вказано' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Стрілка вправо -->
        <button
          class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 disabled:opacity-50"
          @click="nextSlide"
          :disabled="currentIndex >= chunkedPartners.length - 1"
          aria-label="Наступні"
        >
          ▶
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
const { data: partners } = await useFetch('/api/partners');

// Показуємо по 3 пости на слайд
const chunkSize = 3;
const chunkedPartners = computed(() => {
  if (!partners.value) return [];
  const chunks = [];
  for (let i = 0; i < partners.value.length; i += chunkSize) {
    chunks.push(partners.value.slice(i, i + chunkSize));
  }
  return chunks;
});

const currentIndex = ref(0);

function prevSlide() {
  if (currentIndex.value > 0) currentIndex.value--;
}

function nextSlide() {
  if (currentIndex.value < chunkedPartners.value.length - 1) currentIndex.value++;
}

// Фолбек-картинка
function getImage(images) {
  const base = '/org-images/';
  if (!images) return '/default-preview.jpg';
  if (Array.isArray(images)) return base + (images[0] || 'default-preview.jpg');
  return base + images;
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
