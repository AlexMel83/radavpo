<template>
  <main class="min-h-screen">
    <div class="shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-center">
          {{ $t('PrivacyPolicy.title') }}
        </h1>
      </div>
    </div>
    <div class="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="overflow-hidden shadow-sm sm:rounded-lg">
        <div class="p-6 e border-b border-gray-200">
          <h2 class="text-2xl font-semibold text-center mb-4">
            {{ $t('PrivacyPolicy.subTitle') }}
          </h2>
          <h3 class="text-xl font-medium text-center mb-6">
            {{ $t('PrivacyPolicy.fundName') }}
          </h3>

          <p class="mb-4">
            {{ $t('PrivacyPolicy.ourSite') }}
            <a href="https://cfhope.in.ua" target="__blank" class="text-blue-600 hover:text-blue-800"
              >https://cfhope.in.ua</a
            >
          </p>

          <h2 class="text-2xl font-semibold mt-8 mb-4">
            {{ $t('PrivacyPolicy.collectInfoTitle') }}
          </h2>
          <p class="mb-4">
            {{ $t('PrivacyPolicy.collectInfoDescription') }}
          </p>

          <h2 class="text-2xl font-semibold mt-8 mb-4">
            {{ $t('PrivacyPolicy.cookieTitle') }}
          </h2>
          <p class="mb-4">
            {{ $t('PrivacyPolicy.cookieDescription') }}
          </p>

          <h2 class="text-2xl font-semibold mt-8 mb-4">
            {{ $t('PrivacyPolicy.anotherTitle') }}
          </h2>
          <p class="mb-4">
            {{ $t('PrivacyPolicy.anotherDescription') }}
          </p>

          <h2 class="text-2xl font-semibold mt-8 mb-4">
            {{ $t('PrivacyPolicy.dataTitle') }}
          </h2>
          <p class="mb-4">
            {{ $t('PrivacyPolicy.dataDescription') }}
          </p>

          <h2 class="text-2xl font-semibold mt-8 mb-4">
            {{ $t('PrivacyPolicy.rightsTitle') }}
          </h2>
          <p class="mb-4">
            {{ $t('PrivacyPolicy.rightsDescription') }}
          </p>

          <h2 class="text-2xl font-semibold mt-8 mb-4">
            {{ $t('PrivacyPolicy.changeTitle') }}
          </h2>
          <p class="mb-4">
            {{ $t('PrivacyPolicy.changeDescription') }}
          </p>

          <h2 class="text-2xl font-semibold mt-8 mb-4">
            {{ $t('PrivacyPolicy.contactsTitle') }}
          </h2>
          <p class="mb-4">
            {{ $t('PrivacyPolicy.contactsDescription') }}
            <a href="mailto:radavpo@starkon.pp.ua" class="text-blue-600 hover:text-blue-800">radavpo@starkon.pp.ua</a>
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
useHead({
  title: 'Політика конфіденційності',
});
</script>

<style scoped>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
</style>
