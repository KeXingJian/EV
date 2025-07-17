<template>
  <div class="series-config">

    <div class="chart-select" >
      <RadioBox
          v-if="item.C.type===0 || item.C.type===1"
          v-model="item.type"
          :options="GraphTypeSelect"
          :name="'GraphTypeSelect'+item.id"
      ></RadioBox>
      <RadioBox
          v-else
          v-model="item.type"
          :options="GraphTypeSelect2"
          :name="'GraphTypeSelect'+item.id"
      ></RadioBox>
    </div>
    <div class="t-1" v-if="item.C.type===0 || item.C.type===1">
      <div class="config-item">
        <span>{{ $t('label') }}</span>
        <CheckBox v-model="item.isLabel"></CheckBox>
      </div>
      <div class="config-item" v-if="item.type===1">
        <span :style="{
          width: '77px'
        }">{{ $t('autoWidth') }}</span>
        <CheckBox v-model="item.barConfig.isAuto"></CheckBox>
      </div>
      <div class="config-item">
        <span>{{ $t('series') }}</span>
        <ColorPoint v-model="item.color"></ColorPoint>
      </div>
      <div class="config-item">

        <InputBox width="100" text="text" v-model="item.seriesName"></InputBox>
      </div>
    </div>
    <component :is="currentView" :item="item"></component>
  </div>
</template>

<script setup>
import RadioBox from "../../box/RadioBox.vue";
import {markRaw, shallowRef, toRefs, watch, watchEffect} from "vue";
import LineChartL from "../../GrpahType/LineChartL.vue";
import BarChartL from "../../GrpahType/BarChartL.vue";
import PieChartL from "../../GrpahType/PieChartL.vue";
import ScatterChartL from "../../GrpahType/ScatterChartL.vue";
import CheckBox from "../../box/CheckBox.vue";
import ColorPoint from "../../button/ColorPoint.vue";
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../../../store/OptionConfig.js";
import emitter from "../../../emitter/emitter.js";
import InputBox from "../../box/InputBox.vue";
import {getFieldDetails} from "../../../utils/BeautifyUtils.js";
import {chartType} from "../../../utils/newArch/Check4Series.js";
import FunnelChartL from "../../GrpahType/FunnelChartL.vue";



const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const GraphTypeSelect = [
  {
    value: 0,
    label: "lineChart",
  },
  {
    value: 1,
    label: 'barChart'
  },
  {
    value: 2,
    label: 'scatterChart'
  },

]
const GraphTypeSelect2 = [
  {
    value: 3,
    label: "pieChart",
  },
  {
    value: 4,
    label: 'funnelChart'
  }
]

const currentView = shallowRef(null)

const {echartsOptions} = storeToRefs(useOptionConfig())

const views = [
  markRaw(LineChartL),
  markRaw(BarChartL),
  markRaw(ScatterChartL),
  markRaw(PieChartL),
  markRaw(FunnelChartL)

]

watchEffect(() => {
  currentView.value = views[props.item.type]
})

const {type} = toRefs(props.item)

watch(type, (newVal) =>{
  const target = echartsOptions.value.series.find(i=>i.id===props.item.id)
  target.type = chartType[newVal]
  if (newVal===2){
    if (props.item.scatterConfig.type === 1 && props.item.scatterConfig.mapField !== -1) {
      const {max, min} = getFieldDetails(props.item.scatterConfig.mapField)
      target.symbolSize =  function (val) {
        return (props.item.scatterConfig.range[1]-props.item.scatterConfig.range[0]) *((val[2]-min) / (max-min)) +props.item.scatterConfig.range[0];
      }
    } else {
      target.symbolSize = props.item.scatterConfig.size;
    }
  }else {
    target.symbolSize = undefined
  }

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
