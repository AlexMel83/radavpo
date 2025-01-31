<template>
  <div class="menu-group mx-auto">
    <ul class="flex flex-col p-0 m-0 list-none space-y-2 text-right">
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
        <div class="flex">
          <NuxtLink
            class="hover:text-primary-300 p-1 inline-block transition-colors border-b-2 border-transparent hover:border-primary-300 ml-auto"
            to="/about"
          >
            {{ $t('menu.about') }}
          </NuxtLink>
          <button aria-label="submenu" class="ml-2" @click="isMenuAboutOpen = !isMenuAboutOpen">
            <CollapsedIcon v-if="!isMenuAboutOpen" />
            <ExpandedIcon v-if="isMenuAboutOpen" class="text-primary-300" />
          </button>
        </div>
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
        <div class="flex">
          <NuxtLink
            class="hover:text-primary-300 p-1 inline-block transition-colors border-b-2 border-transparent hover:border-primary-300 ml-auto"
            to="/page_under_construction"
          >
            {{ $t('menu.resources') }}
          </NuxtLink>
          <button aria-label="submenu" class="ml-2" @click="isMenuResourcesOpen = !isMenuResourcesOpen">
            <CollapsedIcon v-if="!isMenuResourcesOpen" />
            <ExpandedIcon v-if="isMenuResourcesOpen" class="text-primary-300" />
          </button>
        </div>
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
      </li>
      <!-- Join -->
      <li class="relative text-sm sm:text-base lg:text-lg">
        <div class="flex">
          <NuxtLink
            class="hover:text-primary-300 p-1 inline-block transition-colors border-b-2 border-transparent hover:border-primary-300 ml-auto"
            to="/join"
          >
            {{ $t('menu.join') }}
          </NuxtLink>
          <button aria-label="submenu" class="ml-2" @click="isMenuJoinOpen = !isMenuJoinOpen">
            <CollapsedIcon v-if="!isMenuJoinOpen" />
            <ExpandedIcon v-if="isMenuJoinOpen" class="text-primary-300" />
          </button>
        </div>
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
      </li>
    </ul>
  </div>
</template>

<script setup>
import CollapsedIcon from '~/components/icons/CollapsedIcon.vue';
import ExpandedIcon from '~/components/icons/ExpandedIcon.vue';

const isMenuResourcesOpen = ref(false);
const isMenuAboutOpen = ref(false);
const isMenuJoinOpen = ref(false);
</script>
