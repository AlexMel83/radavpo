<template>
  <div :class="{ 'header-main': true, 'home-page': isHomePage }">
    <div class="header-wrapper">
      <div class="logo-container">
        <div class="cursor-pointer logo py-2" @click="hideMenu">
          <NuxtLink to="/" class="inline-block relative">
            <div class="absolute inset-0 bg-white blur-sm" />
            <img
              src="/cfhope-logo-tranparent.png"
              alt="logo"
              class="relative h-auto w-12 object-contain"
            />
          </NuxtLink>
        </div>
        <Menu />
        <div class="header-buttons">
          <div class="pr-2">
            <div class="flex items-center px-1">
              <button
                v-for="(lang, index) in locales"
                :key="lang.code"
                :class="{
                  'text-primary-300 hover:text-primary-500':
                    lang.code === currentLocale,
                }"
                class="flex items-center"
                @click="changeLanguage(lang.code)"
              >
                <span class="hover:scale-110">{{ lang.name }}</span>
                <span v-if="index < locales.length - 1" class="text-white px-1"
                  >|</span
                >
              </button>
            </div>
          </div>
          <ColorMode class="color-mode" />
          <button class="md:hidden" @click="toggleMenu">
            <IconsBarsIcon v-if="!menuOpen" class="h-8 w-8 hover:scale-110" />
            <IconsCloseIcon
              v-else
              class="h-8 w-8 text-white hover:scale-110 hover:text-white"
            />
          </button>
          <template v-if="!isAuthed">
            <button
              class="hidden md:block text-white rounded hover:scale-110 focus:outline-none min-w-[70px] py-2"
              @click="openLoginModal"
            >
              {{ $t('header.enter') }}
            </button>
          </template>
          <button
            icon
            class="search-icon mx-3"
            :class="{ 'text-primary-300': isSearchVisible }"
            @click="toggleSearch"
          >
            <IconsMagnifyingGlassIcon class="h-6 w-6" />
          </button>
        </div>
      </div>
      <div class="mt-4">
        <LoginRegistration
          ref="loginRegistrationRef"
          @modal-closed="handleModalClosed"
        />
      </div>
      <p class="text-center text-gray-200 mb-2 text-xl">
        <span class="font-bold">{{ $t('header.title') }}</span>
        {{ $t('header.subtitle') }}
      </p>
      <div v-if="isSearchVisible" class="search-container">
        <SearchInput />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth.store';
import Menu from './Menu.vue';
import LoginRegistration from '@/components/modal/LoginRegistration.vue';

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

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
  if (menuOpen.value) {
    openLoginModal();
  }
};

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
