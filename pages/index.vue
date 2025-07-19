<template>
  <div class="container mx-auto px-4 py-8">
    <MetaTags :title="$t('header.title')" :description="$t('header.subtitle')" :image="'/cfhope-logo-tranparent.png'" />
    <SectionBlogs />
    <SectionPartners />
    <div class="rada-title text-2xl font-bold text-center dark:text-white mb-6">
      {{ $t('Index.title') }}
    </div>
    <div class="section-content content-wrap text-lg leading-7 text-gray-700 dark:text-white space-y-4">
      <p>{{ $t('Index.description1') }}</p>
      <p>{{ $t('Index.description2') }}</p>
    </div>
    <div class="section-content content-wrap mt-8">
      <h2 class="text-xl font-semibold mb-4 text-center text-gray-800 dark:text-white">
        {{ $t('Index.videoTitle') }}
      </h2>
      <div class="relative w-full">
        <video id="rada-video" class="w-full h-auto rounded-md shadow-lg" controls>
          <source src="https://yednanniazaradydii.org.ua/wp-content/uploads/2023/03/VPO_UKR.mp4" type="video/mp4" />
          {{ $t('Index.videoNotSuppported') }}
        </video>
      </div>
    </div>
    <div class="section-content content-wrap mt-8">
      <h2 class="text-xl font-semibold mb-4 text-gray-800 text-center dark:text-white">
        {{ $t('Index.concil.title') }}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 dark:text-white text-gray-700">
        <!-- Ліва колонка -->
        <div class="space-y-4 text-lg leading-7">
          <div>
            <span class="font-bold">{{ $t('Index.concil.idpTitle') }}</span>
            {{ $t('Index.concil.idpDescription') }}
          </div>
          <div>
            <div class="font-bold">
              {{ $t('Index.concil.idpConcilTitle') }}
            </div>
            {{ $t('Index.concil.idpConcilDescription') }}
          </div>
          <div>
            <div class="font-bold">
              {{ $t('Index.concil.whyTitle') }}
            </div>
            {{ $t('Index.concil.whyDescription') }}
          </div>
        </div>
        <!-- Права колонка -->
        <div class="space-y-4 text-lg leading-7">
          <div>
            <div class="font-bold">
              {{ $t('Index.concil.stuffTitle') }}
            </div>
            {{ $t('Index.concil.stuffDescription') }}
          </div>
          <div>
            <div class="font-bold">
              {{ $t('Index.concil.mustIdpTitle') }}
            </div>
            {{ $t('Index.concil.mustIdpDescription') }}
          </div>
          <div>
            <div class="font-bold">
              {{ $t('Index.concil.whoCareTitle') }}
            </div>
            {{ $t('Index.concil.whoCareDescription') }}
          </div>
        </div>
      </div>
      <ShareButtons
        class="max-w-[800px]"
        :url="'https://radavpo.starkon.pp.ua'"
        :page-object="{ title: $t('header.title') }"
      />
    </div>
  </div>
</template>

<style>
/* Додаткові стилі для заголовків або контейнера, якщо потрібні */
.rada-title {
  color: #2b6cb0; /* Синій відтінок */
}
</style>
