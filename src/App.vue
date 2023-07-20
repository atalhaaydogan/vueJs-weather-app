
<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import WeatherCard from './WeatherCard.vue'


const url = import.meta.env.VITE_WEATHER_API_URL;
const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

const searchInput = ref<string>();
const city = ref<string>();
const temp = ref<any>();
const desc = ref<string>();
const isVisibleWeatherCard = ref(false)


const getWeather = () => {
  axios
    .get(`${url}weather`, {
      params: {
        q: searchInput.value,
        units: 'metric',
        appid: apiKey
      }
    })
    .then((response) => {
      const data = response.data;
      temp.value = Math.round(data.main.temp) + " ℃";
      desc.value = data.weather[0].description;
      city.value = data.name;
      isVisibleWeatherCard.value = true

    })
    .catch(() => alert('Wrong City Name!'));

};



</script>

<template>
  <div class="weather-app">
    <div class="header">
      <h1 class="mb-3">Weather</h1>
      <div>
        <span class="p-input-icon-left mb-3">
          <i class="pi pi-search" />
          <InputText v-model="searchInput" placeholder="Enter City" />
        </span>
      </div>
      <Button class="mt-1" type="button" label="Search" icon="pi pi-search" @click="getWeather" />
    </div>



    <div class="content">
      <WeatherCard v-if="isVisibleWeatherCard" :city="city" :temp="temp" :desc="desc" />
    </div>

  </div>
</template>