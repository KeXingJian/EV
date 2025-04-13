<template>
  <div class="config-container">
    <RadioBox
        v-model="item.type"
        :options="seriesTypeSelect"
        :name="'seriesTypeSelect'+item.id"
    ></RadioBox>
    <div>
      <div class="left">
        <span>边距</span>
        <div class="config-item">
          <span>上:</span>
          <ProgressBar
              v-model="item.t"
              :width="190"
              :min="0"
              :max="100"
              :step="0.1"
              unit="%"
          ></ProgressBar>
        </div>
        <div class="config-item">
          <span>下:</span>
          <ProgressBar
              v-model="item.b"
              :width="190"
              :min="0"
              :max="100"
              :step="0.1"
              unit="%"
          ></ProgressBar>
        </div>
        <div class="config-item">
          <span>左:</span>
          <ProgressBar
              v-model="item.l"
              :width="190"
              :min="0"
              :max="100"
              :step="0.1"
              unit="%"
          ></ProgressBar>
        </div>
        <div class="config-item">
          <span>右:</span>
          <ProgressBar
              v-model="item.r"
              :width="190"
              :min="0"
              :max="100"
              :step="0.1"
              unit="%"
          ></ProgressBar>
        </div>
      </div>

      <div class="right">
        <span>大小</span>

        <div class="config-item">
          <span>宽:</span>
          <ProgressBar
              v-model="item.w"
              :width="190"
              :min="0"
              :max="100"
              :step="0.1"
              unit="%"
          ></ProgressBar>
        </div>
        <div class="config-item">
          <span>高:</span>
          <ProgressBar
              v-model="item.h"
              :width="190"
              :min="0"
              :max="100"
              :step="0.1"
              unit="%"
          ></ProgressBar>
        </div>

        <div class="config-item b" :class="{
          inactivation: item.type===2 || item.type===3
        }">
          <span>堆叠化:</span>
          <CheckBox v-model="item.isStack"
                    :inactivation="item.type===2 || item.type===3"
          ></CheckBox>
        </div>
        <div class="config-item b"
             :class="{
              inactivation: item.type===2 || item.type===3
             }"
        >
          <span>分层化:</span>
          <CheckBox v-model="item.isLayer"
                    :inactivation="item.type===2 || item.type===3"
          ></CheckBox>
        </div>
      </div>
    </div>

    <section class="ProgressBarArea" :class="{ isLayer:item.type===0 || item.type===1 && item.isLayer}">
      <div>
        <ProgressBarArea></ProgressBarArea>
      </div>
    </section>
  </div>
</template>

<script setup>
import ProgressBar from "../button/ProgressBar.vue";
import {computed, toRefs, watch} from "vue";
import {buildGrid, seriesChange, unloadAxis, unloadSeries} from "../../utils/CheckUtils.js";
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../../store/OptionConfig.js";
import emitter from "../../emitter/emitter.js";
import CheckBox from "../box/CheckBox.vue";
import {addHForType0, addVForType0} from "../../utils/ChartUtils.js";
import ProgressBarArea from "../button/ProgressBarArea.vue";
import RadioBox from "../box/RadioBox.vue";

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const seriesTypeSelect = [
  {
    value: 0,
    label: 'x0y系'
  },
  {
    value: 1,
    label: '极坐标系'
  },
  {
    value: 2,
    label: '半径&角度系'
  },
  {
    value: 3,
    label: '雷达系'
  }
]

// 将 item 转换为响应式引用
const {isStack,type} = toRefs(props.item);

const {echartsOptions, Ss, Vs, Hs} = storeToRefs(useOptionConfig())

const buildPosition = computed(() => {

  return buildGrid(
      props.item.t,
      props.item.b,
      props.item.l,
      props.item.r,
      props.item.w,
      props.item.h,
  )
})

watch(buildPosition, (newVal) => {
  echartsOptions.value.grid[props.item.gridIndex] = newVal
  console.log('图更新触发合并')
  emitter.emit('merge-option')
})

