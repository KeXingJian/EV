<template>
  <div class="dataset">
    <div class="left">
      <span>{{modelItem.name}}</span>
    </div>
    <div class="var">
      <div class="button-top" @click.stop="showOption4HorizontalAxis($event)">
        <div class="box">
             <span>
             横轴:
            </span>
          <span class="option-value">
                {{ currentHorizontalAxis }}
            </span>
        </div>
      </div>
    </div>
    <div class="type">
      <div class="button-top" @click.stop="showOption4VerticalAxis($event)">
        <div class="box">
             <span>
             纵轴:
            </span>
          <span class="option-value">
                {{ currentVerticalAxis }}
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
      <CloseButton @click="deleteAxis"></CloseButton>
    </div>
  </div>
</template>

<script setup>
import CloseButton from "../svg/CloseButton.vue";
import emitter from "../../emitter/emitter.js";
import {computed} from "vue";
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../../store/OptionConfig.js";
import {seriesChange, unloadSeries} from "../../utils/CheckUtils.js";

const props = defineProps({
  modelItem:{
    type: Object,
    required: true,
  },
})

const {Ds,Hs,Vs,Ss} = storeToRefs(useOptionConfig())

const horizontalAxisSelect = computed(() => {
  //同图横轴
  const targetH = Hs.value.filter(i=>i.G.id===props.modelItem.G.id)
  return targetH.map(item =>{
      return {
        index: item,
        label: item.name
      }
  })
})

const verticalAxisAxisSelect = computed(() => {
  const targetV = Vs.value.filter(i=>i.G.id===props.modelItem.G.id)
  return targetV.map(item =>{
    return {
      index: item,
      label: item.name
    }
  })
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

const currentHorizontalAxis = computed(() => {
  if (!props.modelItem.H) return '未定义'
  return props.modelItem.H.name
})

const currentVerticalAxis = computed(() => {
  if (!props.modelItem.V) return '未定义'
  return props.modelItem.V.name
})

const currentDataset = computed(() => {
  if (!props.modelItem.D) return '未定义'
  return props.modelItem.D.name
})

const showOption4HorizontalAxis = (event)=>{
  emitter.emit('show-options',{
    x: event.clientX,
    y: event.clientY,
    target: props.modelItem,
    options:horizontalAxisSelect,
    handle: (index,target)=>{
      console.log('变更轴索引')
      console.log('单调系列检查')
      target.H = index
      seriesChange(target)
    }
  })
}

const showOption4VerticalAxis = (event)=>{
  emitter.emit('show-options',{
    x: event.clientX,
    y: event.clientY,
    target: props.modelItem,
    options:verticalAxisAxisSelect,
    handle: (index,target)=>{
      console.log('变更轴索引')
      console.log('单调系列检查')
      target.V = index
      seriesChange(target)
    }
  })
}

const showOption4Dataset = (event)=>{
  emitter.emit('show-options',{
    x: event.clientX,
    y: event.clientY,
    target: props.modelItem,
    options:datasetSelect,
    handle: (index,target)=>{
      console.log('变更数据集索引')
      console.log('单调系列检查')
      target.D = index
      seriesChange(target)
    }
  })
}

const deleteAxis = ()=>{
  console.log('尝试删除系列',props.modelItem)
  if(props.modelItem){
    console.log('发现系列已加载')
    unloadSeries(props.modelItem)
  }

  console.log('从映射配置中移除')
  Ss.value = Ss.value.filter(item=>
      item.id !== props.modelItem.id
  )
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
