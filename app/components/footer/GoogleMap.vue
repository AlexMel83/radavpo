<template>
  <div class="h-[250px] w-full">
    <!-- Статичне превʼю -->
    <div v-if="!mapLoaded" class="w-full h-full relative rounded-lg border border-custom-border overflow-hidden">
      <img
        :src="`https://maps.googleapis.com/maps/api/staticmap?center=${center.lat},${center.lng}&zoom=14&size=600x300&maptype=roadmap&markers=color:red%7C${center.lat},${center.lng}&key=${config.public.googleMapsApiKeyStatic}`"
        alt="Static map preview"
        class="w-full h-full object-cover"
        loading="lazy"
      />
      <button
        class="absolute inset-0 bg-black/40 text-white flex items-center justify-center text-lg font-semibold hover:bg-black/60 transition"
        @click="initMap"
      >
        Показати карту
      </button>
    </div>

    <!-- Контейнер карти -->
    <div v-show="mapLoaded" ref="mapRef" class="w-full h-full rounded-lg border border-custom-border" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';

const config = useRuntimeConfig();
const center = ref({ lat: 49.75506287667392, lng: 27.204733370926295 });
const mapRef = ref(null);
const mapLoaded = ref(false);

let map = null;

const initMap = async () => {
  try {
    const loader = new Loader({
      apiKey: config.public.googleMapsApiKey,
      version: 'beta',
      libraries: ['marker'],
    });

    await loader.load();

    map = new google.maps.Map(mapRef.value, {
      center: center.value,
      zoom: 14,
      mapId: 'e97b831045a3df9f',
      mapTypeId: 'roadmap',
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    new google.maps.marker.AdvancedMarkerElement({
      position: center.value,
      map,
    });

    mapLoaded.value = true;
  } catch (error) {
    console.error('Failed to init Google Maps:', error);
  }
};
</script>
