<template>
  <div class="chart-container">
    <LockButton></LockButton>
    <div ref="canvas" class="canvas"></div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts';
import {onMounted, onUnmounted, ref} from "vue";
import emitter from "../emitter/emitter.js";

import {storeToRefs} from "pinia";
import {useOptionConfig} from "../store/OptionConfig.js";
import {debounce} from "../utils/DebounceUtils.js";
import LockButton from "./button/LockButton.vue";
import {useGlobalConfig} from "../store/GlobalConfig.js";

const {echartsOptions,Ss} = storeToRefs(useOptionConfig())
const {global} = storeToRefs(useGlobalConfig())
const titleConfig =echartsOptions.value.graphic.elements[0]

const legendConfig =echartsOptions.value.graphic.elements[1]
const legend = global.value.legend
const legendEcharts = echartsOptions.value.legend


const canvas = ref(null)

let myChart = null

const resize = () => {
  myChart.resize()
}

const loadChart = ()=>{
  console.log('加载图',echartsOptions.value)
  myChart.setOption(echartsOptions.value,{ notMerge: true });
}

const mergeOption = ()=>{
  myChart.setOption(echartsOptions.value)
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

const handUpdateChart = (params)=> {
  debounce(()=>{

    echartsOptions.value.dataZoom.forEach((i,index)=>{
      if(
          !params.batch
          &&(
            (params.dataZoomId === '1' && [0,2].includes(index))
            ||
            (params.dataZoomId === '2' && [1,3].includes(index))
          )
      ){
          i.start = params.start
          i.end = params.end

      }else if(params.batch){
        if ([0,2].includes(index) && !!params.batch[0]){
          i.start = params.batch[0].start
          i.end = params.batch[0].end
        }else if ([1,3].includes(index) && params.batch[1]){
          i.start = params.batch[1].start
          i.end = params.batch[1].end
        }

      }


    })

  })()

}

titleConfig.ondrag = (p)=>{

  debounce(() => {
    titleConfig.position[0] = p.target.x
    titleConfig.position[1] = p.target.y
  }, 1000)()
}


const getLegendArea =()=>{
  const area = {
    width: 20,
    height: 0,
  }
  const size = Ss.value.filter(i=>i.isLoad).length
  if (legend.type){
    area.height = Math.max(legend.fontSize,14) + 15
  }else {
    area.height = (Math.max(legend.fontSize,14)+10)  * size + 10
  }

  return area

}

const initLegendArea = ()=> {
  legendConfig.shape = getLegendArea()
  console.log("加载图例")
}


legendConfig.ondrag = (p) =>{
  debounce(() => {

    legendEcharts.left = p.target.x + 10
    legendEcharts.top = p.target.y + 10

    legendConfig.position[0] = p.target.x
    legendConfig.position[1] = p.target.y

    mergeOption()
  }, 100)()
}


onMounted(()=>{

  myChart = echarts.init(canvas.value)
  myChart.on('click', handleChartClick);
  myChart.on('datazoom', handUpdateChart)

  emitter.on('resize', resize) // 新增
  emitter.on('load-chart', loadChart)
  emitter.on('merge-option',mergeOption)
  emitter.on('init-legend-area',initLegendArea)

})

onUnmounted(() => {
  window.addEventListener('resize', resize) // 新增
  emitter.off('resize', resize)
  emitter.off('load-chart', loadChart)
  emitter.off('merge-option',mergeOption)
  emitter.off('init-legend-area',initLegendArea)
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
  position: relative;
}

.canvas {
  width: 100%;
  height: 100%;
}
</style>
