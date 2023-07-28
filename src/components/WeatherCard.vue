<script lang="ts" setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import defaultCityPhoto from '@/assets/city.jpg';
import { useWeatherStore } from '@/store/weather'

const weatherStore = useWeatherStore()

const props = defineProps({
  city: { type: String, required: true }
})

const cityPhotoUrl = ref<string>('');
const temp = ref<string>('');
const desc = ref<string>('');

const getCityPhotoUrl = async (city: string) => {
  await axios.get(`https://api.teleport.org/api/urban_areas/slug:${city.toLocaleLowerCase()}/images/`)
    .then((response: any) => {
      cityPhotoUrl.value = response.data?.photos[0]?.image?.mobile;
    }).catch(async () => {
      cityPhotoUrl.value = defaultCityPhoto;
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
      temp.value = Math.round(data.main.temp) + '°C';
      desc.value = data.weather[0].description;
    })
};

onMounted(async () => {
  // await getCityWeather(props.city)
  // await getCityPhotoUrl(props.city)

  try {
    await Promise.all([getCityWeather(props.city),getCityPhotoUrl(props.city)])
  }
  catch (error) {
    console.log(error);
    
  }
})

const remove = () => {
  weatherStore.cities = weatherStore.cities.filter((m: string) => m !== props.city)
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
  <Card class="overflow-hidden" style="width: 25em">
    <template #header>
      <div class="h-15rem bg-cover text-right p-2" :style="{ backgroundImage: `url(${cityPhotoUrl})` }">
        <Button class="deleteIcon" icon="pi pi-times" severity="danger" text rounded aria-label="Remove" @click="remove" />
      </div>
    </template>
    <template #title>
      <div class="text-center uppercase">{{ city }}</div></template>
    <template #content>
      <p class="text-center text-xl">
        {{ temp }}
      </p>
      <p class="text-center text-xl">
      <i :class="getWeatherIcon(desc)"></i>
      </p>
    </template>
  </Card>
</template>