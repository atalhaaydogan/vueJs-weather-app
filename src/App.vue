
<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';


const url = import.meta.env.VITE_WEATHER_API_URL;
const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

const searchInput = ref<string>();
const city = ref<string>();
const temp = ref<any>();
const desc = ref<string>();
const minmax = ref<any>();

const getImageFromAPI = (city : string ) => {
    fetch('https://api.teleport.org/api/urban_areas/slug:'+city+'/images/').then((resp)=>{
        return resp.json();
    }).then((data)=>{
        console.log(data);
        const imageUrl =  data.status === 404 ? '/img.jpg': data?.photos[0]?.image?.mobile;
        console.log(imageUrl);
        document.body.style.backgroundImage = "url('"+imageUrl +"')";
    }).catch(
        (err) => {
            console.log(err);
            document.body.style.backgroundImage = "url(/img.jpg)";
        }
    )
}

const getWeatherIcon = (description: string) => {

  let iconClass = 'pi pi-question-circle';
  switch(description) {
  case'clear sky':
  iconClass = 'pi pi-sun';
  break;
  case'few clouds':
  iconClass = 'pi pi-cloud';
  break;
  case'scattered clouds':
  iconClass = 'pi pi-cloud';
  break;
  case'broken clouds':
  iconClass = 'pi pi-cloud';
  break;
  case'shower rain':
  iconClass = 'pi pi-cloud-rain';
  break;
  case'rain':
  iconClass = 'pi pi-cloud-rain';
  break;
  case'thunderstorm':
  iconClass = 'pi pi-flash';
  break;
  case'snow':
  iconClass = 'pi pi-snowflake';
  break;
  case'mist':
  iconClass = 'pi pi-fog';
  break;
  case'smoke':
  iconClass = 'pi pi-fog';
  break;
  case'haze':
  iconClass = 'pi pi-fog';
  break;
  case'dust':
  iconClass = 'pi pi-fog';
  break;
}

  return iconClass;
};


const getWeather = () => {
  getImageFromAPI(searchInput.value);
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
    .catch(() => alert('Wrong City Name!'));
};
</script>

<template>
  <div class="weather-app">
    <div class="header">
      <h1 class="mb-3">Weather</h1>
      <!-- <input v-model="searchInput" type="text" placeholder="Enter city" /> -->
      <div>
        <span class="p-input-icon-left mb-3">
          <i class="pi pi-search" />
          <InputText v-model="searchInput" placeholder="Enter City" />
        </span>
      </div>

      <!-- <button @click="getWeather">Search</button> -->
      <Button class="mt-1" type="button" label="Search" icon="pi pi-search" @click="getWeather" />
    </div>

    <div class="content">
      <div class="city">{{ city }}</div>
      <div class="temp">{{ temp }} </div>
      <div class="desc">
        <Icon :class="getWeatherIcon(desc)" />
        {{ desc }}
      </div>
      

    </div>
  </div>
</template>