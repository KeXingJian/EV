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
import {useOptionConfig} from "../../store/OptionConfig.js";
import emitter from "../../emitter/emitter.js";

import {debounce} from "../../utils/DebounceUtils.js";
import {updateLine} from "../../utils/newArch/Check4Series.js";

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

const {echartsOptions} = useOptionConfig()

const emitLoadChart = debounce(() => {
  emitter.emit('merge-option')
}, 200)


watch(props.item, (newVal) => {
  updateLine(newVal,echartsOptions)
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
