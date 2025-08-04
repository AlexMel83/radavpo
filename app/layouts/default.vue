<template>
  <div class="min-h-screen flex flex-col">
    <HeaderAuthUser v-if="store?.userData?.user?.isactivated" class="flex-shrink-0" />
    <HeaderMain v-else class="flex-shrink-0" />
    <main class="flex-grow">
      <NuxtPage />
    </main>
    <FooterMain class="flex-shrink-0" />
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/app.store';
import FooterMain from './footers/FooterMain.vue';
// import HeaderMain from './headers/HeaderMain.vue';
import { nextTick } from 'vue';

const HeaderAuthUser = defineAsyncComponent(() => import('@/layouts/headers/HeaderAuthUser.vue'));

const store = useAuthStore();

const setUserData = async () => {
  await nextTick();
  if (localStorage.getItem('userData')) {
    store.userData = JSON.parse(localStorage.getItem('userData'));
    store.isAuthed = true;
  }
};
onMounted(async () => {
  await setUserData();
});
</script>
