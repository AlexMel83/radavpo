<template>
  <!-- <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <p class="text-xl font-semibold text-gray-700">Сторінка в розробці</p>
  </div> -->
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <p class="text-xl font-semibold text-gray-700">
      {{ alertMessage }}
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const config = useRuntimeConfig();

// const API_URL = config.public.API_URL;
const API_KEY = config.public.API_KEY;
const alertMessage = ref('Перевіряємо статус тривоги...');

const fetchAlertStatus = async () => {
  try {
    const response = await fetch('/api/alerts', {
      headers: {
        accept: 'application/json',
        Authorization: API_KEY,
      },
    });
    console.log(response);
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const data = await response.json();
    const hasAlert = data[0]?.activeAlerts?.length > 0;

    alertMessage.value = hasAlert ? '⚠️ Увага! Тривога активна!' : '✅ Тривоги немає';
  } catch (error) {
    alertMessage.value = '❌ Помилка отримання даних';
    console.error('Fetch error:', error);
  }
};

onMounted(fetchAlertStatus);
</script>
