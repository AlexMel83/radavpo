<template>
  <div v-auto-animate class="menu-group mx-auto">
    <HeaderButtons
      class="flex md:hidden"
      :is-search-visible="isSearchVisible"
      @toggle-search="toggleSearch"
      @open-login-modal="openLoginModal"
    />

    <!-- <button
      v-if="!isAuthed"
      class="cabinet flex text-white rounded hover:scale-105 focus:outline-none min-w-[70px] py-2 ml-auto"
      aria-label="cabinet"
      @click="isLoginMobaileOpen = !isLoginMobaileOpen"
    >
      {{ isLoginMobaileOpen ? $t('header.autorization_close') : $t('header.enter') }}
      <IconsUser v-if="!isLoginMobaileOpen" class="mx-auto h-5 w-5" />
      <IconsCloseIcon v-else class="mx-1 h-6 w-6 text-white" />
    </button> -->

    <LoginRegistrationMobile v-if="isLoginMobaileOpen" />

    <transition name="fade-slide" mode="out-in">
      <div v-show="isSearchVisible" class="search-container my-2">
        <SearchInput />
      </div>
    </transition>

    <ul class="flex flex-col p-0 m-0 list-none space-y-2 text-right mt-5">
      <!-- Home -->
      <li class="text-sm sm:text-base lg:text-lg">
        <NuxtLink
          class="hover:text-primary-300 p-1 inline-block transition-colors border-b-2 border-transparent hover:border-primary-300"
          to="/"
        >
          {{ $t('menu.home') }}
        </NuxtLink>
      </li>

      <!-- About -->
      <li class="relative text-sm sm:text-base lg:text-lg">
        <div class="flex items-center">
          <NuxtLink
            class="hover:text-primary-300 p-1 inline-block transition-colors border-b-2 border-transparent hover:border-primary-300 ml-auto"
            to="/about"
          >
            {{ $t('menu.about') }}
          </NuxtLink>
          <div class="relative w-6 h-6 ml-2">
            <button aria-label="submenu" class="w-full h-full" @click="isMenuAboutOpen = !isMenuAboutOpen">
              <CollapsedIcon
                class="absolute transition-all duration-300 ease-in-out"
                :class="isMenuAboutOpen ? 'opacity-0 scale-90' : 'opacity-100 scale-100'"
              />
              <ExpandedIcon
                class="absolute text-primary-300 transition-all duration-300 ease-in-out"
                :class="isMenuAboutOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90'"
              />
            </button>
          </div>
        </div>

        <transition name="fade-slide" mode="out-in">
          <ul v-show="isMenuAboutOpen" class="space-y-2 pl-4 mt-2 bg-gray-800 rounded-md p-2 ml-auto">
            <li>
              <NuxtLink
                class="block p-1 hover:bg-gray-700 hover:text-primary-300 transition-colors"
                to="/page_under_construction"
              >
                {{ $t('menu.reporting') }}
              </NuxtLink>
            </li>
          </ul>
        </transition>
      </li>

      <!-- Blog -->
      <li class="text-sm sm:text-base lg:text-lg">
        <NuxtLink
          class="hover:text-primary-300 p-1 inline-block transition-colors border-b-2 border-transparent hover:border-primary-300"
          to="/page_under_construction"
        >
          {{ $t('menu.blog') }}
        </NuxtLink>
      </li>

      <!-- Resources -->
      <li class="relative text-sm sm:text-base lg:text-lg">
        <div class="flex items-center">
          <NuxtLink
            class="hover:text-primary-300 p-1 inline-block transition-colors border-b-2 border-transparent hover:border-primary-300 ml-auto"
            to="/page_under_construction"
          >
            {{ $t('menu.resources') }}
          </NuxtLink>
          <div class="relative w-6 h-6 ml-2">
            <button aria-label="submenu" class="w-full h-full" @click="isMenuResourcesOpen = !isMenuResourcesOpen">
              <CollapsedIcon
                class="absolute transition-all duration-300 ease-in-out"
                :class="isMenuResourcesOpen ? 'opacity-0 scale-90' : 'opacity-100 scale-100'"
              />
              <ExpandedIcon
                class="absolute text-primary-300 transition-all duration-300 ease-in-out"
                :class="isMenuResourcesOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90'"
              />
            </button>
          </div>
        </div>

        <transition name="fade-slide" mode="out-in">
          <ul v-show="isMenuResourcesOpen" class="space-y-2 pl-4 mt-2 bg-gray-800 rounded-md p-2 ml-auto">
            <li>
              <NuxtLink
                class="block p-1 hover:bg-gray-700 hover:text-primary-300 transition-colors"
                to="/page_under_construction"
              >
                {{ $t('menu.housing') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                class="block p-1 hover:bg-gray-700 hover:text-primary-300 transition-colors"
                to="/page_under_construction"
              >
                {{ $t('menu.employment') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                class="block p-1 hover:bg-gray-700 hover:text-primary-300 transition-colors"
                to="/page_under_construction"
              >
                {{ $t('menu.support') }}
              </NuxtLink>
            </li>
          </ul>
        </transition>
      </li>

      <!-- Join -->
      <li class="relative text-sm sm:text-base lg:text-lg">
        <div class="flex items-center">
          <NuxtLink
            class="hover:text-primary-300 p-1 inline-block transition-colors border-b-2 border-transparent hover:border-primary-300 ml-auto"
            to="/join"
          >
            {{ $t('menu.join') }}
          </NuxtLink>
          <div class="relative w-6 h-6 ml-2">
            <button aria-label="submenu" class="w-full h-full" @click="isMenuJoinOpen = !isMenuJoinOpen">
              <CollapsedIcon
                class="absolute transition-all duration-300 ease-in-out"
                :class="isMenuJoinOpen ? 'opacity-0 scale-90' : 'opacity-100 scale-100'"
              />
              <ExpandedIcon
                class="absolute text-primary-300 transition-all duration-300 ease-in-out"
                :class="isMenuJoinOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90'"
              />
            </button>
          </div>
        </div>

        <transition name="fade-slide" mode="out-in">
          <ul v-show="isMenuJoinOpen" class="space-y-2 pl-4 mt-2 bg-gray-800 rounded-md p-2 ml-auto">
            <li>
              <NuxtLink
                class="block p-1 hover:bg-gray-700 hover:text-primary-300 transition-colors"
                to="/page_under_construction"
              >
                {{ $t('menu.donate') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                class="block p-1 hover:bg-gray-700 hover:text-primary-300 transition-colors"
                to="/page_under_construction"
              >
                {{ $t('menu.volunteer') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                class="block p-1 hover:bg-gray-700 hover:text-primary-300 transition-colors"
                to="/page_under_construction"
              >
                {{ $t('menu.newsletter') }}
              </NuxtLink>
            </li>
          </ul>
        </transition>
      </li>
    </ul>
  </div>
</template>

<script setup>
import CollapsedIcon from '~/components/icons/CollapsedIcon.vue';
import ExpandedIcon from '~/components/icons/ExpandedIcon.vue';
// import IconsUser from '~/components/icons/User.vue';
// import IconsCloseIcon from '~/components/icons/CloseIcon.vue';
import LoginRegistrationMobile from './LoginRegistrationMobile.vue';
// import { useAuthStore } from '~/stores/app.store';
import HeaderButtons from './HeaderButtons.vue';
import SearchInput from './SearchInput.vue';

// const authStore = useAuthStore();
// const isAuthed = computed(() => authStore.isAuthed);

const isLoginMobaileOpen = ref(false);
const isSearchVisible = ref(false);
const isMenuResourcesOpen = ref(false);
const isMenuAboutOpen = ref(false);
const isMenuJoinOpen = ref(false);

const loginRegistrationRef = ref(null);

const toggleSearch = () => {
  isSearchVisible.value = !isSearchVisible.value;
};

const openLoginModal = () => {
  if (loginRegistrationRef.value) {
    loginRegistrationRef.value.openModal();
  }
};
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  @apply transition-all duration-300 ease-in-out;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  @apply opacity-0 -translate-y-2;
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  @apply opacity-100 translate-y-0;
}
</style>
