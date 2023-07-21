<template>
    <Card style="width: 20em">
        <template #title>
            <div>{{ props?.city }}</div>
            <div><img width="200" :src="background" alt=""></div>
        </template>
        <template #content>
            <div class="'temperature' text-xl">{{ props?.temp }}</div>
            <div class="'weather-icon' mt-2">
                <i :class="getWeatherIcon(props?.desc)" class="text-xl" />
            </div>
        </template>

    </Card>
</template>

<script setup lang="ts">
import axios from "axios";
import { defineProps, onMounted, ref } from "vue";

const background = ref<string>('')

const props = defineProps({
    city: String,
    temp: String,
    desc: String
})

onMounted(()=>{
    getImageFromAPI(props.city)
})

const getImageFromAPI = (city: string | undefined) => {
    if (!city)  {
        background.value = "/img.jpg";
        return;
    }

    axios.get('https://api.teleport.org/api/urban_areas/slug:' + city.toLocaleLowerCase() + '/images/')
    .then((response:any) => {
        const imageUrl = response.data?.photos[0]?.image?.mobile;
        background.value = imageUrl;
        
    }).catch(
        () => {
            background.value = "/img.jpg";
        }
    )
}





const getWeatherIcon = (description: any) => {
    console.log(description)
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
    console.log(iconClass, "deneme");
    return iconClass;
};
</script>
