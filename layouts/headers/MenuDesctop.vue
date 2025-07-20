<template>
  <div class="menu-group mx-auto">
    <ul class="flex justify-around p-0 m-0 list-none">
      <li class="relative mx-1 lg:mx-2 text-sm sm:text-base lg:text-lg">
        <NuxtLink
          class="hover:text-primary-300 p-1 inline-block transition-colors border-b-2 border-transparent hover:border-primary-300"
          to="/"
        >
          {{ $t('menu.home') }}
        </NuxtLink>
      </li>
      <li
        class="relative mx-1 lg:mx-2 flex items-center group text-sm sm:text-base lg:text-lg"
        @mouseenter="isMenuAboutOpen = true"
        @mouseleave="isMenuAboutOpen = false"
      >
        <NuxtLink
          class="hover:text-primary-300 whitespace-nowrap p-1 inline-block transition-colors border-b-2 border-transparent group-hover:border-primary-300"
          to="/about"
        >
          {{ $t('menu.about') }}
        </NuxtLink>
        <ul
          class="absolute z-50 right-3 top-full opacity-0 scale-y-95 pointer-events-none group-hover:opacity-100 group-hover:scale-y-100 group-hover:pointer-events-auto bg-gray-800 shadow-md rounded-md p-1 transform origin-top transition-all duration-300 ease-out"
        >
          <li>
            <NuxtLink
              class="block p-1 hover:bg-gray-700 hover:text-primary-300 transition-colors border-b-2 border-transparent hover:border-primary-300"
              to="/page_under_construction"
            >
              {{ $t('menu.reporting') }}
            </NuxtLink>
          </li>
        </ul>
        <ExpandedIcon
          :class="['text-primary-300 transition-transform duration-300', isMenuAboutOpen ? 'rotate-180' : 'rotate-0']"
        />
      </li>
      <li class="relative mx-1 lg:mx-2 text-sm sm:text-base lg:text-lg">
        <NuxtLink
          class="hover:text-primary-300 p-1 inline-block transition-colors border-b-2 border-transparent hover:border-primary-300"
          to="/blogs"
        >
          {{ $t('menu.blog') }}
        </NuxtLink>
      </li>
      <li
        class="relative mx-1 lg:mx-2 flex items-center group text-sm sm:text-base lg:text-lg"
        @mouseenter="isMenuResourcesOpen = true"
        @mouseleave="isMenuResourcesOpen = false"
      >
        <NuxtLink
          class="hover:text-primary-300 p-1 inline-block transition-colors border-b-2 border-transparent group-hover:border-primary-300"
          to="/page_under_construction"
        >
          {{ $t('menu.resources') }}
        </NuxtLink>
        <ul
          class="absolute z-50 right-3 top-full opacity-0 scale-y-95 pointer-events-none group-hover:opacity-100 group-hover:scale-y-100 group-hover:pointer-events-auto bg-gray-800 shadow-md rounded-md p-1 transform origin-top transition-all duration-300 ease-out"
        >
          <li>
            <NuxtLink
              class="block whitespace-nowrap p-1 hover:bg-gray-700 hover:text-primary-300 transition-colors border-b-2 border-transparent hover:border-primary-300"
              to="/page_under_construction"
            >
              {{ $t('menu.housing') }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              class="block whitespace-nowrap p-1 hover:bg-gray-700 hover:text-primary-300 transition-colors border-b-2 border-transparent hover:border-primary-300"
              to="/page_under_construction"
            >
              {{ $t('menu.employment') }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              class="block whitespace-nowrap p-1 hover:bg-gray-700 hover:text-primary-300 transition-colors border-b-2 border-transparent hover:border-primary-300"
              to="/page_under_construction"
            >
              {{ $t('menu.support') }}
            </NuxtLink>
          </li>
        </ul>
        <ExpandedIcon
          :class="[
            'text-primary-300 transition-transform duration-300',
            isMenuResourcesOpen ? 'rotate-180' : 'rotate-0',
          ]"
        />
      </li>
      <li
        class="relative mx-1 lg:mx-2 flex items-center group text-sm sm:text-base lg:text-lg"
        @mouseenter="isMenuJoinOpen = true"
        @mouseleave="isMenuJoinOpen = false"
      >
        <NuxtLink
          class="hover:text-primary-300 whitespace-nowrap p-1 inline-block transition-colors border-b-2 border-transparent group-hover:border-primary-300"
          to="/join"
        >
          {{ $t('menu.join') }}
        </NuxtLink>
        <ul
          class="absolute z-50 right-3 top-full opacity-0 scale-y-95 pointer-events-none group-hover:opacity-100 group-hover:scale-y-100 group-hover:pointer-events-auto bg-gray-800 shadow-md rounded-md p-1 transform origin-top transition-all duration-300 ease-out"
        >
          <li>
            <NuxtLink
              class="block whitespace-nowrap p-1 hover:bg-gray-700 hover:text-primary-300 transition-colors border-b-2 border-transparent hover:border-primary-300"
              to="/page_under_construction"
            >
              {{ $t('menu.donate') }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              class="block whitespace-nowrap p-1 hover:bg-gray-700 hover:text-primary-300 transition-colors border-b-2 border-transparent hover:border-primary-300"
              to="/page_under_construction"
            >
              {{ $t('menu.volunteer') }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              class="block whitespace-nowrap p-1 hover:bg-gray-700 hover:text-primary-300 transition-colors border-b-2 border-transparent hover:border-primary-300"
              to="/page_under_construction"
            >
              {{ $t('menu.newsletter') }}
            </NuxtLink>
          </li>
        </ul>
        <ExpandedIcon
          :class="['text-primary-300 transition-transform duration-300', isMenuJoinOpen ? 'rotate-180' : 'rotate-0']"
        />
      </li>
    </ul>
  </div>
</template>

<script setup>
import ExpandedIcon from '~/components/icons/ExpandedIcon.vue';

const isMenuResourcesOpen = ref(false);
const isMenuAboutOpen = ref(false);
const isMenuJoinOpen = ref(false);
</script>
