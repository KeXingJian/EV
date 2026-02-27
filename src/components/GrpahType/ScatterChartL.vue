<template>
  <div class="bar-chart">
    <RadioBox
        v-model="item.scatterConfig.type"
        :options="scatterTypeSelect"
        name="scatterTypeSelect"></RadioBox>
  </div>
  <div class="config-item"
  >
    <div class="button-top" @click.stop="showOption4MapField">
      <div class="box">
             <span>
             {{ $t('bubbleMapping') }}
            </span>
        <span class="option-value">
                {{ currentField }}
            </span>
      </div>
    </div>
  </div>

  <div class="config-item" v-if="item.scatterConfig.type === 1">
    <span>{{ $t('range') }}</span>
    <ProgressBarRange v-model="item.scatterConfig.range"></ProgressBarRange>
  </div>
  <div class="config-item" v-else>
    <span>{{ $t('size') }}</span>
    <ProgressBar v-model="item.scatterConfig.size" :width="200"></ProgressBar>
  </div>

</template>

<script setup>

import RadioBox from "../box/RadioBox.vue";
import {computed, watch} from "vue";
import emitter from "../../emitter/emitter.js";
import {useOptionConfig} from "../../store/OptionConfig.js";
import {updateScatter} from "../../utils/newArch/Check4Series.js";
import ProgressBarRange from "../button/ProgressBarRange.vue";
import ProgressBar from "../button/ProgressBar.vue";
import {useI18n} from 'vue-i18n'
import {debounce} from "../../utils/DebounceUtils.js";

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})
const {item} = props


const {echartsOptions,fileData} = useOptionConfig()

const scatterTypeSelect = [
  {
    value: 0,
    label: 'splashes'
  },
  {
    value: 1,
    label: 'bubble'
  }
]

const {t} = useI18n()


const fieldSelect = computed(() => {
  return fileData.columnStats.filter(item=>item.type === 'number').map(item=>{
    return {
      index: item.index,
      label: item.field
    }
  })
})

const currentField = computed(() => {
  if (props.item.scatterConfig.mapField===-1) return t('undefined')
  return fileData.columnStats.find(i=>i.index===item.scatterConfig.mapField).field;
})

const showOption4MapField = (event) => {
  emitter.emit('show-options',{
    x: event.clientX,
    y: event.clientY,
    target: item,
    options: fieldSelect.value,
    handle: (index,target)=>{
      target.scatterConfig.mapField = index
    }
  })
}


const emitLoadChart = debounce(() => {
  emitter.emit('merge-option')
}, 200)

watch(item, (newVal) => {
  updateScatter(newVal, echartsOptions)
  emitLoadChart()
})

</script>

<style scoped>
.bar-chart {
  display: grid;
}

.config-item {
  display: flex;
  gap: 10px;
  align-items: center;
}

span {
  font-weight: bolder;
}


.box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  cursor: pointer;

  .option-value {
    cursor: pointer;
    color: var(--active-color);
  }
}

</style>
