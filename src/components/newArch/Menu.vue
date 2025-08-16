<template>
  <div v-show="localIsShowMenu" class="dialog">
    <div style="width: 250px; height: 250px;"  ref="container" class="container">

    </div>
    <div ref="cancel" @click="close" class="cancel">
      <Close></Close>
    </div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts';
import {onMounted, onUnmounted, ref, watch} from "vue";
import Close from "../svg/Close.vue";
import emitter from "../../emitter/emitter.js";
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../../store/OptionConfig.js";
import { useI18n } from 'vue-i18n'

const container = ref();
const cancel = ref()
const localIsShowMenu = ref(false);
let myChart = null

const colors = ['#0D6E6E', '#FF3D3D', '#4a9d9c', '#0D6E6E'];

const { t, locale } = useI18n()

const option = {
  animation: true, // 确保动画开启
  animationEasing: 'cubicInOut', // 缓动效果
  tooltip: {
    trigger: 'none',
    axisPointer: { animation: true }
  },
  xAxis: [],
  yAxis: [],
  series: [{
    padAngle: 1,
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    },
    animationType:'scale',
    animationDuration:500,
    radius: ['20%', '80%'],
    label: { show: true, position: 'inside', color: '#fff', fontWeight: 'bolder',fontSize: '0.7em' },
    labelLine: { show: false },
    itemStyle: { borderRadius: 8, borderWidth: 2 },
    type: 'pie',
    data: [
      { value: 12, name: t('x0y'), itemStyle: { color: colors[1] } },
      { value: 11, name: t('polar'), itemStyle: { color: colors[2] } },
      { value: 13, name: t('series'), itemStyle: { color: colors[0] } },
      { value: 13, name: t('关系图'), itemStyle: { color: colors[1] } },
    ],
    roseType: 'area'
  }]
};

const showMenu = (args)=> {

  container.value.style.top = `${args.y - 125}px`
  container.value.style.left = `${args.x - 125}px`

  cancel.value.style.top = `${args.y - 20}px`
  cancel.value.style.left = `${args.x - 20}px`

  localIsShowMenu.value = true

  myChart.setOption(option,{ notMerge: true }); // 强制重新渲染

  // 添加点击事件监听
  myChart.on('click', handleChartClick);
}

const close = ()=>{
  localIsShowMenu.value = false
  myChart.setOption({},{ notMerge: true }); // 强制重新渲染
}

const optionConfigStore = useOptionConfig()

const {Cs} = storeToRefs(optionConfigStore)

// 定义菜单项处理器
const menuHandlers = [
  //X0Y
  () => {
    optionConfigStore.addX0Y()
    close()
  },
  //Polar
  () => {
    optionConfigStore.addPolar()
    close()
  },
  //Series
  () => {
    optionConfigStore.addSeries()
    close()
  },
  //关系图
  () => {
    optionConfigStore.addRelation()
    close()
  }
]

const handleChartClick = (params) => {
  if (params.componentType === 'series' && params.seriesType === 'pie') {

    const handler = menuHandlers[params.dataIndex]
    if (handler) {
      handler()
    }

  }
}


onMounted(()=>{
  myChart = echarts.init(container.value,null, { renderer: 'svg' });
  emitter.on('show-menu', showMenu)
})

onUnmounted(()=>{
  emitter.off('show-menu', showMenu)
})

watch(() => locale.value, () => {
  option.series[0].data[0].name =  t('x0y')
  option.series[0].data[1].name =  t('polar')
  option.series[0].data[2].name =  t('series')
  Cs.value[0].name = t('noSeries')
})
</script>

<style scoped>
.dialog {
  position: fixed;
  display: flex;
  width: 100%;
  height: 100%;
  z-index: 999;
}
.dialog::before {
  width: 1000vw;
  height: 1000vh;
  left: -500vh;
  top: -500vh;
  content: '';
  position: absolute;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  z-index: -1;
}
.container{
  position: fixed;
  display: flex;
  justify-content: center;
  align-content: center;
  z-index: 1;
}

.cancel{
  position: fixed;
  z-index: 2;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--2-background-color);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: 300ms ease-in-out;
}

.cancel:hover{
  transform: scale(1.1);
}
</style>
