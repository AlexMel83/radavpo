<template>
  <div class="my-6 relative rounded-xl overflow-hidden h-96 bg-gray-100">
    <!-- Заглушка, если нет изображений -->
    <NuxtImg
      v-if="!images || (Array.isArray(images) && images.length === 0)"
      :src="defaultImageSrc"
      class="w-full h-full object-contain"
      :alt="alt || 'Зображення за замовчуванням'"
    />
    <!-- Якщо одне зображення (рядок) -->
    <NuxtImg v-if="isSingle" :src="getImageSrc(singleImage)" class="w-full h-full object-contain" :alt="alt" />

    <!-- Карусель -->
    <div v-else-if="isArray" class="relative w-full h-full">
      <div
        ref="carousel"
        class="flex transition-transform duration-700 ease-in-out h-full"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <NuxtImg
          v-for="(img, index) in images"
          :key="index"
          :src="getImageSrc(img)"
          class="w-full h-full flex-shrink-0 object-contain"
          :alt="alt"
        />
      </div>

      <!-- Кнопки -->
      <button
        class="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-1 shadow"
        aria-label="Назад"
        @click="prevImage"
      >
        ◀
      </button>
      <button
        class="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-1 shadow"
        aria-label="Вперед"
        @click="nextImage"
      >
        ▶
      </button>

      <!-- Повний екран -->
      <button
        class="absolute top-2 right-2 bg-white/70 hover:bg-white rounded-full p-1 shadow"
        aria-label="Повний екран"
        @click="openFullscreen"
      >
        🔍
      </button>
    </div>

    <!-- Повноекранне вікно -->
    <div
      v-if="fullscreen && isArray"
      class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      @click.self="closeFullscreen"
    >
      <img :src="getImageSrc(images[currentIndex])" class="max-h-full max-w-full object-contain" :alt="alt" />
      <button class="absolute top-4 right-4 text-white text-3xl" aria-label="Закрити" @click="closeFullscreen">
        ✖
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps<{
  images: string | string[];
  alt?: string;
  type?: 'org' | 'blog'; // новий проп для типу
}>();

const { origin } = useRequestURL();

const singleImage = computed(() => (typeof props.images === 'string' ? props.images : ''));

const imageBasePath = computed(() => {
  const path = props.type === 'blog' ? '/blog-images/' : '/org-images/';
  return `${origin}${path}`; // -> http://localhost:3001/blog-images/
});

const defaultImageSrc = `${origin}/blog-images/default-preview.jpg`;

const isSingle = computed(() => typeof props.images === 'string');
const isArray = computed(() => Array.isArray(props.images) && props.images.length > 0);

const currentIndex = ref(0);
const fullscreen = ref(false);
let interval: ReturnType<typeof setInterval> | undefined;

function getImageSrc(image: string) {
  return `${imageBasePath.value}${image}`;
}

function nextImage() {
  if (isArray.value) {
    currentIndex.value = (currentIndex.value + 1) % props.images.length;
  }
}

function prevImage() {
  if (isArray.value) {
    currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length;
  }
}

function openFullscreen() {
  fullscreen.value = true;
  clearInterval(interval);
}

function closeFullscreen() {
  fullscreen.value = false;
  startAutoplay();
}

function startAutoplay() {
  clearInterval(interval);
  if (isArray.value) {
    interval = setInterval(nextImage, 5000);
  }
}

function onKey(e: KeyboardEvent) {
  if (!fullscreen.value) return;
  if (e.key === 'Escape') closeFullscreen();
  else if (e.key === 'ArrowRight') nextImage();
  else if (e.key === 'ArrowLeft') prevImage();
}

onMounted(() => {
  startAutoplay();
  window.addEventListener('keydown', onKey);
});

onBeforeUnmount(() => {
  clearInterval(interval);
  window.removeEventListener('keydown', onKey);
});
</script>
