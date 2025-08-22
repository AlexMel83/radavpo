<template>
  <div class="page-container">
    <!-- <HeaderAuthUser v-if="store?.userData?.user?.isactivated" /> -->
    <HeaderMain />
    <NuxtPage />
    <Footer ref="footerRef" />
  </div>
</template>

<script setup>
// import { useAuthStore } from '~/stores/app.store';
import HeaderMain from './headers/HeaderMain.vue';
// import { nextTick } from 'vue';

// const HeaderAuthUser = defineAsyncComponent(() => import('@/layouts/headers/HeaderAuthUser.vue'));

// const store = useAuthStore();
// const footerRef = ref(null);

// const setUserData = async () => {
//   await nextTick();
//   if (localStorage.getItem('userData')) {
//     store.userData = JSON.parse(localStorage.getItem('userData'));
//     store.isAuthed = true;
//   }
// };
// onMounted(async () => {
//   await setUserData();
// });
</script>

<style scoped>
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

.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
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
