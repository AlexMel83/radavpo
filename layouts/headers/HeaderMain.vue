<template>
  <div :class="{ 'header-main': true, 'home-page': isHomePage }">
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
            <div class="text-start flex flex-col text-gray-200 text-sm sm:text-base lg:text-lg">
              <div class="font-bold truncate">
                {{ $t('header.title') }}
              </div>
              <span class="truncate">{{ $t('header.subtitle') }}</span>
            </div>
          </NuxtLink>
        </div>

        <!-- Меню (занимает доступное пространство) -->
        <div class="flex-1 flex justify-center min-w-[150px] sm:min-w-[200px]">
          <MenuDesctop />
        </div>

        <!-- Кнопки справа -->
        <div
          class="header-buttons flex items-center justify-end gap-1 px-1 text-sm sm:text-base lg:text-lg flex-1 min-w-[120px] sm:min-w-[150px] lg:min-w-[200px]"
        >
          <div class="languages_toggle flex flex-col items-start px-1">
            <button
              v-for="lang in locales"
              :key="lang.code"
              :class="{ 'text-primary-300 hover:text-primary-500': lang.code === currentLocale }"
              class="flex items-center w-full border-t border-white first:border-t-0"
              @click="changeLanguage(lang.code)"
            >
              <span class="hover:scale-110">{{ lang.name }}</span>
            </button>
          </div>
          <div class="flex flex-col items-center">
            <ColorMode class="color-mode" />
            <button icon class="search-icon" :class="{ 'text-primary-300': isSearchVisible }" @click="toggleSearch">
              <IconsMagnifyingGlassIcon class="h-5 w-5" />
            </button>
          </div>

          <button
            v-if="!isAuthed"
            class="cabinet hidden md:block text-white rounded hover:scale-110 focus:outline-none min-w-[70px] py-2"
            @click="openLoginModal"
          >
            <IconsUser class="mx-auto h-5 w-5" /> {{ $t('header.enter') }}
          </button>
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
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '~/stores/app.store';
import LoginRegistration from '@/components/modal/LoginRegistration.vue';
import SearchInput from './SearchInput.vue';
import ColorMode from './ColorMode.vue';
import MenuDesctop from './MenuDesctop.vue';

const loginRegistrationRef = ref(null);
const authStore = useAuthStore();
const menuOpen = ref(false);
const route = useRoute();
const router = useRouter();

const isHomePage = computed(() => route.path === '/');
const isAuthed = computed(() => authStore.isAuthed);
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
  menuOpen.value = false;
};

// const toggleMenu = () => {
//   menuOpen.value = !menuOpen.value;
//   if (menuOpen.value) {
//     openLoginModal();
//   }
// };

const toggleSearch = () => {
  isSearchVisible.value = !isSearchVisible.value;
};

const handleModalClosed = () => {
  menuOpen.value = false;
};
</script>

<style scoped>
.search-container,
.color-mode {
  margin-right: 10px;
}
.search-icon:hover {
  transform: scale(1.1);
}

.header-main {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: var(--header-bg);
  color: var(--white-color);
  position: relative;
}

.logo img {
  width: 50px;
  height: 30px;
}

.logo-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 10px;
}

.header-btn {
  margin-left: 24px;
  height: 30px;
  display: none;
  text-transform: capitalize;
}

.burger {
  margin-left: 15px;
  color: white;
  background-color: transparent;
  box-shadow: none;
}

.menu {
  position: relative;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: var(--header-bg);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3px 0 0 0;
}

.header-menu-btn {
  width: 100%;
  max-width: 343px;
  height: 46px;
  text-transform: capitalize;
}

.header-menu-btn:active {
  border-radius: 4px;
  border: 1px solid var(--btn-border);
  background: var(--white-color);
}

.header-menu-btn:not(:last-child) {
  margin-bottom: 24px;
}

.header-buttons {
  height: 30px;
  display: flex;
  align-items: center;
}

.lang-active {
  font-weight: 700;
}

.bold {
  font-size: 2.25rem;
  font-weight: 900;
}
.is-user {
  margin-right: 20px;
  font-size: 16px;
}
.is-user span {
  margin-right: 5px;
}

@media (min-width: 768px) {
  .header-main.home-page {
    background-image: url('~/assets/header_bg.png');
    background-size: cover;
  }

  .logo img {
    width: 84px;
    height: 50px;
  }

  .burger {
    display: none;
  }

  .header-btn {
    display: block;
    letter-spacing: normal;
    font-size: 16px;
    padding: 0 12px;
  }

  .header-buttons {
    display: flex;
    align-items: center;
  }
  /* .menu {
    display: none;
  } */

  @media (min-width: 1024px) {
  }
}
</style>
