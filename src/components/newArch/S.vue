<template>
  <div class="dataset">
    <div class="left">
      <span>{{ modelItem.name }}</span>
    </div>
    <div class="var">
      <div class="button-top" @click.stop="showOption4C($event)">
        <div class="box">
             <span>
             坐标系:
            </span>
          <span class="option-value">
              {{ currentC }}
          </span>
        </div>
      </div>
    </div>
    <div class="type">
      <div class="button-top" @click.stop="showOption4Var($event,0)">
        <div class="box">
             <span>
             类目:
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
             数值:
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
             数据集:
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
import {checkSeries, deleteSeries, unloadSeries} from "../../utils/newArch/Check4Series.js";

const {Ds,Ss,Cs,fileData,echartsOptions} = storeToRefs(useOptionConfig())

const props = defineProps({
  modelItem:{
    type: Object,
    required: true,
  },
})

//坐标系
const currentC = computed(() => {
  if (!props.modelItem.C) return '未定义'
  return props.modelItem.C.name
})

const getCSelect = ()=>{

  return Cs.value.map(item=>{
    return {
      index: item,
      label: item.name
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
      target.C = index
      if (target.C.type===0 || target.C.type===1) {
        target.type = 0
      }else if (target.C.type===2) {
        target.type = 3
      }
      unloadSeries(props.modelItem,echartsOptions)
      checkSeries(target,echartsOptions)
      //TODO
    }
  })
}

//变量
const currentVarC = computed(() => {
  if (props.modelItem.category===-1 || fileData.value.columnStats.length===0) return '未定义'
  return fileData.value.columnStats[props.modelItem.category].field;
})

const currentVarN = computed(() => {
  if (props.modelItem.number===-1 || fileData.value.columnStats.length===0) return '未定义'
  return fileData.value.columnStats[props.modelItem.number].field;
})


const getFieldSelect = (type) => {
  if (!fileData.value.columnStats) return
  if (type === 0) {
    return fileData.value.columnStats.filter(item=>item.isUnique).map(item=>{
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
      console.log('轴字段切换',target)
      if (type===0){
        target.category = index
      }else {
        target.number = index
      }
      checkSeries(target,echartsOptions)
    }
  })
}
//数据集
const currentDataset = computed(() => {
  if (!props.modelItem.D) return '未定义'
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
      target.D = index
      checkSeries(target,echartsOptions)
    }
  })
}

const deleteS = ()=>{
  console.log('尝试删除系列',props.modelItem)
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
