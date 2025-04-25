<template>
  <div class="dataset-edit">
    <div>
      <div class="option-item">
        <Filter></Filter>
        <div class="option-value filter">
          <button class="value" v-for="(filter, index) in dataset.filterConditions" :key="index">
            <span>{{ filter.rawExpression }}</span>
            <CloseButton @click="deleteFilter(dataset,index)"></CloseButton>
          </button>
          <AddButton v-if="!isAddFilter" @click="isAddFilter=true"></AddButton>
          <form v-if="isAddFilter" @submit="applyFilter" class="form" :style="{
              width: `150px`
          }">
            <input
                class="input"
                placeholder="Expression"
                required=""
                type="text"
                v-model="currentExpressionFilter"
            >
            <span class="input-border"></span>
          </form>
          <CheckButton v-if="isAddFilter" @click="applyFilter"></CheckButton>
          <CloseButton v-if="isAddFilter" @click="isAddFilter=false"></CloseButton>
        </div>
      </div>

      <div class="option-item">
        <Group></Group>
        <div class="option-value filter">
          <button class="value" v-for="(group, index) in dataset.groupCondition" :key="index">
            <span>{{ group.condition.rawExpression }}</span>
            <CloseButton @click="deleteGroup(group.child,index)"></CloseButton>
          </button>
          <AddButton v-if="!isAddGroup" @click="isAddGroup=true"></AddButton>
          <form v-if="isAddGroup" @submit="createGroup" class="form" :style="{
              width: `150px`
          }">
            <input
                class="input"
                placeholder="Expression"
                required=""
                type="text"
                v-model="currentExpressionGroup"
            >
            <span class="input-border"></span>
          </form>
          <CheckButton v-if="isAddGroup" @click="createGroup"></CheckButton>
          <CloseButton v-if="isAddGroup" @click="isAddGroup=false"></CloseButton>
        </div>
      </div>

      <Bar v-if="dataset.name === 'ROOT'"></Bar>
      <FieldManage v-if="dataset.name === 'ROOT'"></FieldManage>
    </div>
  </div>


</template>

<script setup>
import CloseButton from "../svg/CloseButton.vue";
import AddButton from "../svg/AddButton.vue";
import FieldManage from "../region/FieldManage.vue";
import Filter from "../svg/Filter.vue";
import Group from "../svg/Group.vue";
import Bar from "./Bar.vue";
import {useOptionConfig} from "../../store/OptionConfig.js";
import {ref} from "vue";
import CheckButton from "../svg/CheckButton.vue";
import {allSeriesCheckByD, seriesChange, unloadAxis, unloadSeries} from "../../utils/CheckUtils.js";
import {storeToRefs} from "pinia";


const props = defineProps({
  dataset: {
    type: Object,
    required: true,
  }
})

const isAddFilter = ref(false)
const isAddGroup = ref(false)

const currentExpressionFilter = ref('')
const currentExpressionGroup = ref('')
const store = useOptionConfig()

const {Ds, Ss, Hs, Vs, echartsOptions,Gs} = storeToRefs(useOptionConfig())

const applyFilter = () => {
  const isOK = store.applyFilter(props.dataset, currentExpressionFilter.value)
  if (isOK) {
    currentExpressionFilter.value = ''
    isAddFilter.value = false
    allSeriesCheckByD()
  }

}

const createGroup = () => {
  console.log(currentExpressionGroup.value)
  const isOK = store.createGroup(props.dataset, currentExpressionGroup.value)
  if (isOK) {
    currentExpressionGroup.value = ''
    isAddGroup.value = false
    allSeriesCheckByD()
  }


}

const deleteFilter = (dataset, i) => {
  dataset.filterConditions = dataset.filterConditions.filter((item, index) => index !== i)
  store.refreshDataset(dataset.id)
  allSeriesCheckByD()
}

const deleteGroup = (child, index) => {
  const deleteIs = [] //忽略

  toDeleteNode(child, deleteIs, index)
  console.log('节点删除完毕', Ds.value)
  //忽略以下代码
  console.log('系列为零,清除所有轴')
  echartsOptions.value.xAxis.length = 0
  echartsOptions.value.yAxis.length = 0
  echartsOptions.value.radiusAxis.length = 0
  echartsOptions.value.angleAxis.length = 0
  echartsOptions.value.polar.length = 0
  echartsOptions.value.series.length = 0

  Gs.value.forEach(i=>{
    i.isStackAxisLoad = false
  })

  Hs.value.forEach(item => {
    item.isLoad = false
  })
  Vs.value.forEach(item => {
    item.isLoad = false
  })
  console.log('重载相关系列')
  Ss.value.forEach((i) => {
    i.isLoad = false

    if (deleteIs.includes(i.D.id)) i.D = null

    seriesChange(i)
  })

}

const toDeleteNode = (child, ids, i) => {

  if (!child) return

  console.log(child)
  child.groupCondition.forEach((item, index) => {

    toDeleteNode(item.child, ids, index) //递归
  })
  ids.push(child.id)
  deleteGroupCondition(child, i)
  Ds.value = Ds.value.filter(i => i.id !== child.id)
}

const deleteGroupCondition = (child, i) => {
  child.parent.groupCondition = child.parent.groupCondition.filter((item, index) => index !== i)
}

</script>

<style scoped>
.dataset-edit {
  padding: 0;
  background-color: var(--2-background-color);
  display: grid;
  grid-template-rows: 0fr;
  overflow: hidden;
  transition: 300ms ease-in-out;

  > div {
    overflow: hidden;
    display: grid;
    gap: 2px;
  }
}

.dataset-edit.show {
  grid-template-rows: 1fr;
  padding: 8px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.option-value {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 8px;

  .value {
    min-width: 100px;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 5px;
    border: none;
    padding: 5px;
    background: none;
    gap: 4px;
    transition: 300ms ease-in-out;

    span {
      white-space: nowrap;
      font-weight: bold;
      font-size: 15px;
    }


  }

  .value:hover {
    background: var(--hover-color);
  }

  .value:after {
    content: '';
    position: absolute;
    border: 2px solid var(--hover-color);
    height: 20px;
    border-radius: 4px;
    left: calc(100% + 2px);
    z-index: 0;
    transition: 300ms ease-in-out;
  }
}

.option-value.filter {
  overflow-x: scroll;
  overflow-y: hidden;
}

.option-value.filter::-webkit-scrollbar {
  display: none;
}


.form {
  --border-height: 1px;
  --border-before-color: rgba(221, 221, 221, 0.39);
  --border-after-color: #5891ff;
  --input-hovered-color: #4985e01f;
  position: relative;
  width: 0;
}

/* styling of Input */
.input {
  color: #fff;
  font-size: 0.9rem;
  background-color: transparent;
  width: 100%;
  box-sizing: border-box;
  padding-inline: 0.5em;
  padding-block: 0.7em;
  border: none;
  border-bottom: var(--border-height) solid var(--border-before-color);
  transition: 300ms ease-in-out;
}

/* styling of animated border */
.input-border {
  position: absolute;
  background: var(--border-after-color);
  width: 0%;
  height: 2px;
  bottom: 0;
  left: 0;
  transition: 0.3s;
}

/* Hover on Input */
input:hover {
  background: var(--input-hovered-color);
}

input:focus {
  outline: none;
}

/* here is code of animated border */
input:focus ~ .input-border {
  width: 100%;
}
</style>
