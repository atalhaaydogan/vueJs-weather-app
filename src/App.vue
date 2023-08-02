<script setup lang="ts">
import { ref } from 'vue';
import WeatherCardWrapper from './components/WeatherCardWrapper.vue';
import { useWeatherStore } from '@/store/weather'

const weatherStore = useWeatherStore()

const cityName = ref<string>('');

const addCity = () => {
  const cityNameNormalized = cityName.value.toLocaleLowerCase()
  if (cityNameNormalized && weatherStore.cities.filter((item)=> item.cityName === cityNameNormalized).length === 0) {
    weatherStore.cities.push({'cityName' : cityNameNormalized});

  }

  cityName.value = ''
}

</script>

<template>
  <div>
    <InputText v-model="cityName" placeholder="Enter City" />
    <Button label="Submit" @click="addCity" />
  </div>
  <WeatherCardWrapper></WeatherCardWrapper>
</template>
