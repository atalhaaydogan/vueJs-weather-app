

<template>
  <div class="wheather-app" m-20>
    <div class="header">
      <h1 >Wheather</h1>
    <input v-model="searchInput" type="text" placeholder="Enter city" />
    <button @click="getWeather">Search</button>
  </div>

  <div class="content">
    <div class="city">{{ city }}</div>
    <div class="temp">{{ temp }} </div>
    <div class="desc">{{ desc }}</div>
    <div class="minmax">{{ minmax }}</div>
    
  </div>
  </div>
</template>
  
  <script lang="ts">
import { ref } from 'vue';
import axios from 'axios';



export default {
  setup() {
    const url = 'https://api.openweathermap.org/data/2.5/';
    const apiKey = 'APIKEY';

    const searchInput = ref<string>();
    const city = ref<string>();
    const temp = ref<any>();
    const desc = ref<string>();
    const minmax = ref<any>();

    

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
      city.value = data.name;
      temp.value = Math.round(data.main.temp) + " ℃";
      desc.value = data.weather[0].description;
      minmax.value =
        Math.round(data.main.temp_min) +
        ' ℃ / ' +
        Math.round(data.main.temp_max) +
        ' ℃';
    })
    .catch((err) => alert('Wrong City Name!'));
};
    return {
      searchInput,
      city,
      temp,
      desc,
      minmax,
      getWeather,
    };
  },
};
</script>

<style>

</style>