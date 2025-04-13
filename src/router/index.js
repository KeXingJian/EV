import { createRouter, createWebHistory } from 'vue-router'
import GraphSelect from "../components/configArea/GraphSelect.vue";
import DataSampling from "../components/configArea/DataSampling.vue";
import ModelBuild from "../components/configArea/ModelBuild.vue";
import Beautify from "../components/configArea/Beautify.vue";
import {BarChart, LineChart, PieChart, ScatterChart} from "echarts/charts";
import LineChartL from "../components/GrpahType/LineChartL.vue";
import BarChartL from "../components/GrpahType/BarChartL.vue";
import PieChartL from "../components/GrpahType/PieChartL.vue";
import ScatterChartL from "../components/GrpahType/ScatterChartL.vue";
import RadarChartL from "../components/GrpahType/RadarChartL.vue";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: GraphSelect,
  },
  {
    path: '/dataSampling',
    name: 'DataSampling',
    component: DataSampling
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
    children: [
      {
        path: 'lineChartL',
        name: 'LineChartL',
        component: LineChartL
      },
      {
        path: 'barChartL',
        name: 'BarChartL',
        component: BarChartL
      },
      {
        path: "pieChartL",
        name: 'PieChartL',
        component: PieChartL
      },
      {
        path: 'scatterChartL',
        name: 'ScatterChartL',
        component: ScatterChartL
      },
      {
        path: 'radarChartL',
        name: 'RadarChartL',
        component: RadarChartL
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory('/'),
  routes // short for `routes: routes`
})

export default router
