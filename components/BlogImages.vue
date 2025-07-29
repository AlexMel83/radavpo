<template>
  <div class="my-6 relative rounded-xl overflow-hidden h-96 bg-gray-100">
    <!-- Заглушка -->
    <NuxtImg
      v-if="!images || (Array.isArray(images) && images.length === 0)"
      src="/blog-images/default-preview.jpg"
      format="webp"
      :alt="alt || 'Зображення за замовчуванням'"
      width="400"
      height="300"
      class="w-full h-full object-contain"
    />

    <!-- Одне зображення -->
    <NuxtImg
      v-else-if="typeof images === 'string'"
      :src="`/blog-images/${images}`"
      format="webp"
      :alt="alt"
      width="600"
      height="400"
      class="w-full h-full object-contain"
    />

    <!-- Карусель -->
    <div v-else class="relative w-full h-full">
      <div
        ref="carousel"
        class="flex transition-transform duration-700 ease-in-out h-full"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <NuxtImg
          v-for="(img, index) in images"
          :key="index"
          :src="`/blog-images/${img}`"
          format="webp"
          :alt="alt"
          width="600"
          height="400"
          class="w-full h-full flex-shrink-0 object-contain"
        />
      </div>

      <!-- Кнопки та fullscreen залишити без змін -->
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
