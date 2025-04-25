<template>
  <div class="config-container">
    <RadioBox
        v-model="item.type"
        :options="seriesTypeSelect"
        :name="'seriesTypeSelect'+item.id"
    ></RadioBox>
    <div v-if="item.type!==2">
      <div class="left">
        <span>边距</span>
        <div class="config-item" v-if="item.type===0">
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
        <div class="config-item" v-if="item.type===0">
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
        <div class="config-item" v-if="item.type===1">
          <span>上:</span>
          <ProgressBar
              v-model="item.pt"
              :width="190"
              :min="0"
              :max="100"
              :step="0.1"
              unit="%"
          ></ProgressBar>
        </div>
        <div class="config-item" v-if="item.type===1">
          <span>左:</span>
          <ProgressBar
              v-model="item.pl"
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
        <div class="config-item" v-if="item.type===0">
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
        <div class="config-item" v-if="item.type===0">
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
        <div class="config-item" v-if="item.type===1">
          <span>内径:</span>
          <ProgressBar
              v-model="item.pi"
              :width="190"
              :min="0"
              :max="100"
              :step="0.1"
              unit="%"
          ></ProgressBar>
        </div>
        <div class="config-item" v-if="item.type===1">
          <span>外径:</span>
          <ProgressBar
              v-model="item.po"
              :width="190"
              :min="0"
              :max="100"
              :step="0.1"
              unit="%"
          ></ProgressBar>
        </div>

      </div>

    </div>
    <div class="o" v-if="item.type!==2">
      <div class="config-item " :class="{
          inactivation: item.type===2 || item.type===3
        }">
        <span>堆叠化</span>
        <CheckBox v-model="item.isStack"
                  :inactivation="item.type===2 || item.type===3"
        ></CheckBox>
      </div>
      <section class="config-item "
               :class="{
              inactivation: item.type !==0
             }"
               v-if="item.type ===0"
      >
        <span>纵堆叠</span>
        <select-button v-model="item.stackType"
                       :inactivation="item.type !==0">

        </select-button>
        <span>横堆叠</span>
      </section>
      <section class="config-item "
               v-if="item.type ===1"
               :class="{
              inactivation: item.type !==1
             }"
      >
          <span :style="{
            width: '66px'
          }">纵轴数化</span>
        <select-button v-model="item.polarType"
                       :inactivation="item.type !== 1 ">
        </select-button>
        <span :style="{
            width: '66px'
          }">横轴数化</span>
      </section>
    </div>
  </div>
</template>

<script setup>
import ProgressBar from "../button/ProgressBar.vue";
import {computed, toRefs, watch} from "vue";
import {buildGrid, buildPolar, seriesChange, unloadAxis, unloadSeries} from "../../utils/CheckUtils.js";
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../../store/OptionConfig.js";
import emitter from "../../emitter/emitter.js";
import CheckBox from "../box/CheckBox.vue";
import RadioBox from "../box/RadioBox.vue";
import SelectButton from "../button/SelectButton.vue";
import {unload4Stack, unloadGraphHasLoadItem} from "../../utils/ChartUtils.js";

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
    label: '无系图(饼图)'
  },
]

// 将 item 转换为响应式引用
const {isStack, type, stackType,polarType} = toRefs(props.item);

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

const buildPosition4Polar = computed(() => {

  return buildPolar(
      props.item.pi,
      props.item.po,
      props.item.pl,
      props.item.pt,
  )
})

watch(buildPosition, (newVal) => {
  echartsOptions.value.grid[props.item.gridIndex] = newVal
  console.log('图更新触发合并')
  emitter.emit('merge-option')
})
watch(buildPosition4Polar, (newVal) => {
  const target = echartsOptions.value.polar.find(i=>i.id===props.item.id)

  if(!target) return

  target.radius = newVal.radius
  target.center = newVal.center
  console.log('图更新触发合并')
  emitter.emit('merge-option')
})

watch(isStack, (newVal) => {
  if (newVal) {
    console.log('令图堆叠')
    console.log('找出所有已加载的系列并卸载')
    unloadGraphHasLoadItem(props.item, Ss, Hs, Vs)

    console.log("重载系列")
    Ss.value.filter(i => i.G.id === props.item.id).forEach((i) => {
      seriesChange(i)
    })
  } else {
    console.log("卸载相关系列")
    Ss.value.filter(i => i.isLoad && i.G.id === props.item.id).forEach((i) => {
      unloadSeries(i)
    })
    unload4Stack(props.item.stackType, Hs, Vs, echartsOptions, props)
    console.log("重载系列")
    Ss.value.filter(i => i.G.id === props.item.id).forEach((i) => {
      seriesChange(i)
    })

  }
}, {deep: false})

watch(type, (newVal) => {

  console.log('卸载所有相关系列')
  Ss.value.filter(i => i.isLoad && i.G.id === props.item.id).forEach(i => {
    if (newVal === 0 || newVal === 1) {
      i.type = 0
    } else if (newVal === 2 || newVal === 3) {
      i.type = newVal + 1
    }
    unloadSeries(i)
  })

  console.log('卸载所有相关H')
  Hs.value.filter(i => i.isLoad && i.G.id === props.item.id).forEach((i) => {
    unloadAxis(i, 0)
  })

  console.log('卸载所有相关V')
  Vs.value.filter(i => i.isLoad && i.G.id === props.item.id).forEach((i) => {
    unloadAxis(i, 1)
  })



  console.log('重载相关系列')
  Ss.value.filter(i => i.G.id === props.item.id).forEach((i) => {
    seriesChange(i)
  })

})

watch(stackType, (newVal) => {
  if (!props.item.isStack) return
  console.log('令图堆叠')
  console.log('找出所有已加载的系列并卸载')
  unloadGraphHasLoadItem(props.item, Ss, Hs, Vs)
  console.log("重载系列")
  Ss.value.filter(i => i.G.id === props.item.id).forEach((i) => {
    seriesChange(i)
  })

})

watch(polarType, (newVal) => {
  console.log('找出所有已加载的系列并卸载')
  unloadGraphHasLoadItem(props.item, Ss, Hs, Vs)
  console.log("重载系列")
  Ss.value.filter(i => i.G.id === props.item.id).forEach((i) => {
    seriesChange(i)
  })

})
</script>

<style scoped>
.config-container {

  > div {
    padding: 15px 8px;
    display: flex;
    max-width: 500px;
    gap: 10px;
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
  span{
    width: 37px;
  }
}

.config-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.o{
  display: flex;
  justify-content: space-between;
}

span {
  font-weight: bolder;
}

.inactivation {
  cursor: not-allowed !important;

  span {
    color: var(--inactivation-color);
  }
}
</style>
