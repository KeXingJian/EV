<template>
  <section class="X">
    <div class="left">
      <span>{{ modelItem.name }}</span>
    </div>

    <div class="type">
      <div class="button-top" @click.stop="">
        <div class="box">
            <span class="option-value">
              {{ getCType() }}
            </span>
        </div>
      </div>
    </div>

    <div class="axis"
         v-if="modelItem.type!==2 && !modelItem.axisType"
         @click="changeType"
    >
      <div class="L">
        <span v-if="modelItem.type===0">X</span>
        <span v-if="modelItem.type===1">R</span>
      </div>
      <Swap></Swap>
      <div class="R">
        <span v-if="modelItem.type===0">Y</span>
        <span v-if="modelItem.type===1">A</span>
      </div>
    </div>
    <div class="axis"
          @click="changeType"
          v-else
    >
      <div class="L">
        <span v-if="modelItem.type===0">Y</span>
        <span v-if="modelItem.type===1">A</span>
      </div>
      <Swap></Swap>
      <div class="R">
        <span v-if="modelItem.type===0">X</span>
        <span v-if="modelItem.type===1">R</span>
      </div>
    </div>

    <div
        class="stack"
    >
      <span>堆叠化</span>
      <CheckBox v-model="modelItem.isStack"></CheckBox>
    </div>
    <div class="right">
      <CloseButton @click="deleteC"></CloseButton>
    </div>
  </section>
</template>

<script setup>
import CloseButton from "../svg/CloseButton.vue";
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../../store/OptionConfig.js";
import Swap from "../svg/Swap.vue";
import {checkSeries} from "../../utils/newArch/Check4Series.js";
import {changeAxisType, deleteAxis} from "../../utils/newArch/AxisUtis.js";
import CheckBox from "../box/CheckBox.vue";
import { toRefs, watch} from "vue";

const props = defineProps({
  modelItem: {
    type: Object,
    required: true,
  },
})

const {Cs,Ss,echartsOptions} = storeToRefs(useOptionConfig())

const changeType = ()=>{
  props.modelItem.axisType = !props.modelItem.axisType
  changeAxisType(props.modelItem,echartsOptions)
  Ss.value.filter(i=> i.isLoad && i.C.id === props.modelItem.id)
      .forEach(i => checkSeries(i,echartsOptions))
}

const getCType = () => {
  if (props.modelItem.type === 0) return 'x0y系'
  else if (props.modelItem.type === 1) return '极坐标系'
  else return '饼图'
}

const deleteC = () => {
  deleteAxis(props.modelItem,Cs,Ss,echartsOptions)
}

const {isStack} = toRefs(props.modelItem)

watch(isStack,(newVal)=>{
  console.log()
  Ss.value.filter(i=> i.isLoad && i.C.id === props.modelItem.id)
      .forEach(i => checkSeries(i,echartsOptions))
})
</script>


<style scoped>

.X {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-radius: 8px;
  background-color: var(--2-background-color);

  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap;

  }

  span {
    font-weight: bolder;
  }
}

.type {
  display: flex;

  gap: 4px;
}

.box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;


}


.axis,.stack {
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 4px;
  border-radius: 10px;
}

.axis:hover {
  background-color: var(--3-background-color);
}
</style>
