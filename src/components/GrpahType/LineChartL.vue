<template>
  <div class="chart-config">
    <div class="t-1">
      <div class="config-item">
        <span>{{ $t('toArea') }}</span>
        <CheckBox v-model="item.lineConfig.isArea"></CheckBox>
      </div>
      <div class="config-item">

        <ColorPoint v-model="item.areaColor"></ColorPoint>
      </div>
    </div>
    <RadioBox
        v-model="item.lineConfig.lineType"
        :options="lineTypeSelect"
        :name="'lineTypeSelect'+item.id"
    ></RadioBox>
    <div class="config-item" :class="{inactivation:item.lineConfig.lineType!==2}">
      <RadioBox
          v-model="item.lineConfig.startPoint"
          :options="startPointType"
          :inactivation="item.lineConfig.lineType!==2"
          :name="'startPointType'+item.id"
      ></RadioBox>
    </div>
  </div>
</template>

<script setup>
import RadioBox from "../box/RadioBox.vue";
import { watch} from "vue";
import CheckBox from "../box/CheckBox.vue";
import ColorPoint from "../button/ColorPoint.vue";
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../../store/OptionConfig.js";
import emitter from "../../emitter/emitter.js";
import {x0y} from "../../utils/BeautifyUtils.js";
import {startPoints} from "../../utils/newArch/Check4Series.js";
import {debounce} from "../../utils/DebounceUtils.js";

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const lineTypeSelect = [
  {
    value: 0,
    label: 'straight'
  },
  {
    value: 1,
    label: 'bending'
  },
  {
    value: 2,
    label: 'folded'
  }
]

const startPointType = [
  {
    value: 0,
    label: 'start'
  },
  {
    value: 1,
    label: 'Middle'
  },
  {
    value: 2,
    label: 'end'
  }
]

const {echartsOptions} = storeToRefs(useOptionConfig())

const emitLoadChart = debounce(() => {
  emitter.emit('merge-option')
}, 200)


watch(props.item, (newVal) => {

  const target = echartsOptions.value.series.find(i=>i.id===newVal.id)

  x0y(newVal,echartsOptions,target)

  target.smooth = newVal.lineConfig.lineType === 1 ? 0.5 : 0

  if (newVal.lineConfig.lineType === 2) target.step = startPoints[newVal.lineConfig.startPoint]
  else target.step=''

  if (newVal.lineConfig.isArea) target.areaStyle = {color: newVal.areaColor}
  else target.areaStyle = null



  //console.log('系列更新触发合并',echartsOptions.value)
  emitLoadChart()
})
</script>


<style scoped>
.chart-config{
  display: flex;
  flex-direction: column;
  gap: 10px;
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

.t-1{
  display: flex;
  gap: 20px;
}


.inactivation {
  cursor: not-allowed !important;

  span {
    color: var(--inactivation-color);
  }
}

</style>
