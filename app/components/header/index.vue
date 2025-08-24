<template>
  <nav
    class="w-full min-h-[60px] bg-white dark:bg-custom-black px-3 pt-2 dark:text-gray-300 sticky top-0 z-[1500] border-b dark:border-gray-700 border-custom-border"
  >
    <div class="container mx-auto flex justify-between items-center">
      <NuxtLink
        class="text-start font-space-grotesk pb-1 hover:text-custom-orange transition-colors scroll-mt-[80px] cursor-pointer flex flex-col text-sm"
        to="/"
      >
        <div class="font-bold truncate">
          {{ $t('header.title') }}
        </div>
        <div class="text-xs">
          {{ $t('header.subtitle[0]') }}
        </div>
        <div class="text-xs">
          {{ $t('header.subtitle[1]') }}
        </div>
      </NuxtLink>
      <HeaderMenuDesctop :active-section="activeSection" />
      <HeaderButtons :is-menu-open="isMenuOpen" @toggle-menu="toggleMenu" @toggle-search="toggleSearch" />
    </div>
    <HeaderMenuMobile :is-menu-open="isMenuOpen" @close-menu="isMenuOpen = false" />
    <Transition
      enter-active-class="transition-all duration-300 ease-in-out"
      enter-from-class="max-h-0 opacity-0"
      enter-to-class="max-h-20 opacity-100"
      leave-active-class="transition-all duration-300 ease-in-out"
      leave-from-class="max-h-20 opacity-100"
      leave-to-class="max-h-0 opacity-0"
    >
      <div v-if="isSearchVisible" class="overflow-hidden">
        <HeaderSearchInput />
      </div>
    </Transition>
  </nav>
</template>

<script setup>
const isMenuOpen = ref(false);
const isSearchVisible = ref(false);
// const menuOpen = ref(false);
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
const toggleSearch = () => {
  isSearchVisible.value = !isSearchVisible.value;
};

const activeSection = ref('');
</script>
