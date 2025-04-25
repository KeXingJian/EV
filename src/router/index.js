import { createRouter, createWebHistory } from 'vue-router'
import GraphSelect from "../components/configArea/GraphSelect.vue";
import DataSampling from "../components/configArea/DataSampling.vue";
import ModelBuild from "../components/configArea/ModelBuild.vue";
import Beautify from "../components/configArea/Beautify.vue";

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
  }
]

const router = createRouter({
  history: createWebHistory('/'),
  routes // short for `routes: routes`
})

export default router
