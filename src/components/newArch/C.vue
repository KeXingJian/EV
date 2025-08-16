<template>
  <section class="X">
    <div class="left">
      <span>{{ modelItem.name }}</span>
    </div>

    <div class="type">
      <div class="button-top" @click.stop="">
        <div class="box">
            <span class="option-value">
              {{ $t(getCType()) }}
            </span>
        </div>
      </div>
    </div>
    <!-- 轴转化   -->
    <div class="axis"
         v-if="modelItem.type<2 && !modelItem.axisType"
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
          v-if="modelItem.type<2 && modelItem.axisType"
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
    <!-- 轴堆叠   -->
    <div
        class="stack"
        v-if="modelItem.type<2"
    >
      <span>{{ $t('stack') }}</span>
      <CheckBox v-model="modelItem.isStack"></CheckBox>
    </div>


    <div
        class="type"
        v-if="modelItem.type === 3"
    >
      <div class="button-top">
        <div class="box">
             <span>
             类目:
            </span>
          <span class="option-value-f">
                {{currentVarC }}
            </span>
        </div>
      </div>
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
import {computed, toRefs, watch} from "vue";

const props = defineProps({
  modelItem: {
    type: Object,
    required: true,
  },
})

const modelItem = props.modelItem

const {Ss,echartsOptions,fileData,Cs} = useOptionConfig()

const changeType = ()=>{
  modelItem.axisType = !modelItem.axisType
  changeAxisType(modelItem,echartsOptions)
  Ss.filter(i=> i.isLoad && i.C.id === modelItem.id)
      .forEach(i => checkSeries(i,echartsOptions))
}

const getCType = () => {
  if (props.modelItem.type === 0) return 'x0y'
  else if (props.modelItem.type === 1) return 'polar'
  else if (props.modelItem.type === 3) return '雷达系'
}

const currentVarC = computed(() => {
  if (!modelItem.field || fileData.columnStats.length===0) return '未定义'
  return fileData.columnStats[modelItem.field].field;
})

const deleteC = () => {
  deleteAxis(modelItem,Cs,Ss,echartsOptions)
}

const {isStack} = toRefs(modelItem)

watch(isStack,()=>{
  Ss.filter(i=> i.isLoad && i.C.id === modelItem.id)
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

.box{
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  .option-value-f{
    color: var(--active-color);
  }
}
</style>
