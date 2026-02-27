<template>
  <div class="chart-container">
    <LockButton></LockButton>
    <div ref="canvas" class="canvas"></div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts';
import {onMounted, ref} from "vue";
import emitter from "../emitter/emitter.js";

import {storeToRefs} from "pinia";
import {useOptionConfig} from "../store/OptionConfig.js";
import {debounce} from "../utils/DebounceUtils.js";
import LockButton from "./button/LockButton.vue";
import {useGlobalConfig} from "../store/GlobalConfig.js";
import {useNodeState} from "../store/NodeState.js";
import {getRandomInt} from "../utils/newArch/Position.js";
import {
  centerSpread,
  getFieldDetails,
} from "../utils/newArch/Check4Series.js";

const {echartsOptions,getChartSize} = useOptionConfig()
const {chartInstance,Ss,isLoadRelation} = storeToRefs(useOptionConfig())
const {global} = useGlobalConfig()
const {setColorPie} = useNodeState()

const titleConfig =echartsOptions.graphic.elements[0]

const legendConfig =echartsOptions.graphic.elements[1]
const legend = global.legend
const legendEcharts = echartsOptions.legend

const canvas = ref()

let myChart = null

const resize = () => {
  myChart.resize()
}

const loadChart = ()=>{
  console.log('加载图',echartsOptions)
  myChart.setOption(echartsOptions,{ notMerge: true });
}

const mergeOption = ()=>{
  myChart.setOption(echartsOptions)
}

//点击事件
const handleChartClick = (params)=>{

  const target = echartsOptions.series.find(i => i.id+'' === params.seriesId)
  if (!target) return
  if(params.seriesType==='pie' || params.seriesType==='funnel' ){

    const targetData =  target.data[params.dataIndex]
    emitter.emit('show-menu-color',
        {
          x: params.event.event.clientX,
          y: params.event.event.clientY,
          handle: (color)=>{
            targetData.itemStyle.color = color
            setColorPie(targetData.id+target.id,color)
            myChart.setOption(echartsOptions);
          }
        }
    )
  }



}
//缩放事件
const handUpdateChart = (params)=> {
  debounce(()=>{
    echartsOptions.dataZoom.forEach((i,index)=>{
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

//标题与图例拖拽
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

const restore = ()=>{
  if (isLoadRelation.value){

    const {width, height} = getChartSize()

    const targetMap = Ss.value.find(i=>i.type === 5)
    const target = echartsOptions.series.find(i=>i.type === 'graph')

    const {weightConfig:{isWeightMap,canWeightMap}} = targetMap

    const {nodes} = target

    const toWeightMap = canWeightMap && isWeightMap

    const detailsS = toWeightMap ? getFieldDetails(4) : null
    const detailsO = toWeightMap ? getFieldDetails(5) : null


    const {max, min} =  toWeightMap ?
        {
          max: Math.max(detailsS.max, detailsO.max),
          min: Math.min(detailsS.min, detailsO.min),
        }
        : {max:0,min:0}


    nodes.forEach(d=> {
      let position = {
        x: getRandomInt(250,500),
        y: getRandomInt(250,500),
      }

      if (toWeightMap && d.weight!==-1){
        position = centerSpread(
            width, height, min, max,
            d.weight, 1
        )
      }

      d.x = position.x
      d.y = position.y
    })

  }
  loadChart()

}

const initLegendArea = ()=> {
  legendConfig.shape = getLegendArea()
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

  myChart.on('restore', restore)

  chartInstance.value = myChart

  emitter.on('resize', resize) // 新增
  emitter.on('load-chart', loadChart)
  emitter.on('merge-option',mergeOption)
  emitter.on('init-legend-area',initLegendArea)

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

