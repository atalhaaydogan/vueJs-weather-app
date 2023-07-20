import { createApp } from 'vue'
import './style.css'
import 'primeflex/primeflex.css';
import App from './App.vue'
import PrimeVue from 'primevue/config'
import Button from 'primevue/button';
import InputText from "primevue/inputtext";
import Card from 'primevue/card';

const app = createApp(App);

app.use(PrimeVue)

app.component('Button', Button)
app.component('InputText', InputText)
app.component('Card', Card)


app.mount('#app')









