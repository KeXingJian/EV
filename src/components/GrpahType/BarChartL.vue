<template>
  <div class="bar-chart" >
    <div class="config-item">
      <span>宽度:</span>
      <ProgressBar v-model="item.barConfig.barWidth" :width="200"></ProgressBar>
    </div>

    <div class="config-item">
      <span>圆度:</span>
      <ProgressBar v-model="item.barConfig.borderRadius" :width="200"></ProgressBar>
    </div>

  </div>
</template>

<script setup>
import { watch} from "vue";
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../../store/OptionConfig.js";
import emitter from "../../emitter/emitter.js";
import {x0y} from "../../utils/BeautifyUtils.js";
import ProgressBar from "../button/ProgressBar.vue";

const props=defineProps({
  item:{
    type: Object,
    required: true
  }
})

const {echartsOptions} = storeToRefs(useOptionConfig())
watch(props.item ,(newVal)=>{
  //专有无需重构
  console.log(newVal)
  const target = echartsOptions.value.series.find(i=>i.id===newVal.id)
  target.barWidth = newVal.barConfig.barWidth
  target.itemStyle.borderRadius = newVal.barConfig.borderRadius
  x0y(newVal,echartsOptions,target)
  console.log('系列更新触发合并')
  emitter.emit('merge-option')
})

</script>


<style scoped>
.bar-chart{
  display: grid;
  gap: 20px;
}
.config-item{
  display: flex;
  gap: 20px;
  align-items: center;
}

span{
  font-weight: bolder;
}

.inactivation{
  cursor: not-allowed;
  span{
    color: var(--inactivation-color);
  }
}


</style>
