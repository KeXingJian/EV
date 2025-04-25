<template>
  <div class="series-config">

    <div class="chart-select" v-if="item.G.type===0 || item.G.type===1">
      <RadioBox
          v-model="item.type"
          :options="GraphTypeSelect"
          :name="'GraphTypeSelect'+item.id"
      ></RadioBox>
    </div>
    <div class="t-1" v-if="item.G.type===0 || item.G.type===1">
      <div class="config-item">
        <span>标签:</span>
        <CheckBox v-model="item.isLabel"></CheckBox>
      </div>
      <div class="config-item">
        <span>系列:</span>
        <ColorPoint v-model="item.color"></ColorPoint>
      </div>
      <div class="config-item">

        <InputBox width="100" text="text" v-model="item.name"></InputBox>
      </div>
    </div>
    <component :is="currentView" :item="item"></component>
  </div>
</template>

<script setup>
import RadioBox from "../box/RadioBox.vue";
import {markRaw, shallowRef, toRefs, watch, watchEffect} from "vue";
import LineChartL from "../GrpahType/LineChartL.vue";
import BarChartL from "../GrpahType/BarChartL.vue";
import PieChartL from "../GrpahType/PieChartL.vue";
import ScatterChartL from "../GrpahType/ScatterChartL.vue";
import CheckBox from "../box/CheckBox.vue";
import ColorPoint from "../button/ColorPoint.vue";
import {chartType} from "../../utils/ChartUtils.js";
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../../store/OptionConfig.js";
import emitter from "../../emitter/emitter.js";
import ProgressBarArea from "../button/ProgressBarArea.vue";
import InputBox from "../box/InputBox.vue";

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const GraphTypeSelect = [
  {
    value: 0,
    label: "折线化",
  },
  {
    value: 1,
    label: '条形化'
  },
  {
    value: 2,
    label: '散点化'
  },
]

const currentView = shallowRef(null) // [!code ++]

const {echartsOptions} = storeToRefs(useOptionConfig())

const views = [
  markRaw(LineChartL), // [!code ++]
  markRaw(BarChartL),  // [!code ++]
  markRaw(ScatterChartL), // [!code ++]
  markRaw(PieChartL),  // [!code ++]
]

// 用 watchEffect 替代 onMounted + watch 组合
watchEffect(() => {
  currentView.value = views[props.item.type]
})

const {type} = toRefs(props.item)

watch(type, (newVal) =>{
  const target = echartsOptions.value.series.find(i=>i.id===props.item.id)
  target.type = chartType[newVal]
  if (newVal !==2){
    target.symbolSize = undefined
  }
  console.log('类型变更,触发合并',target)
  emitter.emit('merge-option')
})


</script>

<style scoped>
.series-config {
  background-color: var(--2-background-color);
  padding: 8px 8px;
  display: grid;
  position: relative;
  gap: 15px;
}

.series-config:after {
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

.t-1{
  display: flex;
  gap: 20px;
}

.config-item {
  display: flex;
  align-items: center;
  gap: 10px;
  span {
    font-weight: bolder;
    width: 53px;
  }
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

</style>
