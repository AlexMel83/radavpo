<template>
  <div class="bg-gray-800 dark:bg-gray-900 mt-auto p-4">
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
            <NuxtImg
              src="/cfhope-logo-tranparent.png"
              alt="logo"
              width="48"
              height="48"
              class="relative h-auto object-contain"
            />
          </div>
          <p class="ml-3">{{ $t('Footer.developer') }}<br />{{ $t('Footer.copyright') }}</p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

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
</style>
