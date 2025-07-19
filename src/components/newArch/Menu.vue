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
import {getGrid, getPolar} from "../../utils/newArch/Position.js";
import {loadAxis} from "../../utils/newArch/AxisUtis.js";
import {pushMsg} from "../../utils/MsgUtils.js";
import { useI18n } from 'vue-i18n'

const container = ref(null);
const cancel = ref(null)
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

const {Cs,Ss,Ds,echartsOptions,cIndex,sIndex,fileData} = storeToRefs(useOptionConfig())

// 定义菜单项处理器
const menuHandlers = [
  () => {
    const c =  {
      id: ++cIndex.value,
      name: 'C'+cIndex.value,
      type: 0, //0:x0y系;1:极坐标系;2无系
      grid: getGrid(),
      polar:null,
      isLoad:false,
      axisType: false, //横轴为类目
      isStack: false,
      H:{
        name: 'H'+cIndex.value,
        axisName: 'H'+cIndex.value,
        unit: '',
        textColor: '#000', //轴名称
        tickLine: false, //标线
        splitLine: false, //隔线

        labelColor: '#000', //下标
        labelShow: true, //下标

        lineColor: '#0D6E6E', //轴线
        show: true, //轴线

        symbol: true, //向右
        position: true, //下

        offset: 0,
      },
      V:{
        name: 'V'+cIndex.value,
        axisName: 'V'+cIndex.value,
        unit: '',
        textColor: '#000', //轴名称
        tickLine: false, //标线
        splitLine: false, //隔线

        labelColor: '#000', //下标
        labelShow: true, //下标

        lineColor: '#0D6E6E', //轴线
        show: true, //轴线

        symbol: true, //向上
        position: false, //左

        offset: 0,
      }
    }
    Cs.value.push(c)
    loadAxis(c,echartsOptions)
    close();
  },
  () => {
    const c = {
      id: ++cIndex.value,
      name: 'C'+cIndex.value,
      type: 1, //0:x0y系;1:极坐标系;2无系
      grid:null,
      polar: getPolar(),
      isLoad:false,
      axisType: false, //横轴为类目
      isStack: false,
      H:{
        name: 'H'+cIndex.value,
        axisName: 'H'+cIndex.value,
        unit: '',
        textColor: '#000', //轴名称
        tickLine: false, //标线
        splitLine: false, //隔线

        labelColor: '#000', //下标
        labelShow: true, //下标

        lineColor: '#0D6E6E', //轴线
        show: true, //轴线

        symbol: true, //向右
        position: true, //下

      },
      V:{
        name: 'V'+cIndex.value,
        axisName: 'V'+cIndex.value,
        unit: '',
        textColor: '#000', //轴名称
        tickLine: false, //标线
        splitLine: false, //隔线

        labelColor: '#000', //下标
        labelShow: true, //下标

        lineColor: '#0D6E6E', //轴线
        show: true, //轴线

        symbol: true, //向上
        position: false, //左

        sa: 0,
        ea: 360
      }
    }
    Cs.value.push(c)
    loadAxis(c,echartsOptions)
    close();
  },

  () => {
    const s = {
      id: ++sIndex.value,
      name: 'S'+sIndex.value,
      seriesName: 'S'+sIndex.value,
      C:null,
      category: -1,
      number: -1,
      isLoad: false,
      color: '#FF4081',
      type: 0, //0折线,1柱状,2散点,3饼图,4雷达
      areaColor: '#FF4081',
      D:Ds.value[0],
      isLabel: false,
      labelColor: '#000',

      lineConfig: {
        lineType: 0,  //直线,曲线,折线
        startPoint: 0,
        isArea: false,
      },
      barConfig: {
        borderRadius: 5,
        barGap: 5,
        barWidth: 40,
        isAuto: true,
      },
      scatterConfig: {
        type: 0,
        mapField: -1,
        range: [20,50],
        size: 20,
      },

      pieConfig: {
        isRose: false,
        roseType: 0, //0,半径
        borderRadius: 10,
        padAngle: 0,
        position: 0, //内嵌
        labelLine: true,
        polar: getPolar()
      },
      funnelConfig: {
        position: {
          t: 7,
          b: 0,
          l: 8,
          r: 0,
          w: 85,
          h: 80
        },
        sort: 0, //升 无 降
        gap: 2,
        labelPosition: 0, //左,中,右
        align: 1 //左,中,右
      },
      radarConfig: {
        isArea: false,
        areaColor: '#FF4081'
      }
    }
    Ss.value.push(s)
    close();
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
