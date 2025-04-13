<template>
  <div class="Y">
    <div class="left">
      <span>{{ modelItem.name }}</span>
    </div>
    <div class="var">
      <div class="button-top" @click.stop="showOption4Var">
        <div class="box">
             <span>
             变量:
            </span>
          <span class="option-value">
                {{ currentField }}
            </span>
        </div>
      </div>
    </div>
    <div class="type">
      <div class="button-top" @click.stop="showOption4Type">
        <div class="box">
             <span>
             类型:
            </span>
          <span class="option-value">
                {{ currentFieldType }}
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
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../../store/OptionConfig.js";
import {computed} from "vue";
import emitter from "../../emitter/emitter.js";
import {allSeriesCheck, checkAxis, checkSeriesForVDelete, seriesChange} from "../../utils/CheckUtils.js";

const props = defineProps({
  modelItem: {
    type: Object,
    required: true,
  },
})

const {fileData,Vs,Ss} = storeToRefs(useOptionConfig())

const currentField = computed(() => {
  if (props.modelItem.field===-1) return '未定义'
  return fileData.value.columnStats.find(item=>item.index===props.modelItem.field).field;
})

const currentFieldType = computed(() => {
  if (props.modelItem.type === 0) return '类目'
  else return '数值'
})

const fieldSelect = computed(() => {
  if (!fileData.value.columnStats) return
  if (props.modelItem.type === 0) {
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
});

const showOption4Type = (event) => {
  emitter.emit('show-options',{
    x: event.clientX,
    y: event.clientY,
    target: props.modelItem,
    options: [
      {
        index: 0,
        label: '类目'
      },
      {
        index: 1,
        label: '数值'
      }
    ],
    handle: (index,target)=>{
      console.log('轴类型切换',target)
      target.type = index
      checkAxis(target,1)
      Ss.value.forEach(item=>{
        if (item.isLoad && item.V.id === target.id){
          seriesChange(item)
        }
      })
    }
  })
}

const showOption4Var = (event) => {
  emitter.emit('show-options',{
    x: event.clientX,
    y: event.clientY,
    target: props.modelItem,
    options: fieldSelect.value,
    handle: (index,target)=>{
      console.log('轴字段切换',target)
      target.field = index
      allSeriesCheck()
    }
  })
}

const deleteAxis = ()=>{
  console.log('尝试删除轴',props.modelItem)
  checkSeriesForVDelete(props.modelItem)
  console.log('从映射配置中移除')
  Vs.value = Vs.value.filter(item=>
      item.id !== props.modelItem.id
  )
}

</script>

<style scoped>
.Y {
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

.var, .type {
  display: flex;
  gap: 4px;
}

.box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  .option-value {
    color: var(--active-color);
  }
}

</style>
