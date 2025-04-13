<template>
  <div v-show="localIsShowMenu" class="dialog">
    <div style="width: 600px; height: 600px;" ref="container" class="container">
    </div>
    <div ref="cancel" @click="close" class="cancel">
      <Close></Close>
    </div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts';
import {computed, onUnmounted, ref} from "vue";
import emitter from "../../emitter/emitter.js";
import {useOptionConfig} from "../../store/OptionConfig.js";
import {storeToRefs} from "pinia";
import Close from "../svg/Close.vue";

const container = ref(null);
const cancel = ref(null)
const localIsShowMenu = ref(false);
let myChart = null

let handle = null

const {palettes} = storeToRefs(useOptionConfig())

// 计算属性：保持断点排序
const colorSet = computed(() => {
  return palettes.value.filter(p => p.isLove)
});


const option = {
  animation: true, // 确保动画开启
  animationEasing: 'cubicInOut', // 缓动效果
  tooltip: {
    trigger: 'none',
    axisPointer: {animation: true}
  },
  xAxis: [],
  yAxis: [],
  series: [
    {
      padAngle: 1,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      radius: ['10%', '35%'],
      label: { show: true, position: 'inside', color: '#fff', fontWeight: 'bolder' },
      labelLine: {show: false},
      itemStyle: {borderRadius: 8, borderWidth: 2},
      type: 'pie',
      data: [],
      roseType: 'area'
    },

  ],
};

// 防抖函数（简单版）
function debounce(func, delay = 500) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

const showMenu = (args) => {
  container.value.style.top = `${args.y - 300}px`
  container.value.style.left = `${args.x - 300}px`

  cancel.value.style.top = `${args.y - 20}px`
  cancel.value.style.left = `${args.x - 20}px`

  handle = args.handle
  localIsShowMenu.value = true
  myChart = echarts.init(container.value,null, { renderer: 'svg' });
  option.series[0].data.length = 0
  colorSet.value.forEach((item, index) => {
    option.series[0].data.push({
      value: 10 + index,
      name: item.name,
      itemStyle: {
        color: '#0d6e6e'
      }
    })
  })
  myChart.setOption(option); // 强制重新渲染

  // 添加点击事件监听
  myChart.on('click', handleChartClick);
  // 监听鼠标悬停事件
  myChart.on('mouseover', debounce(handleChartHover))
}

const close = () => {
  localIsShowMenu.value = false
  myChart.dispose()
}

const handleChartClick = (params) => {
  if (params.seriesIndex !== 1) return
  handle(params.name)
  close()
};

const handleChartHover = (params) => {
  if (params.seriesIndex !== 0) return
  const target = colorSet.value[params.dataIndex]
  if (!option.series[1]){
    const colorSelect = {
      padAngle: 1,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      radius: ['40%', '65%'],
      label: { show: true, position: 'inside', color: '#fff', fontWeight: 'bolder' },
      labelLine: {show: false},
      itemStyle: {borderRadius: 8, borderWidth: 2},
      type: 'pie',
      data: [],
    }
    target.colors.forEach((item) => {
      colorSelect.data.push({
        value: 1,
        name: item,
        itemStyle: {
          color: item
        }
      })
    })
    option.series.push(colorSelect)
  }else {
    option.series[1].data.length = 0
    target.colors.forEach((item) => {
      option.series[1].data.push({
        value: 1,
        name: item,
        itemStyle: {
          color: item
        }
      })
    })
  }

  myChart.setOption(option); // 强制重新渲染
}

emitter.on('show-menu-color', showMenu)

onUnmounted(() => {
  emitter.off('show-menu-color', showMenu)
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

.container {
  position: fixed;
  display: flex;
  justify-content: center;
  align-content: center;
  z-index: 1;
}

.cancel {
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

.cancel:hover {
  transform: scale(1.1);
}

</style>