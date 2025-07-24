```vue
<template>
  <div class="my-6 relative rounded-xl overflow-hidden h-96 bg-gray-100">
    <!-- Заглушка, если нет изображений -->
    <img
      v-if="!images || (Array.isArray(images) && images.length === 0)"
      src="/blog-images/default-preview.jpg"
      class="w-full h-full object-contain"
      :alt="alt || 'Зображення за замовчуванням'"
    />

    <!-- Якщо одне зображення -->
    <img
      v-else-if="typeof images === 'string'"
      :src="`/blog-images/${images}`"
      class="w-full h-full object-contain"
      :alt="alt"
    />

    <!-- Карусель -->
    <div v-else class="relative w-full h-full">
      <!-- Картинки -->
      <div
        ref="carousel"
        class="flex transition-transform duration-700 ease-in-out h-full"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <img
          v-for="(img, index) in images"
          :key="index"
          :src="`/blog-images/${img}`"
          class="w-full h-full flex-shrink-0 object-contain"
          :alt="alt"
        />
      </div>

      <!-- Кнопки перелистування -->
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

      <!-- Кнопка повного екрану -->
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
      v-if="fullscreen"
      class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      @click.self="closeFullscreen"
    >
      <img
        :src="getFullscreenImage"
        class="max-h-full max-w-full object-contain"
        :alt="alt || 'Зображення за замовчуванням'"
      />
      <button class="absolute top-4 right-4 text-white text-3xl" aria-label="Закрити" @click="closeFullscreen">
        ✖
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  images: string | string[] | null;
  alt?: string;
}>();

const currentIndex = ref(0);
const fullscreen = ref(false);
let interval: ReturnType<typeof setInterval> | undefined;

const getFullscreenImage = computed(() => {
  if (!props.images || (Array.isArray(props.images) && props.images.length === 0)) {
    return '/blog-images/default-preview.jpg';
  }
  if (typeof props.images === 'string') {
    return `/blog-images/${props.images}`;
  }
  return `/blog-images/${props.images[currentIndex.value]}`;
});

function nextImage() {
  if (Array.isArray(props.images) && props.images.length > 0) {
    currentIndex.value = (currentIndex.value + 1) % props.images.length;
  }
}

function prevImage() {
  if (Array.isArray(props.images) && props.images.length > 0) {
    currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length;
  }
}

function openFullscreen() {
  fullscreen.value = true;
  clearInterval(interval); // зупиняємо автоперелистування
}

function closeFullscreen() {
  fullscreen.value = false;
  startAutoplay();
}

function startAutoplay() {
  if (Array.isArray(props.images) && props.images.length > 0) {
    interval = setInterval(nextImage, 7000);
  }
}

onMounted(() => {
  startAutoplay();
  window.addEventListener('keydown', onKey);
});

onBeforeUnmount(() => {
  clearInterval(interval);
  window.removeEventListener('keydown', onKey);
});

function onKey(e: KeyboardEvent) {
  if (!fullscreen.value) return;

  if (e.key === 'Escape') {
    closeFullscreen();
  } else if (e.key === 'ArrowRight') {
    nextImage();
  } else if (e.key === 'ArrowLeft') {
    prevImage();
  }
}
</script>
