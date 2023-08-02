<script setup lang="ts">
import { ref } from 'vue';
import WeatherCard from '@/components/WeatherCard.vue'
import { useWeatherStore } from './store/weather'

const weatherStore = useWeatherStore()

const cityName = ref<string>('');

const addCity = () => {
  const cityNameNormalized = cityName.value.toLocaleLowerCase()

  if (cityNameNormalized && weatherStore.cities.indexOf(cityNameNormalized) === -1) {
    weatherStore.cities.push(cityNameNormalized)
  }

  cityName.value = ''
}

</script>

<template>
  <div>
    <InputText v-model="cityName" placeholder="Enter City" />
    <Button label="Submit" @click="addCity" />
  </div>


  <div class="grid mt-5 ">
    <div class="xl:col-3 lg:col-6 md:col-10 sm:col-12" v-for="city in weatherStore.cities">
      <WeatherCard class="mt-3" :city="city" />
    </div>
  </div>
</template>
