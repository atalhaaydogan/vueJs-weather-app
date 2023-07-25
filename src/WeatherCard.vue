<template>
    <Card style="width: 20em" class="position: relative" @mouseenter="showDeleteIcon = true"
        @mouseleave="showDeleteIcon = false">
        <template #header>
            <div class="d-flex justify-content-between">
                <div class="text-xl ">{{ props?.city }}</div>
                <div class="text-xl">
                    <Button v-if="showDeleteIcon" icon="pi pi-times" class="p-button-rounded p-button-text delete-icon"
                        @click="deleteFromLocalStorage(props?.cardId)" />
                </div>
            </div>
        </template>
        <template #title>
            <div><img width="250" height="133" :src="background" alt=""></div>
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
    desc: String,
    cardId: Number
})

onMounted(() => {
    getImageFromAPI(props.city)
})

// const deleteFromLocalStorage = (cardId: Number) => {
//     // delete local storage 
//     const storedWeatherData = localStorage.getItem('weatherCards');
//     if (storedWeatherData) {
//         const data = JSON.parse(storedWeatherData);
//         const newData = data.filter((item: any) => item.index !== cardId);
//         localStorage.setItem('weatherCards', JSON.stringify(newData));
//     }

// }

const getImageFromAPI = (city: string | undefined) => {
    if (!city) {
        background.value = "/img.jpg";
        return;
    }

    axios.get('https://api.teleport.org/api/urban_areas/slug:' + city.toLocaleLowerCase() + '/images/')
        .then((response: any) => {
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


<style scoped>
.delete-icon {
    position: absolute;
    right: 0;
    top: 0;

}

</style>
