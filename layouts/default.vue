<template>
  <div class="page-container">
    <HeaderAuthUser v-if="store?.userData?.user?.isactivated" class="flex" />
    <HeaderMain v-else />
    <NuxtPage />
    <FooterMain />
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/app.store';
import FooterMain from './footers/FooterMain.vue';
import HeaderMain from './headers/HeaderMain.vue';
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

<style scoped>
.page-container {
  flex-direction: column;
  min-height: 100vh;
}
</style>
