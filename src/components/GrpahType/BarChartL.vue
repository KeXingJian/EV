<template>
  <div class="bar-chart" >

  </div>
</template>

<script setup>
import { watch} from "vue";
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../../store/OptionConfig.js";
import emitter from "../../emitter/emitter.js";

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
  target.itemStyle.color = newVal.color

  target.label.show = newVal.isLabel

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
