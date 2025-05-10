import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import i18n from "./i18n.js";
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import {Button, Card, Menubar, Image, SelectButton, Toolbar} from "primevue";

/**
 * @summary Define main entry point
 */
const app = createApp(App);

app
    .use(i18n)
    .use(PrimeVue, {ripple: true, theme: {preset: Aura }})
    .component('pv-button', Button)
    .component('pv-card', Card)
    .component('pv-select-button', SelectButton)
    //.component('pv-menu', Menu)
    .component('pv-menubar', Menubar)
    .component('pv-toolbar', Toolbar)
    //.component('pv-tooltip', Tooltip)
    .component('pv-image', Image)
    .mount('#app');
