import { createRouter, createWebHistory } from 'vue-router'
import DataSampling from "../components/configArea/DataSampling.vue";
import ModelBuild from "../components/configArea/ModelBuild.vue";
import Beautify from "../components/configArea/Beautify.vue";
import PaletteConfig from "../components/configArea/config/PaletteConfig.vue";
import GlobalConfig from "../components/configArea/config/GlobalConfig.vue";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: DataSampling,
  },
  {
    path: '/modelBuild',
    name: 'ModelBuild',
    component: ModelBuild
  },
  {
    path: '/beautify',
    name: 'Beautify',
    component: Beautify,
  },
  {
    path: '/palette',
    name: 'Palette',
    component: PaletteConfig,
  },
  {
    path: '/globalConfig',
    name: 'GlobalConfig',
    component: GlobalConfig,
  }
]

const router = createRouter({
  history: createWebHistory('/'),
  routes // short for `routes: routes`
})

export default router
