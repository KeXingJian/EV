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
  <div class="config-item" v-if="false">
    <span>函数表达式:</span>
    <InputBox text="y = f(x)" :width="100"></InputBox>
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
import InputBox from "../box/InputBox.vue";
import emitter from "../../emitter/emitter.js";
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../../store/OptionConfig.js";
import {getFieldDetails, x0y} from "../../utils/BeautifyUtils.js";
import {getDataForSimpleSeries} from "../../utils/newArch/Check4Series.js";
import ProgressBarRange from "../button/ProgressBarRange.vue";
import ProgressBar from "../button/ProgressBar.vue";
import { useI18n } from 'vue-i18n'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const {echartsOptions,fileData} = storeToRefs(useOptionConfig())

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

const { t } = useI18n()

const fieldSelect = computed(() => {
    return fileData.value.columnStats.filter(item=>item.type === 'number').map(item=>{
      return {
        index: item.index,
        label: item.field
      }
    })
})

const currentField = computed(() => {
  if (props.item.scatterConfig.mapField===-1) return t('undefined')
  return fileData.value.columnStats.find(item=>item.index===props.item.scatterConfig.mapField).field;
})

const showOption4MapField = (event) => {
  emitter.emit('show-options',{
    x: event.clientX,
    y: event.clientY,
    target: props.item,
    options: fieldSelect.value,
    handle: (index,target)=>{
      //console.log('轴字段切换',target)
      target.scatterConfig.mapField = index
    }
  })
}

watch(props.item, (newVal) => {
  //专有无需重构
  //console.log(newVal)
  const target = echartsOptions.value.series.find(i => i.id === newVal.id)

  x0y(newVal, echartsOptions, target)

  getDataForSimpleSeries(target,newVal)

  if (newVal.scatterConfig.type === 1 && newVal.scatterConfig.mapField !==-1){
    const {max,min} = getFieldDetails(newVal.scatterConfig.mapField)
    target.symbolSize =  function (val) {
      return (newVal.scatterConfig.range[1]-newVal.scatterConfig.range[0]) *((val[2]-min) / (max-min)) +newVal.scatterConfig.range[0];
    }
  }else {
    target.symbolSize = newVal.scatterConfig.size;

  }

  //console.log('系列更新触发合并', echartsOptions.value)
  emitter.emit('merge-option')
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
