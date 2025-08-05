<script setup lang="ts">
const { t, locale } = useI18n();

interface MenuItem {
  to?: string;
  children?: MenuItem[];
  [key: string]: unknown; // ← якщо є додаткові поля
}

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

// State for managing popover visibility
const activePopover = ref<string | null>(null);
let hoverTimeout: ReturnType<typeof setTimeout> | null = null;

const showPopover = (itemLabel: string) => {
  if (hoverTimeout) {
    clearTimeout(hoverTimeout);
    hoverTimeout = null;
  }
  activePopover.value = itemLabel;
};

const hidePopover = () => {
  hoverTimeout = setTimeout(() => {
    activePopover.value = null;
  }, 150); // Small delay to allow moving to submenu
};

const keepPopoverOpen = () => {
  if (hoverTimeout) {
    clearTimeout(hoverTimeout);
    hoverTimeout = null;
  }
};

// Computed property for menu items with dynamic translations and locale prefix
const menuItems = computed(() => {
  const prefix = locale.value === 'en' ? '/en' : ''; // Add /en prefix for English

  const addPrefix = (item: MenuItem): MenuItem => ({
    ...item,
    to: item.to ? `${prefix}${item.to}` : undefined,
    children: item.children?.map(addPrefix),
  });

  const items = [
    {
      label: t('header.menu.home'),
      icon: 'i-lucide-house',
      to: '/',
    },
    {
      label: t('header.menu.about'),
      icon: 'i-lucide-book-open',
      to: '/about',
      children: [
        {
          label: t('header.menu.team'),
          icon: 'i-lucide-users-round',
          to: '/about/#team',
          description: 'Познайомтеся з нашою командою',
        },
        {
          label: t('header.menu.partners'),
          icon: 'i-lucide-handshake',
          to: '/about/#partners',
          description: 'Наші партнери та співробітники',
        },
        {
          label: t('header.menu.reporting'),
          icon: 'i-lucide-briefcase-business',
          to: '/about/#reporting',
          description: 'Звіти та документація',
        },
        {
          label: t('header.menu.contacts'),
          icon: 'i-lucide-contact',
          to: '/about/#contacts',
          description: "Як з нами зв'язатися",
        },
      ],
    },
    {
      label: t('header.menu.news'),
      icon: 'i-lucide-newspaper',
      to: '/blogs',
    },
    {
      label: t('header.menu.resources'),
      icon: 'i-lucide-box',
      to: '/resources',
      children: [
        {
          label: t('header.menu.housing'),
          icon: 'i-lucide-school',
          to: '/resources/#housing',
          description: 'Допомога з житлом та проживанням',
        },
        {
          label: t('header.menu.employment'),
          icon: 'i-lucide-pickaxe',
          to: '/resources/#employment',
          description: 'Пошук роботи та працевлаштування',
        },
        {
          label: t('header.menu.support'),
          icon: 'i-lucide-file-text',
          to: '/resources/#support',
          description: 'Підтримка та консультації',
        },
      ],
    },
  ];

  return items.map(addPrefix);
});

// State for mobile dropdown management
const activeMobileDropdown = ref<string | null>(null);

const toggleMobileDropdown = (itemLabel: string) => {
  activeMobileDropdown.value = activeMobileDropdown.value === itemLabel ? null : itemLabel;
};

// Separate items for mobile vertical navigation (simple items without children)
// const simpleMobileItems = computed(() => {
//   return menuItems.value.filter((item) => !item.children || item.children.length === 0);
// });
</script>

