<template>
    <Card style="width: 20em">
        <template #title>
            <div>{{ props?.city }}</div>
            <div></div>
        </template>
        <template #content>
            <div class="temperature">{{ props?.temp }}</div>
            <div class="weather-icon">
                <i :class="getWeatherIcon(props?.desc)" />
            </div>
        </template>

    </Card>
</template>

<script setup lang="ts">
import { defineProps } from "vue";


const props = defineProps({
    city: String,
    temp: String,
    desc: String
})

const getImageFromAPI = (city: string | undefined) => {
    if (!city) return document.body.style.backgroundImage = "url(/img.jpg)";

    fetch('https://api.teleport.org/api/urban_areas/slug:' + city + '/images/').then((resp) => {
        return resp.json();
    }).then((data) => {
        const imageUrl = data.status === 404 ? '/img.jpg' : data?.photos[0]?.image?.mobile;
        document.body.style.backgroundImage = "url('" + imageUrl + "')";
    }).catch(
        (err) => {
            document.body.style.backgroundImage = "url(/img.jpg)";
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
