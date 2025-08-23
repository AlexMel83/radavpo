<template>
  <footer
    id="contacts"
    class="container text-base mx-auto px-3 dark:text-custom-gray py-3 border-t dark:border-gray-700 border-custom-border relative"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex flex-col justify-between">
        <h3
          class="font-space-grotesk mb-1 dark:bg-gradient-to-b dark:from-custom-gray dark:to-custom-white dark:text-transparent bg-clip-text"
        >
          {{ $t('Footer.contacts') }}
        </h3>
        <div class="text-sm flex flex-col gap-3">
          <NuxtLink
            to="https://www.google.com/maps/dir/?api=1&destination=49.755055945238915, 27.204738735344154"
            target="_blank"
            rel="noopener noreferrer"
            class="w-fit inline-flex hover:text-custom-orange transition-colors items-center"
          >
            <Icon name="material-symbols:location-automation" class="text-custom-orange w-6 h-6 mr-2 flex-shrink-0" />
            {{ $t('Footer.address') }}
          </NuxtLink>

          <NuxtLink
            to="https://it.starkon.pp.ua"
            target="_blank"
            rel="noopener noreferrer"
            class="w-fit inline-flex hover:text-custom-orange transition-colors items-center"
          >
            <Icon name="fa-globe" class="text-custom-orange w-5 h-5 mr-2" />
            https://it.starkon.pp.ua
          </NuxtLink>

          <NuxtLink
            to="mailto:it@starkon.pp.ua"
            target="_blank"
            rel="noopener noreferrer"
            class="w-fit inline-flex hover:text-custom-orange transition-colors items-center"
          >
            <Icon name="fa-envelope" class="text-custom-orange w-5 h-5 mr-2" />
            radavpo@starkon.pp.ua
          </NuxtLink>

          <NuxtLink
            to="tel:+380954664190"
            target="_blank"
            rel="noopener noreferrer"
            class="w-fit inline-flex hover:text-custom-orange transition-colors items-center"
          >
            <Icon name="fa-phone" class="text-custom-orange w-5 h-5 mr-2" />
            +38 (095) 466-41-90
          </NuxtLink>
        </div>
        <div class="flex space-x-6 mt-5">
          <NuxtLink
            to="viber://chat?number=%2B380954664190"
            external
            target="_blank"
            rel="noopener noreferrer"
            aria-label="viber"
            class="hover:text-custom-orange transition-colors"
          >
            <Icon name="cib:viber" class="mr-2 w-6 h-6" />
          </NuxtLink>
          <NuxtLink
            to="https://t.me/@itstarkon"
            external
            target="_blank"
            rel="noopener noreferrer"
            aria-label="telegram"
            class="hover:text-custom-orange transition-colors"
          >
            <Icon name="mingcute:telegram-fill" class="mr-2 w-6 h-6" />
          </NuxtLink>
          <NuxtLink
            to="https://wa.me/380954664190"
            external
            target="_blank"
            rel="noopener noreferrer"
            aria-label="whatsapp"
            class="hover:text-custom-orange transition-colors"
          >
            <Icon name="ic:baseline-whatsapp" class="mr-2 w-6 h-6" />
          </NuxtLink>
          <NuxtLink
            to="https://m.me/alexandr.meleshko.9"
            external
            target="_blank"
            rel="noopener noreferrer"
            aria-label="messenger"
            class="hover:text-custom-orange transition-colors"
          >
            <Icon name="mdi:facebook-messenger" class="mr-2 w-6 h-6" />
          </NuxtLink>
        </div>
        <div class="flex items-center justify-between text-center text-xs gap-4 mt-4">
          <NuxtLink to="/terms" class="hover:text-custom-orange hover:underline transition-colors">
            {{ $t('Footer.terms') }}
          </NuxtLink>
          <NuxtLink to="/privacy-policy" class="hover:text-custom-orange hover:underline transition-colors">
            {{ $t('Footer.policy') }}
          </NuxtLink>
          <NuxtLink to="/howtohelp" class="hover:text-custom-orange hover:underline transition-colors">
            {{ $t('Footer.howToHelp') }}
          </NuxtLink>
        </div>
      </div>
      <ClientOnly>
        <FooterGoogleMap />
      </ClientOnly>
    </div>

    <div class="text-center mt-3 pt-3 border-t border-custom-border">
      <NuxtLink
        class="text-sm hover:underline hover:text-custom-orange transition-colors"
        to="https://it.starkon.pp.ua"
        target="_blank"
      >
        {{ $t('Footer.developer') }} {{ $t('Footer.copyright') }}
      </NuxtLink>
    </div>

    <!-- Кнопка "Наверх" -->
    <button
      v-if="showScrollTop"
      class="fixed bottom-3 right-3 bg-custom-orange text-custom-white w-10 h-10 rounded-full shadow-lg hover:bg-custom-border hover:scale-105 transition-all duration-300 z-50"
      title="Наверх"
      @click="scrollToTop"
    >
      <Icon name="material-symbols:keyboard-double-arrow-up-rounded" class="w-9 h-9" />
    </button>
  </footer>
</template>

<script setup>
// Состояние видимости кнопки "Наверх"
const showScrollTop = ref(false);

// Функция для скроллинга наверх
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

// Проверка положения прокрутки
const handleScroll = () => {
  showScrollTop.value = window.scrollY > 100; // Показываем кнопку после прокрутки на 100px
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>