<template>
  <div class="w-full md:w-auto">
    <!-- Mobile Navigation -->
    <div v-if="isMobile" class="w-48 border-b border-default">
      <div class="space-y-1 py-2">
        <template v-for="item in menuItems" :key="item.label">
          <!-- Items with children - use UDropdown -->
          <div v-if="item.children && item.children.length > 0" class="relative">
            <UDropdown
              :items="[
                item.children.map((child: { to: string; [key: string]: any }) => ({
                  ...child,
                  click: () => navigateTo(child.to),
                })),
              ]"
              :open="activeMobileDropdown === item.label"
              :popper="{
                placement: 'right-start',
                offsetDistance: 8,
              }"
              :ui="{
                item: {
                  base: 'group flex items-center gap-3 w-full',
                  padding: 'px-3 py-2.5',
                  size: 'text-sm',
                  active: 'bg-orange-50 dark:bg-orange-950/50 text-[#FF5500] dark:text-orange-400',
                  inactive:
                    'text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:text-[#FF5500] dark:hover:text-orange-400',
                  icon: {
                    base: 'flex-shrink-0 h-4 w-4',
                    active: 'text-[#FF5500] dark:text-orange-400',
                    inactive:
                      'text-gray-400 dark:text-gray-500 group-hover:text-[#FF5500] dark:group-hover:text-orange-400',
                  },
                },
                width: 'w-52',
                background: 'bg-white dark:bg-gray-900',
                shadow: 'shadow-lg',
                rounded: 'rounded-md',
                ring: 'ring-1 ring-gray-200 dark:ring-gray-700',
                padding: 'p-1',
              }"
            >
              <template #default>
                <button
                  class="group flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-left rounded-md transition-colors duration-150"
                  :class="{
                    'bg-orange-50 dark:bg-orange-950/50 text-[#FF5500] dark:text-orange-400':
                      $route.path.startsWith(item.to) || activeMobileDropdown === item.label,
                    'text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:text-[#FF5500] dark:hover:text-orange-400':
                      !($route.path.startsWith(item.to) || activeMobileDropdown === item.label),
                  }"
                  @click="toggleMobileDropdown(item.label)"
                >
                  <div class="flex items-center gap-3">
                    <UIcon
                      :name="item.icon"
                      class="h-4 w-4 flex-shrink-0"
                      :class="{
                        'text-[#FF5500] dark:text-orange-400':
                          $route.path.startsWith(item.to) || activeMobileDropdown === item.label,
                        'text-gray-400 dark:text-gray-500 group-hover:text-[#FF5500] dark:group-hover:text-orange-400':
                          !($route.path.startsWith(item.to) || activeMobileDropdown === item.label),
                      }"
                    />
                    <span>{{ item.label }}</span>
                  </div>
                  <UIcon
                    name="i-lucide-chevron-right"
                    class="h-4 w-4 transition-transform duration-200"
                    :class="{
                      'transform rotate-90': activeMobileDropdown === item.label,
                      'text-[#FF5500] dark:text-orange-400':
                        $route.path.startsWith(item.to) || activeMobileDropdown === item.label,
                      'text-gray-400 dark:text-gray-500 group-hover:text-[#FF5500] dark:group-hover:text-orange-400': !(
                        $route.path.startsWith(item.to) || activeMobileDropdown === item.label
                      ),
                    }"
                  />
                </button>
              </template>
            </UDropdown>

            <!-- Collapsible submenu for mobile (alternative approach) -->
            <div
              v-if="activeMobileDropdown === item.label"
              class="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-4"
            >
              <NuxtLink
                v-for="child in item.children"
                :key="child.label"
                :to="child.to"
                class="group flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors duration-150"
                :class="{
                  'bg-orange-50 dark:bg-orange-950/50 text-[#FF5500] dark:text-orange-400': $route.path === child.to,
                  'text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:text-[#FF5500] dark:hover:text-orange-400':
                    $route.path !== child.to,
                }"
                @click="activeMobileDropdown = null"
              >
                <UIcon
                  :name="child.icon"
                  class="h-4 w-4 flex-shrink-0"
                  :class="{
                    'text-[#FF5500] dark:text-orange-400': $route.path === child.to,
                    'text-gray-400 dark:text-gray-500 group-hover:text-[#FF5500] dark:group-hover:text-orange-400':
                      $route.path !== child.to,
                  }"
                />
                <span>{{ child.label }}</span>
              </NuxtLink>
            </div>
          </div>

          <!-- Items without children - regular links -->
          <NuxtLink
            v-else
            :to="item.to"
            class="group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-150"
            :class="{
              'bg-orange-50 dark:bg-orange-950/50 text-[#FF5500] dark:text-orange-400': $route.path === item.to,
              'text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:text-[#FF5500] dark:hover:text-orange-400':
                $route.path !== item.to,
            }"
          >
            <UIcon
              :name="item.icon"
              class="h-4 w-4 flex-shrink-0"
              :class="{
                'text-[#FF5500] dark:text-orange-400': $route.path === item.to,
                'text-gray-400 dark:text-gray-500 group-hover:text-[#FF5500] dark:group-hover:text-orange-400':
                  $route.path !== item.to,
              }"
            />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </template>
      </div>
    </div>

    <!-- Desktop Navigation with UPopover -->
    <nav v-else class="flex items-center space-x-1 border-b border-default">
      <template v-for="item in menuItems" :key="item.label">
        <!-- Items with children - use UPopover -->
        <div
          v-if="item.children && item.children.length > 0"
          class="relative"
          @mouseenter="showPopover(item.label)"
          @mouseleave="hidePopover"
        >
          <UPopover
            :open="activePopover === item.label"
            :popper="{
              placement: 'bottom-start',
              offsetDistance: 8,
              strategy: 'fixed',
            }"
            :ui="{
              background: 'bg-white dark:bg-gray-900',
              shadow: 'shadow-lg',
              rounded: 'rounded-lg',
              ring: 'ring-1 ring-gray-200 dark:ring-gray-700',
              width: 'w-72',
            }"
          >
            <template #default>
              <UButton
                :to="item.to"
                variant="ghost"
                color="gray"
                class="justify-between"
                :class="{
                  'bg-orange-50 dark:bg-orange-950/50 text-[#FF5500] dark:text-orange-400':
                    $route.path.startsWith(item.to) || activePopover === item.label,
                }"
                :ui="{
                  base: 'focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium text-sm gap-x-2 px-3 py-2 shadow-sm ring-1 ring-inset ring-transparent',
                  rounded: 'rounded-md',
                }"
              >
                <div class="flex items-center gap-2">
                  <UIcon v-if="item.icon" :name="item.icon" class="h-4 w-4" />
                  <span>{{ item.label }}</span>
                </div>
                <UIcon
                  name="i-lucide-chevron-down"
                  class="h-4 w-4 transition-transform duration-200"
                  :class="{ 'transform rotate-180': activePopover === item.label }"
                />
              </UButton>
            </template>

            <template #panel>
              <div class="p-4" @mouseenter="keepPopoverOpen" @mouseleave="hidePopover">
                <!-- Header for submenu -->
                <div class="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <UIcon :name="item.icon" class="h-5 w-5 text-[#FF5500]" />
                  <h3 class="font-semibold text-gray-900 dark:text-white">
                    {{ item.label }}
                  </h3>
                </div>

                <!-- Submenu items -->
                <div class="space-y-1">
                  <NuxtLink
                    v-for="child in item.children"
                    :key="child.label"
                    :to="child.to"
                    class="group flex items-start gap-3 p-3 rounded-lg transition-colors duration-150"
                    :class="{
                      'bg-orange-50 dark:bg-orange-950/50': $route.path === child.to,
                      'hover:bg-gray-50 dark:hover:bg-gray-800': $route.path !== child.to,
                    }"
                    @click="activePopover = null"
                  >
                    <div class="flex-shrink-0 mt-0.5">
                      <UIcon
                        :name="child.icon"
                        class="h-4 w-4 transition-colors"
                        :class="{
                          'text-[#FF5500]': $route.path === child.to,
                          'text-gray-400 group-hover:text-[#FF5500]': $route.path !== child.to,
                        }"
                      />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div
                        class="font-medium transition-colors"
                        :class="{
                          'text-[#FF5500] dark:text-orange-400': $route.path === child.to,
                          'text-gray-900 dark:text-white group-hover:text-[#FF5500] dark:group-hover:text-orange-400':
                            $route.path !== child.to,
                        }"
                      >
                        {{ child.label }}
                      </div>
                      <div v-if="child.description" class="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-snug">
                        {{ child.description }}
                      </div>
                    </div>
                  </NuxtLink>
                </div>

                <!-- Footer with "View All" link -->
                <div class="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <NuxtLink
                    :to="item.to"
                    class="flex items-center gap-2 text-sm font-medium text-[#FF5500] hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
                    @click="activePopover = null"
                  >
                    <span>Переглянути всі {{ item.label.toLowerCase() }}</span>
                    <UIcon name="i-lucide-arrow-right" class="h-4 w-4" />
                  </NuxtLink>
                </div>
              </div>
            </template>
          </UPopover>
        </div>

        <!-- Items without children - regular buttons -->
        <UButton
          v-else
          :to="item.to"
          variant="ghost"
          color="gray"
          :class="{
            'bg-orange-50 dark:bg-orange-950/50 text-[#FF5500] dark:text-orange-400': $route.path === item.to,
          }"
          :ui="{
            base: 'focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium text-sm gap-x-2 px-3 py-2 shadow-sm ring-1 ring-inset ring-transparent',
            rounded: 'rounded-md',
          }"
        >
          <UIcon v-if="item.icon" :name="item.icon" class="h-4 w-4" />
          <span>{{ item.label }}</span>
        </UButton>
      </template>
    </nav>
  </div>
</template>
