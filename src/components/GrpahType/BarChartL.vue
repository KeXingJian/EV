<template>
  <div class="bar-chart" >
    <div class="config-item">
      <span>{{ $t('width') }}</span>
      <ProgressBar v-model="item.barConfig.barWidth" :width="200"></ProgressBar>
    </div>

    <div class="config-item">
      <span>{{ $t('radius') }}</span>
      <ProgressBar v-model="item.barConfig.borderRadius" :width="200"></ProgressBar>
    </div>

  </div>
</template>

<script setup>
import { watch} from "vue";
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../../store/OptionConfig.js";
import emitter from "../../emitter/emitter.js";
import ProgressBar from "../button/ProgressBar.vue";
import {debounce} from "../../utils/DebounceUtils.js";
import {updateBar} from "../../utils/newArch/Check4Series.js";

const props=defineProps({
  item:{
    type: Object,
    required: true
  }
})

const {echartsOptions} = useOptionConfig()

const emitLoadChart = debounce(() => {
  emitter.emit('merge-option')
}, 200);

watch(props.item ,(newVal)=>{
  updateBar(newVal,echartsOptions)
  emitLoadChart()
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
