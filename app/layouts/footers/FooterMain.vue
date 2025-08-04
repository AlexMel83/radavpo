<template>
  <div ref="footerRef" class="bg-gray-800 dark:bg-gray-900 mt-auto p-4">
    <div class="container-footer max-w-[500px] mx-auto px-2 text-sm text-white text-center">
      <div class="contacts flex items-center justify-between gap-4 mb-4">
        <a
          href="https://maps.app.goo.gl/TV82VnCCFqWFcaM2A"
          target="_blank"
          class="address group flex items-center gap-2 hover:text-blue-300 hover:scale-[1.01] transition-colors"
        >
          <Icon name="fa-solid:map-marker-alt" class="w-4 h-4 text-white group-hover:text-blue-300" />
          {{ $t('Footer.address') }}
        </a>
        <a
          href="tel:+380954664190"
          class="phone group flex items-center gap-2 hover:text-blue-300 hover:scale-[1.01] transition-colors"
        >
          <Icon name="fa-solid:phone" class="w-4 h-4 text-white group-hover:text-blue-300" />
          +38 095 466-41-90
        </a>
      </div>
      <div class="text-white font-semibold mb-3">
        {{ $t('Footer.socialMedia') }}
      </div>
      <div class="social-media flex justify-around w-full mt-3">
        <a
          href="https://www.facebook.com/cfhopeua"
          target="_blank"
          class="social group flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <Icon name="fa-brands:facebook-f" class="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
        </a>
        <a
          href="https://t.me/cfhopeua"
          target="_blank"
          class="social group flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors"
        >
          <Icon name="fa-brands:telegram" class="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
        </a>
        <a
          href="viber://chat?number=+380987654321"
          target="_blank"
          class="social group flex items-center justify-center w-10 h-10 rounded-full bg-purple-500 hover:bg-purple-600 transition-colors"
        >
          <Icon name="fa-brands:viber" class="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
        </a>
        <a
          href="https://www.instagram.com/cfhopeua/"
          target="_blank"
          class="social group flex items-center justify-center w-10 h-10 rounded-full bg-pink-500 hover:bg-pink-600 transition-colors"
        >
          <Icon name="fa-brands:instagram" class="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
        </a>
      </div>
      <div class="flex items-center justify-between gap-4 my-4">
        <NuxtLink to="/terms" class="hover:underline hover:text-blue-300 transition-colors">
          {{ $t('Footer.terms') }}
        </NuxtLink>
        <NuxtLink to="/privacy-policy" class="hover:underline hover:text-blue-300 transition-colors">
          {{ $t('Footer.policy') }}
        </NuxtLink>
        <NuxtLink to="/howtohelp" class="hover:underline hover:text-blue-300 transition-colors">
          {{ $t('Footer.howToHelp') }}
        </NuxtLink>
      </div>
      <div class="mt-4 flex justify-center items-center w-full mx-auto">
        <NuxtLink
          to="https://it.starkon.pp.ua"
          target="_blank"
          class="flex items-center justify-center gap-4 hover:underline hover:text-blue-300 transition-colors"
        >
          <div class="inline-block relative">
            <div class="absolute inset-0 bg-white blur-sm opacity-50" />
            <NuxtImg :src="logoSrc" alt="logo" width="48" height="48" class="relative h-auto object-contain" />
          </div>
          <p class="ml-3">{{ $t('Footer.developer') }}<br />{{ $t('Footer.copyright') }}</p>
        </NuxtLink>
      </div>
    </div>
    <button
      id="scrollToTop"
      :class="{ 'in-footer': isScrollToTopInFooter, show: showScrollToTop }"
      @click="scrollToTop"
    >
      <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect
          x="0.5"
          y="0.5"
          width="49"
          height="49"
          rx="24.5"
          :stroke="isScrollToTopInFooter ? 'var(--white-color)' : 'var(--footer-bg)'"
        />
        <rect
          x="3.5"
          y="3.5"
          width="43"
          height="43"
          rx="21.5"
          :stroke="isScrollToTopInFooter ? 'var(--white-color)' : 'var(--footer-bg)'"
        />
        <path
          d="M26.0607 18.9596C25.4749 18.3738 24.5251 18.3738 23.9393 18.9596L14.3934 28.5055C13.8076 29.0913 13.8076 30.0411 14.3934 30.6269C14.9792 31.2127 15.9289 31.2127 16.5147 30.6269L25 22.1416L33.4853 30.6269C34.0711 31.2127 35.0208 31.2127 35.6066 30.6269C36.1924 30.0411 36.1924 29.0913 35.6066 28.5055L26.0607 18.9596ZM26.5 21.0203L26.5 20.0203L23.5 20.0203L23.5 21.0203L26.5 21.0203Z"
          :fill="isScrollToTopInFooter ? 'var(--white-color)' : 'var(--footer-bg)'"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>
const isScrollToTopInFooter = ref(false);
const showScrollToTop = ref(false);
const footerRef = ref(null);
const { origin } = useRequestURL();

const logoSrc = computed(() => `${origin}/cfhope-logo-tranparent.png`);

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleScroll = () => {
  if (footerRef.value) {
    const footerRect = footerRef.value;
    const isInFooter = footerRect.top <= window.innerHeight && footerRect.bottom >= 0;

    isScrollToTopInFooter.value = isInFooter;

    const scrollPosition = window.scrollY;
    const screenHeight = window.innerHeight;
    showScrollToTop.value = scrollPosition > screenHeight;
  }
};

onMounted(async () => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.social {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  transition: transform 0.3s;
}
.social img {
  border-radius: 50%;
}
.social:hover img {
  transform: scale(1.2);
}

/* Стилизация полосы прокрутки для WebKit браузеров (Chrome, Safari) */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Стилизация для Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}

#scrollToTop {
  position: fixed;
  bottom: 65px;
  right: 16px;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.3s,
    visibility 0.3s;
  background-color: var(--space-bg);
  z-index: 1000;
}

#scrollToTop.in-footer {
  background-color: transparent;
  color: var(--white-color);
}

#scrollToTop.show {
  opacity: 0.8;
  visibility: visible;
}

@media (min-width: 768px) {
  #scrollToTop {
    bottom: 24px;
    right: 24px;
  }

  #scrollToTop:hover {
    background-color: var(--btn-border);
  }

  #scrollToTop:active {
    background-color: transparent;
  }

  #scrollToTop:hover rect {
    stroke: var(--white-color);
  }

  #scrollToTop:active rect {
    stroke: var(--btn-border);
  }

  #scrollToTop:hover path {
    fill: var(--white-color);
  }

  #scrollToTop:active path {
    fill: var(--btn-border);
  }
}

@media (min-width: 1440px) {
  #scrollToTop {
    background-color: transparent;
  }
}
</style>
