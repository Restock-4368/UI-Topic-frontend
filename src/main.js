import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import i18n from "./i18n.js";
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import {Button,Column, DataTable,Carousel,Dropdown,Dialog,InputText, Card, Menubar, Image, SelectButton, Toolbar} from "primevue";

const app = createApp(App);

app
    .use(i18n)
    .use(PrimeVue, {ripple: true, theme: {preset: Aura }})
    .component('pv-button', Button)
    .component('pv-card', Card)
    .component('pv-select-button', SelectButton)
    .component('pv-menubar', Menubar)
    .component('pv-toolbar', Toolbar)
    .component('pv-image', Image)
    .component('pv-input-text', InputText)
    .component('pv-dropdown', Dropdown)
    .component('pv-dialog', Dialog)
    .component('pv-carousel', Carousel)
    .component('pv-data-table', DataTable)
    .component('pv-column', Column)

.mount('#app');
