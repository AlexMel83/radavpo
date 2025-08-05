<template>
  <div class="container mx-auto p-8">
    <h1 class="text-3xl font-bold mb-8">Діагностика Nuxt UI компонентів</h1>

    <!-- Тест базових компонентів -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Базові компоненти</h2>

      <div class="grid gap-4">
        <!-- UButton - має працювати завжди -->
        <div class="p-4 border rounded">
          <h3 class="font-medium mb-2">UButton</h3>
          <UButton>Тест кнопки</UButton>
          <span class="ml-4 text-green-600">✓ Працює</span>
        </div>

        <!-- UCard - базовий компонент -->
        <div class="p-4 border rounded">
          <h3 class="font-medium mb-2">UCard</h3>
          <UCard class="max-w-xs">
            <template #header>
              <h4>Тест карточки</h4>
            </template>
            <p>Контент карточки</p>
          </UCard>
          <span class="ml-4 text-green-600">✓ Працює</span>
        </div>

        <!-- UIcon - має працювати -->
        <div class="p-4 border rounded">
          <h3 class="font-medium mb-2">UIcon</h3>
          <UIcon name="i-lucide-home" class="w-6 h-6" />
          <span class="ml-4 text-green-600">✓ Працює</span>
        </div>
      </div>
    </div>

    <!-- Тест навігаційних компонентів -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Навігаційні компоненти</h2>

      <div class="space-y-4">
        <!-- UVerticalNavigation -->
        <div class="p-4 border rounded">
          <h3 class="font-medium mb-2">UVerticalNavigation</h3>
          <div class="max-w-xs">
            <UVerticalNavigation :links="testLinks" />
          </div>
        </div>

        <!-- UHorizontalNavigation -->
        <div class="p-4 border rounded">
          <h3 class="font-medium mb-2">UHorizontalNavigation</h3>
          <UHorizontalNavigation :links="simpleLinks" />
        </div>

        <!-- Тестуємо UNavigationMenu -->
        <div class="p-4 border rounded">
          <h3 class="font-medium mb-2">UNavigationMenu (проблемний)</h3>
          <div class="text-red-600">❌ Не працює - компонент не знайдений</div>
        </div>
      </div>
    </div>

    <!-- Інформація про версії -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Системна інформація</h2>
      <div class="bg-gray-100 p-4 rounded">
        <pre>{{ systemInfo }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
// Тестові дані
const testLinks = [
  {
    label: 'Головна',
    to: '/',
    icon: 'i-lucide-home',
  },
  {
    label: 'Про нас',
    to: '/about',
    icon: 'i-lucide-info',
    children: [
      {
        label: 'Команда',
        to: '/team',
      },
      {
        label: 'Історія',
        to: '/history',
      },
    ],
  },
  {
    label: 'Контакти',
    to: '/contacts',
    icon: 'i-lucide-phone',
  },
];

const simpleLinks = [
  {
    label: 'Головна',
    to: '/',
  },
  {
    label: 'Про нас',
    to: '/about',
  },
  {
    label: 'Контакти',
    to: '/contacts',
  },
];

const systemInfo = computed(() => {
  return {
    userAgent: process.client ? navigator.userAgent : 'Server Side',
    nuxtVersion: 'Перевірте package.json',
    nuxtUIVersion: 'Перевірте package.json',
  };
});
</script>
