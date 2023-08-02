<script lang="ts" setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import defaultCityPhoto from '@/assets/city.jpg';
import { useWeatherStore } from '@/store/weather'

const weatherStore = useWeatherStore()

console.log('Render oldu')
const props = defineProps({
  city: { type: String, required: true }
})
const dataLoaded = ref<boolean>(false);
const definedCity = weatherStore.cities.filter((item: any) => item.cityName === props.city.toLocaleLowerCase())[0];

const getCityPhotoUrl = async (city: string) => {
  await axios.get(`https://api.teleport.org/api/urban_areas/slug:${city.toLocaleLowerCase()}/images/`)
    .then((response: any) => {
      definedCity.cityPhotoUrl = response.data?.photos[0]?.image?.mobile;
    }).catch(async () => {
      definedCity.cityPhotoUrl = defaultCityPhoto;
    })
}

const getCityWeather = async (city: string) => {
  const url = import.meta.env.VITE_WEATHER_API_URL;
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  await axios
    .get(`${url}weather`, {
      params: {
        q: city.toLocaleLowerCase(),
        units: 'metric',
        appid: apiKey
      }
    })
    .then((response) => {
      const { data } = response;
      definedCity.cityId = data.id;
      definedCity.temp = Math.round(data.main.temp) + '°C';
      definedCity.desc = data.weather[0].description;
      weatherStore.cities.forEach((item: any) => {
        item.cityId = data.id;
        item.temp = Math.round(data.main.temp) + '°C';
        item.desc = data.weather[0].description;
      });
    })
};



onMounted(async () => {
  // await getCityWeather(props.city)
  // await getCityPhotoUrl(props.city)

  try {
    await Promise.all([getCityWeather(props.city), getCityPhotoUrl(props.city)])
    dataLoaded.value = true;
  }
  catch (error) {
    console.log(error);

  }
})



const remove = () => {
  weatherStore.cities = weatherStore.cities.filter((m: any) => m.cityName !== props.city)
}

const getWeatherIcon = (description: any) => {
  let iconClass = "pi pi-question-circle";
  switch (description) {
    case "clear sky":
      iconClass = "pi pi-sun";
      break;
    case "few clouds":
      iconClass = "pi pi-cloud";
      break;
    case "scattered clouds":
      iconClass = "pi pi-cloud";
      break;
    case "broken clouds":
      iconClass = "pi pi-cloud";
      break;
    case "shower rain":
      iconClass = "pi pi-cloud-rain";
      break;
    case "rain":
      iconClass = "pi pi-cloud-rain";
      break;
    case "thunderstorm":
      iconClass = "pi pi-flash";
      break;
    case "snow":
      iconClass = "pi pi-snowflake";
      break;
    case "mist":
      iconClass = "pi pi-fog";
      break;
    case "smoke":
      iconClass = "pi pi-fog";
      break;
    case "haze":
      iconClass = "pi pi-fog";
      break;
    case "dust":
      iconClass = "pi pi-fog";
      break;
  }
  return iconClass;
};
</script>

<template>
  <div v-if="dataLoaded">
    <Card class="overflow-hidden" style="width: 25em">
      <template #header>
        <div class="h-15rem bg-cover text-right p-2" :style="{ backgroundImage: `url(${definedCity.cityPhotoUrl})` }">
          <Button class="deleteIcon" icon="pi pi-times" severity="danger" text rounded aria-label="Remove"
            @click="remove" />
        </div>
      </template>
      <template #title>
        <div class="text-center uppercase">{{ city }}</div>
      </template>
      <template #content>
        <p class="text-center text-xl">
          {{ definedCity.temp }}
        </p>
        <p class="text-center text-xl">
          <i :class="getWeatherIcon(definedCity.desc)"></i>
        </p>
        <div class="flex justify-content-center align-items-center">
          <Button class="refreshButton " icon="pi pi-refresh" label="Yenile" @click="refreshWeatherData" />
        </div>
      </template>
      <template #footer>
        <p class="text-center text-xl">
          {{ countdown }}
        </p>
      </template>
    </Card>
  </div>

  <div v-else>
    <Card style="width: 25em;">
      <template #header>
        <Skeleton height="15rem" class="mb-2" borderRadius="16px"></Skeleton>
      </template>
      <template #title>
        <Skeleton class="mb-2" borderRadius="16px"></Skeleton>
      </template>
      <template #content>
        <Skeleton borderRadius="16px" class="mb-2"></Skeleton>
        <Skeleton class="mb-2" borderRadius="16px"></Skeleton>
        <Skeleton class="mb-2" borderRadius="16px"></Skeleton>
      </template>
      <template #footer>
        <Skeleton class="mb-2" borderRadius="16px"></Skeleton>
      </template>
    </Card>
  </div>
</template>