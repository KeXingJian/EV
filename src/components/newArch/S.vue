<template>
  <div class="dataset">
    <div class="left">
      <span>{{ modelItem.name }}</span>
    </div>

    <div v-if="modelItem.type!==5" class="type">
      <div class="button-top" @click.stop="showOption4C($event)">
        <div class="box">
          <span>C</span>
          <span class="option-value">{{ currentC }}</span>
        </div>
      </div>
    </div>
    <div v-if="modelItem.type!==5"  class="type">
      <div class="button-top" @click.stop="showOption4Var($event,0)">
        <div class="box">
             <span>X</span>
          <span class="option-value">{{currentVarC }}</span>
        </div>
      </div>
    </div>
    <div v-if="modelItem.type!==5"  class="type">
      <div class="button-top" @click.stop="showOption4Var($event,1)">
        <div class="box">
             <span>Y</span>
          <span class="option-value">{{ currentVarN }}</span>
        </div>
      </div>
    </div>
    <div v-if="modelItem.type!==5"  class="type">
      <div class="button-top" @click.stop="showOption4Dataset($event)">
        <div class="box">
             <span><Database></Database></span>
          <span class="option-value">{{ currentDataset }}</span>
        </div>
      </div>
    </div>

    <div class="right">
      <CloseButton @click="deleteS"></CloseButton>
    </div>
  </div>
</template>

<script setup>
import CloseButton from "../svg/CloseButton.vue";
import {computed} from "vue";
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../../store/OptionConfig.js";
import emitter from "../../emitter/emitter.js";
import {
  checkSeries,
  deleteSeries,
  unLoadFunnelArea,
  unloadPieArea,
  unloadSeries
} from "../../utils/newArch/Check4Series.js";
import Database from "../svg/Database.vue";
import {useI18n} from "vue-i18n";

const { t } = useI18n()
const {fileData:{columnStats},echartsOptions,Ds,Cs,Ss} = useOptionConfig()

const {lang} = storeToRefs(useOptionConfig())

const props = defineProps({
  modelItem:{
    type: Object,
    required: true,
  },
})

const modelItem = props.modelItem

//坐标系
const currentC = computed(() => {
  if (modelItem.type === 5) return '未定义'
  if (!modelItem.C) return lang.value ? 'undefined' : '未定义'
  return modelItem.C.name
})

const getCSelect = ()=>{
  return Cs.map(item=>{
    return {
      index: item,
      label: t(item.name)
    }
  })
}

const showOption4C = (event)=>{
  // 获取选项列表和选项数量
  const options = getCSelect();

  const adjustedY = getPosition(options.length,event)

  emitter.emit('show-options', {
    x: event.clientX,
    y: adjustedY,
    target: props.modelItem,
    options: options,
    handle: (index, target) => {
      if (target.C === index) return

      const preID = target.C?.id

      target.C = index

      if (preID===-1){
        if (modelItem.type===3) unloadPieArea(modelItem.id,echartsOptions)
        else if(modelItem.type===4) unLoadFunnelArea(modelItem.id,echartsOptions)
      }

      if (target.C.type===0 || target.C.type===1) {
        target.type = 0
      }else if (target.C.type===2) {
        target.type = 3
      }
      unloadSeries(modelItem,echartsOptions)
      checkSeries(target,echartsOptions)
    }
  })
}

//变量
const currentVarC = computed(() => {

  if (modelItem.type === 5) return '未定义'

  if (modelItem.category===-1) return lang.value ? 'undefined' : '未定义'

  return columnStats[modelItem.category].field;
})

const currentVarN = computed(() => {

  if (modelItem.type === 5) return '未定义'

  if (modelItem.number===-1) return lang.value ? 'undefined' : '未定义'

  return columnStats[modelItem.number].field
})

const showOption4Var = (event,type) => {


  // 获取选项列表和选项数量
  const options = getFieldSelect(type);

  const adjustedY = getPosition(options.length,event)

  emitter.emit('show-options',{
    x: event.clientX,
    y: adjustedY,
    target: modelItem,
    options: options,
    handle: (index,target)=>{

      if (type===0){
        if (target.category !== -1 && target.category===index) return
        target.category = index
      }else {
        if (target.number !== -1 && target.number===index) return
        target.number = index
      }
      checkSeries(target,echartsOptions)
    }
  })
}


const getFieldSelect = (type) => {
  if (!columnStats) return
  if (type === 0) {
    return columnStats.filter((_,index)=>index!==0).map(item=>{
      return {
        index: item.index,
        label: item.field
      }
    })
  }else {
    return columnStats.filter((item,index)=>item.type === 'number' && index!==0).map(item=>{
      return {
        index: item.index,
        label: item.field
      }
    })
  }
}

//数据集
const currentDataset = computed(() => {
  if (modelItem.type === -1) return '未定义'
  if (!modelItem.D) return lang.value ? 'undefined' : '未定义'
  return modelItem.D.name
})

const datasetSelect = computed(() => {
  return Ds.map(
      item=>{
        return {
          index: item,
          label: item.name
        }
      }
  )
})

const showOption4Dataset = (event)=>{
  const optionCount = datasetSelect.value.length;
  const adjustedY = getPosition(optionCount,event)
  emitter.emit('show-options',{
    x: event.clientX,
    y: adjustedY,
    target: props.modelItem,
    options:datasetSelect.value,
    handle: (index,target)=>{
      if (target.D === index) return
      target.D = index
      checkSeries(target,echartsOptions)
    }
  })
}

const deleteS = ()=>{
  if (modelItem.type===3) unloadPieArea(modelItem.id,echartsOptions)
  else if(modelItem.type===4) unLoadFunnelArea(modelItem.id,echartsOptions)
  deleteSeries(modelItem,Ss,echartsOptions)
}

const getPosition = (optionCount,event)=>{
  const menuHeight = optionCount > 10 ? 400 : optionCount * 40
  const clickY = event.clientY;
  const viewportRemaining = window.innerHeight - clickY;
  return viewportRemaining < Math.min(450, menuHeight)
      ? clickY - menuHeight
      : clickY
}
</script>

<style scoped>
.dataset {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-radius: 8px;
  background-color: var(--2-background-color);
  >div{
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
  }
  span{
    font-weight: bolder;
  }
}


.box{
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  .option-value{
    color: var(--active-color);
  }
}

</style>
