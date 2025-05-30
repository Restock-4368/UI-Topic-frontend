import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import index from "./i18n/index.js";
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import {
    Button,
    Column,
    DataTable,
    Carousel,
    Select,
    Dialog,
    InputText,
    Card,
    Menubar,
    Image,
    SelectButton,
    Toolbar,
    Calendar,
    InputNumber,
    ToggleSwitch,
    FileUpload,
    Tabs,
    TabPanel, TabList, Tab, TabPanels,
} from "primevue";
import router from "./router/index.js";

const app = createApp(App);

app
    .use(router)
    .use(index)
    .use(PrimeVue, {ripple: true, theme: {preset: Aura }})
    .component('pv-button', Button)
    .component('pv-card', Card)
    .component('pv-select-button', SelectButton)
    .component('pv-menubar', Menubar)
    .component('pv-toolbar', Toolbar)
    .component('pv-image', Image)
    .component('pv-input-text', InputText)
    .component('pv-select', Select)
    .component('pv-dialog', Dialog)
    .component('pv-carousel', Carousel)
    .component('pv-data-table', DataTable)
    .component('pv-column', Column)
    .component('pv-calendar', Calendar)
    .component('pv-input-number', InputNumber)
    .component('pv-input-switch', ToggleSwitch)
    .component('ToggleSwitch', ToggleSwitch)
    .component('FileUpload', FileUpload)
    .component('pv-tabs', Tabs)
    .component('pv-tab-panel', TabPanel)
    .component('pv-tab-list', TabList)
    .component('pv-tab', Tab)
    .component('pv-tab-panels', TabPanels)

.mount('#app');
