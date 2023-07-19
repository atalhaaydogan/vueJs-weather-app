import { createApp } from 'vue'
import './style.css'
import 'primeflex/primeflex.css';
import App from './App.vue'
import PrimeVue from 'primevue/config'
import Button from 'primevue/button';


const app = createApp(App);
app.mount('#app')
app.use(PrimeVue)

app.component('Button', Button)