watch(isStack, (newVal) => {
  if (newVal) {
    console.log('令图堆叠')
    console.log('找出所有已加载的系列并卸载,决定加载什么轴作为,数值轴合并轴')
    let hc = 0
    let vc = 0
    Ss.value.filter(i => i.isLoad && i.G.id === props.item.id).forEach((i) => {
      if (i.H.type === 1) hc++
      if (i.V.type === 1) vc++
      unloadSeries(i)
    })

    Hs.value.filter(i => i.isLoad && i.G.id === props.item.id).forEach((i) => {
      unloadAxis(i, 0)
    })

    Vs.value.filter(i => i.isLoad && i.G.id === props.item.id).forEach((i) => {
      unloadAxis(i, 1)
    })

    const stackAxis = {
      id: -1 + props.item.name,
      name: '堆叠轴-' + props.item.name,
      G: props.item,
      isLoad: true,
      field: -1,
      type: 1,
      axisName: '堆叠轴',
      unit: '',
      textColor: '#fff',
      labelColor: '#fff',
      lineColor: '#0D6E6E',
      tickLine: false,
      splitLine: false,
      textShow: true,
      show: true,
      symbol: true,
      position: false,
      offset: 0,
    }

    console.log('添加堆叠轴')
    if (hc > vc) { //倾向加载V轴
      props.item.stackAxisType = 0
      Hs.value.push(stackAxis)

      console.log('载入堆叠轴')
      addHForType0(stackAxis, echartsOptions)
    } else {
      props.item.stackAxisType = 1
      Vs.value.push(stackAxis)
      console.log('载入堆叠轴')
      addVForType0(stackAxis, echartsOptions)
    }

    console.log("重载系列")
    Ss.value.filter(i => i.G.id === props.item.id).forEach((i) => {
      seriesChange(i)
    })

  } else {
    console.log("卸载相关系列")
    Ss.value.filter(i => i.isLoad && i.G.id === props.item.id).forEach((i) => {
      unloadSeries(i)
    })
    console.log('从echartsOptions卸载堆叠轴')
    if (props.item.stackAxisType === 0) {
      echartsOptions.value.xAxis = echartsOptions.value.xAxis.filter(i => i.id !== -1 + props.item.name,)

      console.log('从映射配置中移除')
      Hs.value = Hs.value.filter(item =>
          item.id !== -1 + props.item.name,
      )

    } else if (props.item.stackAxisType === 1) {
      echartsOptions.value.yAxis = echartsOptions.value.yAxis.filter(i => i.id !== -1 + props.item.name,)

      console.log('从映射配置中移除')
      Vs.value = Vs.value.filter(item =>
          item.id !== -1 + props.item.name,
      )
    }
    props.item.stackAxisType = -1

    console.log('查看H轴', Hs.value)
    console.log('查看V轴', Vs.value)

    console.log("重载系列")

    Ss.value.filter(i => i.G.id === props.item.id).forEach((i) => {
      seriesChange(i)
    })

  }
}, {deep: false})

watch(type, (newVal) =>{
  Ss.value.forEach(i => {
    if (newVal===0 || newVal===1) {
      i.type = 0
    }else if(newVal===2 || newVal===3) {
      i.type = newVal+1
    }

  })
})
</script>

<style scoped>
.config-container {

  > div {
    padding: 15px 8px;
    display: flex;
    grid-template-columns: 50% 50%;
    max-width: 500px;
    gap: 20px;
    background-color: var(--2-background-color);
  }

  display: grid;
  position: relative;
  background-color: var(--2-background-color);
}

.config-container:after {
  content: '';
  width: 100%;
  position: absolute;
  height: 1px;
  border-radius: 1px;
  z-index: 0;
  top: 99%;
  left: 0;
  background: linear-gradient(
      90deg,
      var(--2-background-color) 0%,
      var(--border-color) 50%,
      var(--2-background-color) 100%
  );
}

.left, .right {
  display: flex;
  gap: 20px;
  flex-direction: column;
}

.config-item {
  display: flex;
  align-items: center;
  gap: 20px;
}


span {
  font-weight: bolder;
}

.ProgressBarArea {
  display: grid;
  grid-template-rows: 0fr;
  transition: 300ms ease-in-out;

  > div {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

}

.isLayer.ProgressBarArea {
  grid-template-rows: 1fr;
}

.inactivation {
  cursor: not-allowed !important;

  span {
    color: var(--inactivation-color);
  }
}
</style>
