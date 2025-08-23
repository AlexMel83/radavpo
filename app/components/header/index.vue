<template>
  <nav
    class="w-full min-h-[60px] bg-white dark:bg-custom-black px-3 pt-2 dark:text-custom-white sticky top-0 z-[1500] border-b dark:border-gray-700 border-custom-border"
  >
    <div class="container mx-auto flex justify-between items-center">
      <button
        class="text-start font-space-grotesk pb-1 hover:text-custom-orange transition-colors scroll-mt-[80px] cursor-pointer flex flex-col text-sm"
        @click="scrollToSection('home')"
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
      </button>
      <HeaderMenuDesctop :active-section="activeSection" />
      <HeaderButtons :is-menu-open="isMenuOpen" @toggle-menu="toggleMenu" @toggle-search="toggleSearch" />
    </div>
    <HeaderMenuMobile :is-menu-open="isMenuOpen" @close-menu="isMenuOpen = false" />
    <div v-if="isSearchVisible">
      <HeaderSearchInput />
    </div>
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

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const offset = 80; // висота хедера
    const top = element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
    activeSection.value = sectionId;
  } else {
    console.warn(`Element with id "${sectionId}" not found`);
  }
};
</script>
