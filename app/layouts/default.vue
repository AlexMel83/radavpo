<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-custom-black">
    <HeaderMain class="flex-shrink-0" />
    <NuxtPage class="flex-grow" />
    <Footer class="flex-shrink-0" />
  </div>
</template>

<script setup>
import HeaderMain from './headers/HeaderMain.vue';
</script>
