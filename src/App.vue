<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import WeatherCard from './WeatherCard.vue'

const STORAGE_KEY = 'weatherCards';
const url = import.meta.env.VITE_WEATHER_API_URL;
const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

const citiesWeatherData = ref<any[]>([]);
const searchInput = ref<string>();
const isVisibleWeatherCard = ref(false);

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
      const { data } = response;

      const cityWeatherData = {
        city: data.name,
        temp: Math.round(data.main.temp) + '°C',
        desc: data.weather[0].description
      };
      citiesWeatherData.value.push(cityWeatherData);
      isVisibleWeatherCard.value = true;

      // Save data to local storage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(citiesWeatherData.value));
    })
    .catch(() => alert('Wrong City Name!'));
};

const loadWeatherCardsFromLocalStorage = () => {
  const storedWeatherData = localStorage.getItem(STORAGE_KEY);
  if (storedWeatherData) {
    citiesWeatherData.value = JSON.parse(storedWeatherData);
    isVisibleWeatherCard.value = true;
  }
};

const clearWeatherCardsFromLocalStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
  citiesWeatherData.value = [];
  isVisibleWeatherCard.value = false;
};

onMounted(() => {
  loadWeatherCardsFromLocalStorage();
});
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
      <Button class="mt-1 mr-2" type="button" label="Search" icon="pi pi-search" @click="getWeather" />
      <Button class="mt-1" type="button" label="Clear Weather Cards" @click="clearWeatherCardsFromLocalStorage" />
    </div>

    <div class="'content' flex flex-wrap" >
      <div v-for="(weatherData, index) in citiesWeatherData" :key="index">
        <WeatherCard v-if="isVisibleWeatherCard" :city="weatherData.city" :temp="weatherData.temp" :desc="weatherData.desc" />
      </div>
    </div>
  </div>
</template>
