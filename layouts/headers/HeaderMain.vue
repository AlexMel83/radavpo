<template>
  <div class="header-main text-white bg-[var(--header-bg)] sticky top-0 z-50">
    <div class="header-wrapper">
      <!-- Используем flex с равномерным распределением -->
      <div
        class="heder-container flex flex-wrap items-center justify-between w-full min-h-[50px] sm:min-h-[60px] lg:min-h-[70px] px-2"
      >
        <!-- Логотип -->
        <div
          class="logo cursor-pointer p-2 flex items-center space-x-2 flex-1 min-w-[120px] sm:min-w-[150px] lg:min-w-[200px]"
          @click="hideMenu"
        >
          <NuxtLink to="/" class="relative flex items-center space-x-2">
            <div class="text-start sm-md:max-w-[250px] flex flex-col text-gray-200 text-sm md:text-base lg:text-lg">
              <div class="font-bold truncate">
                {{ $t('header.title') }}
              </div>
              <span class="truncate">{{ $t('header.subtitle') }}</span>
            </div>
          </NuxtLink>
        </div>
        <MenuDesctop class="hidden md:flex flex-1 justify-center min-w-[150px] sm:min-w-[200px]" />
        <!-- Кнопки справа -->
        <div
          class="header-buttons hidden md:flex items-center justify-end gap-1 px-1 text-sm sm:text-base lg:text-lg flex-1"
        >
          <div class="languages_toggle flex flex-col items-start px-1">
            <button
              v-for="lang in locales"
              :key="lang.code"
              :class="{ 'text-primary-300 hover:text-primary-500': lang.code === currentLocale }"
              class="flex items-center w-full border-t border-white first:border-t-0"
              aria-label="chengelanguage"
              @click="changeLanguage(lang.code)"
            >
              <span class="hover:scale-110">{{ lang.name }}</span>
            </button>
          </div>
          <div class="flex flex-col items-center gap-1">
            <ColorMode />
            <button
              icon
              class="search-icon"
              aria-label="search"
              :class="{ 'text-primary-300': isSearchVisible }"
              @click="toggleSearch"
            >
              <IconsMagnifyingGlassIcon class="hover:scale-110 h-5 w-5" />
            </button>
          </div>
          <button
            v-if="!isAuthed"
            class="cabinet text-white rounded hover:scale-110 focus:outline-none min-w-[70px] py-2"
            aria-label="cabinet"
            @click="openLoginModal"
          >
            <IconsUser class="mx-auto h-5 w-5" /> {{ $t('header.enter') }}
          </button>
        </div>
        <!-- Мобильное меню -->
        <div class="burger md:hidden">
          <button aria-label="mobilemenubutton" @click="toggleMenu">
            <IconsBarsIcon v-if="!isMenuOpen" class="h-8 w-8 hover:scale-110" />
            <IconsCloseIcon v-else class="h-8 w-8 text-white hover:scale-110 hover:text-white" />
          </button>
          <MenuMobile
            v-if="isMenuOpen"
            class="transition-all duration-300 ease-in-out transform absolute left-0 right-0 bg-[var(--header-bg)] z-10 top-full p-4"
          />
        </div>
      </div>
      <div>
        <LoginRegistration ref="loginRegistrationRef" @modal-closed="handleModalClosed" />
      </div>
      <div v-if="isSearchVisible" class="search-container">
        <SearchInput />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useAuthStore, useAppStore } from '~/stores/app.store';
import LoginRegistration from '@/components/modal/LoginRegistration.vue';
import SearchInput from './SearchInput.vue';
import ColorMode from './ColorMode.vue';
import MenuDesctop from './MenuDesctop.vue';
import MenuMobile from './MenuMobile.vue';

const loginRegistrationRef = ref(null);
const authStore = useAuthStore();
const store = useAppStore();
const menuOpen = ref(false);
const router = useRouter();

const isAuthed = computed(() => authStore.isAuthed);
const isMenuOpen = computed(() => store.menuOpen);
const isSearchVisible = ref(false);

//i18n
const { locale, locales } = useI18n();
const currentLocale = computed(() => locale.value);
const changeLanguage = async (langCode) => {
  try {
    const currentRoute = router.currentRoute.value;
    const newPath =
      langCode === 'uk'
        ? currentRoute.fullPath.replace(/^\/(en|uk)/, '')
        : `/${langCode}${currentRoute.fullPath.replace(/^\/(en|uk)/, '')}`;
    locale.value = langCode;
    await router.push(newPath);
  } catch (error) {
    console.error('Failed to change language:', error);
  }
};

const openLoginModal = () => {
  if (loginRegistrationRef.value) {
    loginRegistrationRef.value.openModal();
  }
};

const hideMenu = () => {
  store.menuOpen = false;
};

const toggleSearch = () => {
  isSearchVisible.value = !isSearchVisible.value;
};

const toggleMenu = () => {
  store.menuOpen = !store.menuOpen;
};

const handleModalClosed = () => {
  menuOpen.value = false;
};
</script>
