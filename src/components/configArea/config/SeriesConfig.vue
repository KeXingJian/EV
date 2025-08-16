<template>
  <div class="series-config">
    <div class="chart-select" v-if="item.type !== 5">
      <RadioBox
          v-if="item.C?.type===0 || item.C?.type===1"
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
    <div class="t-1" v-if="item.C?.type===0 || item.C?.type===1">
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
        <ColorPoint v-model="item.color"></ColorPoint>
      </div>
      <div class="config-item">
        <InputBox :width="100" text="text" v-model="item.seriesName"></InputBox>
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
import {useOptionConfig} from "../../../store/OptionConfig.js";
import emitter from "../../../emitter/emitter.js";
import InputBox from "../../box/InputBox.vue";
import {
  funnelInit, getFieldDetails,
  loadFunnelArea,
  loadPieArea, pieInit,
  unLoadFunnelArea,
  unloadPieArea
} from "../../../utils/newArch/Check4Series.js";
import FunnelChartL from "../../GrpahType/FunnelChartL.vue";
import {chartType} from "../../../utils/newArch/ConstantPool.js";
import RelationChartL from "../../GrpahType/RelationChartL.vue";


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

const {echartsOptions} = useOptionConfig()

const views = [
  markRaw(LineChartL),
  markRaw(BarChartL),
  markRaw(ScatterChartL),
  markRaw(PieChartL),
  markRaw(FunnelChartL),
  markRaw(RelationChartL)
]

watchEffect(() => {
  currentView.value = views[props.item.type]
})

const {type} = toRefs(props.item)

const item = props.item
watch(type, (newVal) =>{

  const target = echartsOptions.series.find(i=>i.id===item.id)
  target.type = chartType[newVal]
  if (newVal===2){
    if (item.scatterConfig.type === 1 && item.scatterConfig.mapField !== -1) {
      const {max, min} = getFieldDetails(item.scatterConfig.mapField)
      target.symbolSize =  function (val) {
        return (
              item.scatterConfig.range[1]-item.scatterConfig.range[0]
            )
            *((val[2]-min)
                / (max-min)) +props.item.scatterConfig.range[0]
      }
    } else {
      target.symbolSize = item.scatterConfig.size;
    }
  }else {
    target.symbolSize = undefined
  }



  const id = item.id
  if (newVal===3){
    pieInit(item,echartsOptions)
    unLoadFunnelArea(id,echartsOptions)
    loadPieArea(
        item.pieConfig,
        id,
        echartsOptions.series.find(i=>i.id===id),
        echartsOptions
    )
  }else if (newVal===4) {
    funnelInit(item,echartsOptions)
    unloadPieArea(id,echartsOptions)
    loadFunnelArea(
        item.funnelConfig,
        id,
        echartsOptions.series.find(i=>i.id===id),
        echartsOptions
    )

  }

  emitter.emit('load-chart')
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

</style>
