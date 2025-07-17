<template>
  <div class="chart-container">
    <div ref="canvas" class="canvas"></div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts';
import {onMounted, onUnmounted, ref} from "vue";
import emitter from "../emitter/emitter.js";

import {storeToRefs} from "pinia";
import {useOptionConfig} from "../store/OptionConfig.js";

const {echartsOptions} = storeToRefs(useOptionConfig())

const canvas = ref(null)

let myChart = null

const resize = () => {
  myChart.resize()
}



const loadChart = ()=>{
  //console.log('加载图',echartsOptions.value)
  myChart.setOption(echartsOptions.value,{ notMerge: true });
}

const mergeOption = ()=>{
  myChart.setOption(echartsOptions.value);
}

const handleChartClick = (params)=>{

  if (!(params.seriesType==='pie' || params.seriesType==='funnel')) return

  const target = echartsOptions.value.series.find(i => i.id+'' === params.seriesId)

  if (!target) return

  emitter.emit('show-menu-color',
      {
        x: params.event.event.clientX,
        y: params.event.event.clientY,
        handle: (color)=>{
          target.data[params.dataIndex].itemStyle.color = color
          myChart.setOption(echartsOptions.value);
        }
      }
  )
}

const handUpdateChart = (newData)=> {
  echartsOptions.value.dataZoom.forEach((i,index)=>{
    if (index===0 ||  index===1){
      i.start = newData.batch[0].start
      i.end = newData.batch[0].end
    }else {
      i.start = newData.batch[1].start
      i.end = newData.batch[1].end
    }
  })
}

onMounted(()=>{
  emitter.on('resize', resize) // 新增
  emitter.on('load-chart', loadChart)
  emitter.on('merge-option',mergeOption)
  myChart = echarts.init(canvas.value)
  myChart.on('click', handleChartClick);
  myChart.on('datazoom', handUpdateChart);
})

onUnmounted(() => {
  window.addEventListener('resize', resize) // 新增
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
