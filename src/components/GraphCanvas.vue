<template>
  <div class="chart-container">
    <div ref="canvas" class="canvas"></div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts';
import { onMounted, onUnmounted, ref} from "vue";
import emitter from "../emitter/emitter.js";

import {storeToRefs} from "pinia";
import {useOptionConfig} from "../store/OptionConfig.js";
import {unloadAxis} from "../utils/CheckUtils.js";


const {echartsOptions,Hs,Vs,Ss} = storeToRefs(useOptionConfig())

const canvas = ref(null)

let myChart = null

const resize = () => {
  myChart.resize()
}

const loadChart = ()=>{

  if (echartsOptions.value.series.length === 0){
    console.log('系列为零,清除所有轴')
    Hs.value.forEach(item=>{
      item.isLoad = false
      unloadAxis(item,0)
    })
    Vs.value.forEach(item=>{
      item.isLoad = false
      unloadAxis(item,1)
    })
    echartsOptions.value.xAxis.length = 0
    echartsOptions.value.yAxis.length = 0
    echartsOptions.value.radiusAxis.length = 0
    echartsOptions.value.angleAxis.length = 0
    echartsOptions.value.polar.length = 0
  }
  console.log('重载图',echartsOptions.value)
  myChart.setOption(echartsOptions.value,{ notMerge: true });
}
const mergeOption = ()=>{
  console.log('合并图')
  myChart.setOption(echartsOptions.value);
}

const handleChartClick = (params)=>{

  console.log(params)
  console.log(params.event)

  if (params.seriesType!=='pie') return

  const target = echartsOptions.value.series.find(i=>  i.id+'' === params.seriesId)

  console.log(target)
  if (!target) return

  emitter.emit('show-menu-color',
      {
        x: params.event.event.clientX,
        y: params.event.event.clientY,
        handle: (color)=>{
          target.data[params.dataIndex].itemStyle.color = color
          console.log('合并图')
          myChart.setOption(echartsOptions.value);
        }
      })
}

onMounted(async () => {
  emitter.on('resize', resize)
  emitter.on('load-chart', loadChart)
  emitter.on('merge-option',mergeOption)
  myChart = echarts.init(canvas.value)
  myChart.on('click', handleChartClick);
})

onUnmounted(() => {
  emitter.off('resize', resize)
  emitter.off('load-chart', loadChart)
  emitter.off('merge-option',mergeOption)
})
</script>

<style scoped>
.chart-container {
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  gap: 10px;
}

.canvas {
  width: 100%;
  height: 100%;
}
</style>
