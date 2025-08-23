<template>
  <div class="flex items-center space-x-3">
    <!-- Переключатель языка -->
    <button class="hover:text-custom-orange dark:hover:text-custom-orange transition-colors" @click="toggleLanguage">
      {{ currentLocale.toUpperCase() === 'UK' ? 'ENG' : 'UKR' }}
    </button>
    <!-- Переключатель цветовой темы -->
    <button
      class="hover:text-custom-orange dark:hover:text-custom-orange transition-colors"
      aria-label="Toggle dark mode"
      @click="appStore.toggleDarkMode"
    >
      <Icon
        :name="`${appStore.isDark ? 'line-md:sunny-filled-loop' : 'line-md:sunny-filled-loop-to-moon-filled-loop-transition'}`"
        сlass="w-8 h-8 block"
      />
    </button>
    <!-- Кнопка поиска -->
    <button
      class="transition-colors w-6 h-6"
      :class="{
        'text-custom-orange': isSearchVisible,
        'hover:text-custom-orange dark:hover:text-custom-orange': !isSearchVisible,
      }"
      aria-label="Search"
      @click="toggleSearch"
    >
      <Icon name="mdi-light:magnify" class="w-6 h-6" />
    </button>
    <!-- Кнопка мобильного меню -->
    <button
      class="md:hidden transition-colors w-6 h-6"
      :class="{
        'text-custom-orange': isMenuOpen,
        'hover:text-custom-orange dark:hover:text-custom-orange': !isMenuOpen,
      }"
      @click="toggleMenu"
    >
      <Icon :name="`${isMenuOpen ? 'material-symbols:close-rounded' : 'humbleicons:bars'}`" />
    </button>
  </div>
</template>

<script setup>
import { useAppStore } from '~/stores/app.store';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const props = defineProps({
  isMenuOpen: {
    type: Boolean,
    default: false,
  },
  isSearchVisible: Boolean,
});

const emit = defineEmits(['toggleMenu', 'toggle-search']);

const appStore = useAppStore();
const { locale } = useI18n();
const currentLocale = computed(() => locale.value);
const router = useRouter();
const localSearchVisible = ref(props.isSearchVisible);

watchEffect(() => {
  localSearchVisible.value = props.isSearchVisible;
});

onMounted(() => {
  if (process.client) {
    if (appStore.isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
});

const toggleLanguage = async () => {
  const newLang = currentLocale.value === 'uk' ? 'en' : 'uk';
  try {
    const currentRoute = router.currentRoute.value;
    const newPath =
      newLang === 'uk'
        ? currentRoute.fullPath.replace(/^\/(en|uk)/, '')
        : `/${newLang}${currentRoute.fullPath.replace(/^\/(en|uk)/, '')}`;
    locale.value = newLang;
    await router.push(newPath);
  } catch (error) {
    console.error('Failed to change language:', error);
  }
};

const toggleSearch = () => {
  emit('toggle-search', !props.isSearchVisible);
};
const toggleMenu = () => emit('toggleMenu');
</script>
