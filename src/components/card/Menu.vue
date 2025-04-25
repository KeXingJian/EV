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
import {onMounted, onUnmounted, ref} from "vue";
import Close from "../svg/Close.vue";
import emitter from "../../emitter/emitter.js";
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../../store/OptionConfig.js";
import {reloadGraph} from "../../utils/CheckUtils.js";
import {getGridSet} from "../../utils/GridSetUtils.js";

const container = ref(null);
const cancel = ref(null)
const localIsShowMenu = ref(false);
let myChart = null

const colors = ['#0D6E6E', '#FF3D3D', '#4a9d9c', '#0D6E6E'];

let target = null

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
    label: { show: true, position: 'inside', color: '#fff', fontWeight: 'bolder' },
    labelLine: { show: false },
    itemStyle: { borderRadius: 8, borderWidth: 2 },
    type: 'pie',
    data: [
      { value: 13, name: '横轴', itemStyle: { color: colors[0] } },
      { value: 12, name: '纵轴', itemStyle: { color: colors[1] } },
      { value: 11, name: '系列', itemStyle: { color: colors[2] } },
      { value: 10, name: '图', itemStyle: { color: colors[3] } }
    ],
    roseType: 'area'
  }]
};

const showMenu = (args)=> {

  container.value.style.top = `${args.y - 125}px`
  container.value.style.left = `${args.x - 125}px`

  cancel.value.style.top = `${args.y - 20}px`
  cancel.value.style.left = `${args.x - 20}px`

  target = args.target

  localIsShowMenu.value = true

  myChart.setOption(option,{ notMerge: true }); // 强制重新渲染

  // 添加点击事件监听
  myChart.on('click', handleChartClick);
}

const close = ()=>{
  localIsShowMenu.value = false
  myChart.setOption({},{ notMerge: true }); // 强制重新渲染
}

const {gIndex,hIndex,vIndex,sIndex,Gs,Hs,Vs,Ss,echartsOptions} = storeToRefs(useOptionConfig())

// 定义菜单项处理器
const menuHandlers = {
  '横轴': () => {
    Hs.value.push({
      id: ++hIndex.value,
      name:'H'+hIndex.value,
      G: target,
      isLoad:false,
      field: -1,
      type: 0,
      axisName: '',
      unit: '',
      textColor: '#fff',
      labelColor: '#fff',
      lineColor: '#0D6E6E',
      tickLine: false,
      splitLine: false,
      labelShow: true,
      show: true,
      symbol: true,
      position: true,
      offset: 0,
    })
    close();
  },
  '纵轴': () => {
    Vs.value.push({
      id: ++vIndex.value,
      name:'V'+vIndex.value,
      G: target,
      isLoad:false,
      field: -1,
      type: 1,
      axisName: '',
      unit: '',
      textColor: '#fff',
      labelColor: '#fff',
      lineColor: '#0D6E6E',
      labelShow: true,
      tickLine: false,
      splitLine: false,
      show: true,
      symbol: true,
      position: false,
      offset: 0,
      sa: 0,
      ea:360
    })
    close();
  },
  '系列': () => {
    const newSeries = {
      id: ++sIndex.value,
      name: 'S'+sIndex.value,
      G: target,
      D: null,
      H:null,
      V:null,
      isLoad:false,
      color: '#FF4081',
      type: 0, //0折线,1柱状,2极坐标,3饼图,4散点,5雷达
      areaColor: '#FF4081',
      isLabel: false,
      pieces: [],
      lineConfig: {
        lineType: 0,  //直线,曲线,折线
        startPoint: -1,
        isArea: false,
        isLayer: false,
      },
      scatterConfig: {
        type: 0,
        mapField: -1,
      },
      barConfig:{

      },
      pieConfig: {
        isRose: false,
        roseType: 0, //0,半径
        borderRadius: 10,
        padAngle: 2,
        position: 0, //内嵌
        labelLine: true,
        pi: 0,
        po: 80,
        pt:50,
        pl:50,
      },
      radarConfig: {

      }
    }

    if (target.type === 0 || target.type === 1) newSeries.type = 0



    Ss.value.push(newSeries)
    close();
  },
  '图': () => {
    if (Gs.value.length===4){
      close();
      return
    }
    const gridSet = getGridSet()

    Gs.value.push({
      id:++gIndex.value,
      name: 'G'+gIndex.value,
      isLoad:false,
      gridIndex: Gs.value.length,
      polarIndex: Gs.value.length,
      stackType:false,
      type: 0,//x为0,极为1,饼为2,雷3
      t:0,
      b:0,
      l:0,
      r:0,
      w:0,
      h:0,
      pi:0,
      po:88,
      pl:50,
      pt:50,
      isStack: false,
      isStackAxisLoad: false,
      isPolarAxisLoad:false,
      polarType: false,

    })
    console.log('添加图')
    echartsOptions.value.grid = gridSet[Gs.value.length-1].map(i=>i.item)

    console.log('变更echartsOptions.grid',echartsOptions.value.grid)
    reloadGraph()
    close();
  }
};

const handleChartClick = (params) => {
  if (params.componentType === 'series' && params.seriesType === 'pie') {
    const handler = menuHandlers[params.name];
    if (handler) {
      handler();
    }
  }
};
onMounted(()=>{
  myChart = echarts.init(container.value,null, { renderer: 'svg' });
  emitter.on('show-menu', showMenu)
})


onUnmounted(()=>{
  emitter.off('show-menu', showMenu)
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
