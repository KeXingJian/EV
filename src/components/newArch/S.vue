<template>
  <div class="dataset">
    <div class="left">
      <span>{{ modelItem.name }}</span>
    </div>
    <div class="var">
      <div class="button-top" @click.stop="showOption4C($event)">
        <div class="box">
          <span>C</span>
          <span class="option-value">{{ $t(currentC) }}</span>
        </div>
      </div>
    </div>
    <div class="type">
      <div class="button-top" @click.stop="showOption4Var($event,0)">
        <div class="box">
             <span>
             X
            </span>
          <span class="option-value">
                {{currentVarC }}
            </span>
        </div>
      </div>
    </div>

    <div class="type">
      <div class="button-top" @click.stop="showOption4Var($event,1)">
        <div class="box">
             <span>
             Y
            </span>
          <span class="option-value">
                {{ currentVarN }}
            </span>
        </div>
      </div>
    </div>

    <div class="type">
      <div class="button-top" @click.stop="showOption4Dataset($event)">
        <div class="box">
             <span>
             <Database></Database>
            </span>
          <span class="option-value">
                {{ currentDataset }}
            </span>
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

const {Ds,Ss,Cs,fileData,echartsOptions,lang} = storeToRefs(useOptionConfig())


const props = defineProps({
  modelItem:{
    type: Object,
    required: true,
  },
})

const modelItem = props.modelItem

//坐标系
const currentC = computed(() => {
  if (!props.modelItem.C) return lang.value ? 'undefined' : '未定义'
  return modelItem.C.name
})

const getCSelect = ()=>{
  return Cs.value.map(item=>{
    return {
      index: item,
      label: t(item.name)
    }
  })
}

const showOption4C = (event)=>{
  // 获取选项列表和选项数量
  const options = getCSelect();
  const optionCount = options.length;

  // 计算菜单高度（选项超过10个时限制最大高度400px）
  const menuHeight = optionCount > 10
      ? 400
      : optionCount * 40; // 假设每个选项高度40px

  // 获取点击坐标
  const clickY = event.clientY;

  // 计算视口剩余空间（视口高度 - 点击位置Y）
  const viewportRemaining = window.innerHeight - clickY;

  // 修正Y坐标：如果剩余空间不足以显示菜单，则向上弹出
  const adjustedY = viewportRemaining < Math.min(450, menuHeight)
      ? clickY - menuHeight
      : clickY;

  emitter.emit('show-options', {
    x: event.clientX,
    y: adjustedY,
    target: props.modelItem,
    options: options,
    handle: (index, target) => {
      if (target.C === index) return

      if (target.C.id===-1){
        if (modelItem.type===3) unloadPieArea(modelItem.id,echartsOptions)
        else if(modelItem.type===4) unLoadFunnelArea(modelItem.id,echartsOptions)
      }

      target.C = index

      if (target.C.type===0 || target.C.type===1) {
        target.type = 0
      }else if (target.C.type===2) {
        target.type = 3
      }if (target.C.type===3){
        target.type = 5
      }
      unloadSeries(props.modelItem,echartsOptions)
      checkSeries(target,echartsOptions)
    }
  })
}

//变量
const currentVarC = computed(() => {
  if (props.modelItem.category===-1 || fileData.value.columnStats.length===0) return lang.value ? 'undefined' : '未定义'
  return fileData.value.columnStats[props.modelItem.category].field;
})

const currentVarN = computed(() => {
  if (props.modelItem.number===-1 || fileData.value.columnStats.length===0) return lang.value ? 'undefined' : '未定义'
  return fileData.value.columnStats[props.modelItem.number].field;
})


const getFieldSelect = (type) => {
  if (!fileData.value.columnStats) return
  if (type === 0) {
    return fileData.value.columnStats.map(item=>{
      return {
        index: item.index,
        label: item.field
      }
    })
  }else {
    return fileData.value.columnStats.filter(item=>item.type === 'number').map(item=>{
      return {
        index: item.index,
        label: item.field
      }
    })
  }
}

const showOption4Var = (event,type) => {
  // 获取选项列表和选项数量
  const options = getFieldSelect(type);
  const optionCount = options.length;

  // 计算菜单高度（选项超过10个时限制最大高度400px）
  const menuHeight = optionCount > 10
      ? 400
      : optionCount * 40; // 假设每个选项高度40px

  // 获取点击坐标
  const clickY = event.clientY;

  // 计算视口剩余空间（视口高度 - 点击位置Y）
  const viewportRemaining = window.innerHeight - clickY;

  // 修正Y坐标：如果剩余空间不足以显示菜单，则向上弹出
  const adjustedY = viewportRemaining < Math.min(450, menuHeight)
      ? clickY - menuHeight
      : clickY;

  emitter.emit('show-options',{
    x: event.clientX,
    y: adjustedY,
    target: props.modelItem,
    options: options,
    handle: (index,target)=>{
      //console.log('轴字段切换',target)
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
//数据集
const currentDataset = computed(() => {
  if (!props.modelItem.D) return lang.value ? 'undefined' : '未定义'
  return props.modelItem.D.name
})

const datasetSelect = computed(() => {
  return Ds.value.map(
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
  // 计算菜单高度（选项超过10个时限制最大高度400px）
  const menuHeight = optionCount > 10
      ? 400
      : optionCount * 40; // 假设每个选项高度40px

  // 获取点击坐标
  const clickY = event.clientY;

  // 计算视口剩余空间（视口高度 - 点击位置Y）
  const viewportRemaining = window.innerHeight - clickY;

  // 修正Y坐标：如果剩余空间不足以显示菜单，则向上弹出
  const adjustedY = viewportRemaining < Math.min(450, menuHeight)
      ? clickY - menuHeight
      : clickY;


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
  //console.log('尝试删除系列',props.modelItem)
  if (modelItem.type===3) unloadPieArea(modelItem.id,echartsOptions)
  else if(modelItem.type===4) unLoadFunnelArea(modelItem.id,echartsOptions)
  deleteSeries(props.modelItem,Ss,echartsOptions)
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

.var,.type{
  display: flex;
  gap: 4px;
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
