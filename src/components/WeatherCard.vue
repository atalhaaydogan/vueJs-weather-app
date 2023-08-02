<script lang="ts" setup>
import axios from "axios";
import { onMounted, onUnmounted, ref, watch } from "vue";
import defaultCityPhoto from '@/assets/city.jpg';
import { useWeatherStore } from '../store/weather'

const weatherStore = useWeatherStore()

const props = defineProps({
  city: { type: String, required: true },
  interval: { type: Number, default: 10000 }
})

const cityPhotoUrl = ref<string>('');
const temp = ref<string>('');
const desc = ref<string>('');
const counter = ref(props.interval / 1000);
let timer: NodeJS.Timer;

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
  await getCityWeather(props.city)
  await getCityPhotoUrl(props.city)

  timer = setInterval(() => {
    counter.value--
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
});

const remove = () => {
  weatherStore.cities = weatherStore.cities.filter((m: string) => m !== props.city)
}

const refresh = async () => {
  counter.value = props.interval / 1000
  await getCityWeather(props.city)
}

watch(counter, async () => {
  if (counter.value === 0) {
    await refresh()
  }
})
</script>

<template>
    <Card style="width: 25em">
      <template #header>
        <div class="h-15rem bg-cover text-right p-2" :style="{ backgroundImage: `url(${cityPhotoUrl})` }">
          <Button class="refreshIcon" icon="pi pi-refresh" severity="success" text rounded aria-label="Refresh"
            @click="refresh" />
          <Button class="deleteIcon" icon="pi pi-times" severity="danger" text rounded aria-label="Remove"
            @click="remove" />

        </div>
      </template>
      <template #title>
        <div class="text-center uppercase">{{ city }}</div>
      </template>
      <template #content>
        <p class="text-center text-xl">
          {{ temp }}
        </p>
        <p class="text-center text-xl">
          <i :class="getWeatherIcon(desc)"></i>
        </p>
      </template>

      <template #footer>{{ counter }}</template>
  </Card>
</template>