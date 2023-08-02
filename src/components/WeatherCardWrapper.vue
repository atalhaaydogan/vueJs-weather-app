<script lang="ts" setup>
import axios from "axios";
import { useWeatherStore } from "../store/weather";
import WeatherCard from "./WeatherCard.vue";
import { watchEffect, ref } from "vue";
const weatherStore = useWeatherStore();

let timer = ref<any>(null);


const updateWeatherData = async () => {
    const url = import.meta.env.VITE_WEATHER_API_URL;
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const cities = weatherStore.cities.map((item) => item.cityId);
    await axios
        .get(`${url}group`, {
            params: {
                id: cities.join(","),
                units: "metric",
                appid: apiKey,
            },
        })
        .then((response) => {
            const { data } = response;
            data.list.forEach((item: any) => {
                weatherStore.cities.forEach((city: { cityName: string, temp: string, desc: string }) => {
                    if (city.cityName === item.name.toLocaleLowerCase()) {
                        city.temp = Math.round(item.main.temp) + "°C";
                        city.desc = item.weather[0].description;
                    }
                });
            });
        });
};
watchEffect(() => {
    
    if (weatherStore.cities.length > 0) {
        console.log('istek Attık')
        timer = setInterval(updateWeatherData, 10000);
    } else {
        console.log('timer durdu', timer);
        clearInterval(timer ?? '');
    }
});




</script>

<template>
    <div class="grid mt-5 ">
        <div class="xl:col-3 lg:col-6 md:col-10 sm:col-12" v-for="data in weatherStore.cities">
            <WeatherCard class="mt-3" :city="data.cityName" />
        </div>
    </div>
</template>