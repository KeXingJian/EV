import { createApp } from 'vue'
import App from './App.vue'
import './styles/variables.css'
import { createPinia } from 'pinia'
import router from './router'
import {AllCommunityModule, ModuleRegistry} from "ag-grid-community";
import {DomainCheckPlugin} from "./plugins/dominCheck.js";


const pinia = createPinia()
const app = createApp(App)

ModuleRegistry.registerModules([AllCommunityModule]);
app.use(pinia)
app.use(router)
app.use(DomainCheckPlugin)

app.mount('#app')
