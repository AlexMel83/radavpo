<template>
  <section class="py-6">
    <UContainer>
      <h2 class="text-2xl font-bold text-center mb-10">Наші партнери</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <NuxtLink v-for="partner in partners" :key="partner.slug" :to="`/partners/${partner.slug}`">
          <UCard
            class="hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 group p-2"
            :ui="{
              base: 'flex flex-col items-center text-center h-full overflow-hidden',
              body: 'p-4 flex flex-col flex-grow items-center',
            }"
          >
            <div class="flex items-center justify-center h-48 w-full bg-white p-4">
              <img
                :src="`/org-images/${partner.images}`"
                :alt="partner.title"
                class="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div class="mt-4">
              <h3 class="text-lg font-semibold text-gray-800 leading-tight break-words">
                {{ partner.title }}
              </h3>
              <p class="text-sm text-gray-500 mt-1">
                {{ partner.contacts?.address }}
              </p>
            </div>
          </UCard>
        </NuxtLink>
      </div>
    </UContainer>
  </section>
</template>

<script setup>
const { data: partners } = await useFetch('/api/partners');
</script>
