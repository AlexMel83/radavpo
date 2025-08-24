<template>
  <div class="hidden md:flex space-x-6 px-2 items-center flex-1 justify-center">
    <div
      v-for="item in menuItems"
      :key="item.link"
      class="relative group"
      @mouseenter="showSubMenu(item.link)"
      @mouseleave="hideSubMenu()"
    >
      <NuxtLink
        :to="item.link"
        :class="[{ 'text-custom-orange': activeSection === item.link.replace('/', '') }]"
        class="font-space-grotesk text-custom-black dark:text-custom-white hover:text-custom-orange dark:hover:text-custom-orange transition-colors inline-flex items-center space-x-1"
        @click.prevent="scrollToSection(item.link.replace('/', ''))"
      >
        <span>{{ item.name }}</span>
        <Icon
          v-if="item.subItems && item.subItems.length"
          name="fa-chevron-down"
          :class="[
            'text-xs ml-1 transition-transform duration-300 ease-in-out',
            hoveredMenu === item.link ? 'rotate-180' : '',
          ]"
        />
      </NuxtLink>

      <div
        v-if="item.subItems && item.subItems.length && hoveredMenu === item.link"
        class="absolute top-full right-0 mt-1 w-34 bg-white dark:bg-custom-black border border-custom-border dark:border-gray-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
      >
        <NuxtLink
          v-for="subItem in item.subItems"
          :key="subItem.link.hash"
          :to="subItem.link"
          class="block w-full text-left px-2 py-1 whitespace-nowrap text-sm text-custom-black dark:text-custom-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-custom-orange dark:hover:text-custom-orange transition-colors duration-200"
          @click.prevent="scrollToSection(subItem.link.hash)"
        >
          {{ subItem.name }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineProps({
  activeSection: {
    type: String,
    default: '',
  },
});

const { t } = useI18n();

const hoveredMenu = ref(null);
let timeoutId = null;

const menuItems = computed(() => [
  { name: t('menu.home'), link: '/', subItems: [] },
  { name: t('menu.blog'), link: '/blogs', subItems: [] },
  {
    name: t('menu.resources'),
    link: '/resources',
    subItems: [
      { name: t('menu.housing'), link: { path: '/resources', hash: '#housing' } },
      { name: t('menu.employment'), link: { path: '/resources', hash: '#employment' } },
      { name: t('menu.support'), link: { path: '/resources', hash: '#support' } },
    ],
  },
  {
    name: t('menu.join'),
    link: '/join',
    subItems: [
      { name: t('menu.donate'), link: { path: '/join', hash: '#donate' } },
      { name: t('menu.volunteer'), link: { path: '/join', hash: '#volunteer' } },
    ],
  },
]);

const scrollToSection = (hash) => {
  if (!hash) return;
  const id = hash.replace('#', '');
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const showSubMenu = (itemLink) => {
  clearTimeout(timeoutId);
  hoveredMenu.value = itemLink;
};

const hideSubMenu = () => {
  timeoutId = setTimeout(() => {
    hoveredMenu.value = null;
  }, 200);
};
</script>
