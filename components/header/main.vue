<template>
  <nav
    class="w-full min-h-[60px] px-4 py-2 bg-white dark:bg-custom-black dark:text-custom-white sticky top-0 z-[1500] border-b dark:border-gray-700 border-custom-border"
  >
    <div class="container mx-auto flex justify-between items-center">
      <div
        class="font-space-grotesk hover:text-custom-orange transition-colors scroll-mt-[80px] cursor-pointer text-start sm-md:max-w-[250px] flex flex-col text-sm md:text-base lg:text-lg"
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
      </div>
      <HeaderMenuDesctop :active-section="activeSection" />
      <HeaderButtons :is-menu-open="isMenuOpen" @toggle-menu="toggleMenu" @toggle-search="toggleSearch" />
    </div>
    <HeaderMenuMobile :is-menu-open="isMenuOpen" @close-menu="isMenuOpen = false" />
    <div>
      <ModalLoginRegistration ref="loginRegistrationRef" @modal-closed="handleModalClosed" />
    </div>
    <div v-if="isSearchVisible" class="search-container">
      <HeaderSearchInput />
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';

const isMenuOpen = ref(false);
const isSearchVisible = ref(false);
const menuOpen = ref(false);
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
const toggleSearch = () => {
  isSearchVisible.value = !isSearchVisible.value;
};
const handleModalClosed = () => {
  menuOpen.value = false;
};

const activeSection = ref('');

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
    activeSection.value = sectionId;
  } else {
    console.warn(`Element with id "${sectionId}" not found`);
  }
};
</script>
