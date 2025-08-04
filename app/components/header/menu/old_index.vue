<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  House,
  BookOpen,
  UsersRound,
  Handshake,
  BriefcaseBusiness,
  Contact,
  Newspaper,
  Box,
  School,
  Pickaxe,
  FileText,
  ChevronDown,
  ChevronRight,
} from 'lucide-vue-next';

// i18n setup
const { t, locale } = useI18n();

// Reactive orientation based on screen size
const isMobile = ref(false);

const updateOrientation = () => {
  isMobile.value = window.innerWidth < 768; // Tailwind's 'md' breakpoint (768px)
};

onMounted(() => {
  updateOrientation();
  window.addEventListener('resize', updateOrientation);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateOrientation);
});

// Menu item interface
interface NavigationMenuItem {
  label: string;
  icon?: any; // Lucide icon component
  description?: string;
  to?: string;
  children?: NavigationMenuItem[];
}

// Computed property for menu items with dynamic translations and locale prefix
const items = computed<NavigationMenuItem[][]>(() => {
  const prefix = locale.value === 'en' ? '/en' : '';

  const addPrefix = (item: NavigationMenuItem): NavigationMenuItem => ({
    ...item,
    to: item.to ? `${prefix}${item.to}` : undefined,
    children: item.children?.map(addPrefix),
  });

  return [
    [
      {
        label: t('header.menu.home'),
        icon: House,
        description: t('header.menu.home'),
        to: '/',
        children: [],
      },
      {
        label: t('header.menu.about'),
        icon: BookOpen,
        description: t('header.menu.about'),
        to: '/about',
        children: [
          {
            label: t('header.menu.team'),
            icon: UsersRound,
            description: t('header.menu.team'),
            to: '/terms',
          },
          {
            label: t('header.menu.partners'),
            icon: Handshake,
            description: t('header.menu.partners'),
            to: '/terms',
          },
          {
            label: t('header.menu.reporting'),
            icon: BriefcaseBusiness,
            description: t('header.menu.reporting'),
            to: '/',
          },
          {
            label: t('header.menu.contacts'),
            icon: Contact,
            description: t('header.menu.contacts'),
            to: '/terms',
          },
        ],
      },
      {
        label: t('header.menu.news'),
        icon: Newspaper,
        to: '/news',
        children: [],
      },
      {
        label: t('header.menu.resources'),
        icon: Box,
        to: '/resources',
        children: [
          {
            label: t('header.menu.housing'),
            icon: School,
            description: t('header.menu.housing'),
            to: '/terms',
          },
          {
            label: t('header.menu.employment'),
            icon: Pickaxe,
            to: '/',
          },
          {
            label: t('header.menu.support'),
            icon: FileText,
            description: t('header.menu.support'),
            to: '/terms',
          },
        ],
      },
    ],
  ].map((group) => group.map(addPrefix));
});
</script>

<template>
  <div class="w-full md:w-auto">
    <!-- Desktop Navigation (Horizontal) -->
    <NavigationMenu v-if="!isMobile" class="border-b border-gray-200 dark:border-gray-700">
      <NavigationMenuList class="flex space-x-2">
        <NavigationMenuItem v-for="(item, index) in items[0]" :key="index">
          <NavigationMenuTrigger v-if="item.children?.length">
            <div class="flex items-center space-x-2">
              <component :is="item.icon" class="h-5 w-5" />
              <span>{{ item.label }}</span>
            </div>
          </NavigationMenuTrigger>
          <NavigationMenuLink v-else :href="item.to">
            <div class="flex items-center space-x-2">
              <component :is="item.icon" class="h-5 w-5" />
              <span>{{ item.label }}</span>
            </div>
          </NavigationMenuLink>
          <NavigationMenuContent v-if="item.children?.length">
            <ul class="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <li v-for="(child, childIndex) in item.children" :key="childIndex">
                <NavigationMenuLink
                  :href="child.to"
                  class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  <div class="flex items-center space-x-2">
                    <component :is="child.icon" class="h-4 w-4" />
                    <span class="text-sm font-medium leading-none">{{ child.label }}</span>
                  </div>
                  <p v-if="child.description" class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    {{ child.description }}
                  </p>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>

    <!-- Mobile Navigation (Vertical Dropdown) -->
    <DropdownMenu v-if="isMobile" class="w-48">
      <DropdownMenuTrigger as-child>
        <button
          class="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-left bg-background border border-gray-200 rounded-md dark:border-gray-700"
        >
          <span>{{ t('header.menu.menu') }}</span>
          <ChevronDown class="h-5 w-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-48">
        <div v-for="(item, index) in items[0]" :key="index">
          <DropdownMenuItem v-if="!item.children?.length" :href="item.to" class="flex items-center space-x-2">
            <component :is="item.icon" class="h-5 w-5" />
            <span>{{ item.label }}</span>
          </DropdownMenuItem>
          <DropdownMenu v-else>
            <DropdownMenuTrigger as-child>
              <div class="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-left">
                <div class="flex items-center space-x-2">
                  <component :is="item.icon" class="h-5 w-5" />
                  <span>{{ item.label }}</span>
                </div>
                <ChevronRight class="h-5 w-5" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                v-for="(child, childIndex) in item.children"
                :key="childIndex"
                :href="child.to"
                class="flex items-center space-x-2"
              >
                <component :is="child.icon" class="h-4 w-4" />
                <span>{{ child.label }}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>

<style scoped>
/* Tailwind classes are handled inline, but you can add custom styles here if needed */
</style>
