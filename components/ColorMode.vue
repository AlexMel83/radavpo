<script setup>
const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === 'dark';
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
  },
});
</script>

<template>
  <ClientOnly>
    <button
      :style="{ color: 'white !important' }"
      class="color-mode"
      background="white"
      variant="ghost"
      aria-label="Theme"
      @click="isDark = !isDark"
    >
      <template v-if="isDark">
        <!-- Иконка луны -->
        <IconsMoon />
      </template>
      <template v-else>
        <!-- Иконка солнца -->
        <IconsSun />
      </template>
    </button>
    <template #fallback>
      <div class="w-8 h-8" />
    </template>
  </ClientOnly>
</template>

<style scoped>
.color-mode:hover {
  transform: scale(1.1);
}
</style>
