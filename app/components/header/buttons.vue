<template>
  <div class="flex items-center space-x-3">
    <!-- Переключатель языка -->
    <button
      class="hover:text-custom-orange dark:hover:text-custom-orange transition-colors relative w-12 h-8 flex items-center justify-center overflow-hidden"
      @click="toggleLanguage"
    >
      <transition name="fade" mode="out-in">
        <span :key="currentLocale" class="absolute">
          {{ currentLocale.toUpperCase() === 'UK' ? 'ENG' : 'UKR' }}
        </span>
      </transition>
    </button>
    <!-- Переключатель цветовой темы -->
    <button
      class="hover:text-custom-orange dark:hover:text-custom-orange transition-colors"
      aria-label="Toggle dark mode"
      @click="appStore.toggleDarkMode"
    >
      <Icon
        :name="`${appStore.isDark ? 'line-md:sunny-filled-loop' : 'line-md:sunny-filled-loop-to-moon-filled-loop-transition'}`"
        class="w-5 h-5 transition-transform duration-300 ease-in-out"
      />
    </button>
    <!-- Кнопка поиска -->
    <button
      class="w-6 h-6 transition-colors"
      :class="{
        'text-custom-orange': localSearchVisible,
        'hover:text-custom-orange dark:hover:text-custom-orange': !localSearchVisible,
      }"
      aria-label="Search"
      @click="toggleSearch"
    >
      <Icon name="mdi-light:magnify" class="w-6 h-6 transition-colors duration-300" />
    </button>
    <!-- Кнопка мобильного меню -->
    <button
      class="md:hidden transition-colors"
      :class="{
        'text-custom-orange': isMenuOpen,
        'hover:text-custom-orange dark:hover:text-custom-orange': !isMenuOpen,
      }"
      @click="toggleMenu"
    >
      <Icon
        :name="`${isMenuOpen ? 'material-symbols:close-rounded' : 'humbleicons:bars'}`"
        :class="['w-7 h-7 transition-transform duration-300 ease-in-out', { 'rotate-90': isMenuOpen }]"
      />
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

watch(
  () => props.isSearchVisible,
  (val) => {
    localSearchVisible.value = val;
  },
);

onMounted(() => {
  if (process.client) {
    document.documentElement.classList.toggle('dark', appStore.isDark);
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
  localSearchVisible.value = !localSearchVisible.value;
  emit('toggle-search', localSearchVisible.value);
};
const toggleMenu = () => emit('toggleMenu');
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20%);
}
</style>
