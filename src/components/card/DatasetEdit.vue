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
          <form v-if="isAddFilter" @submit.prevent="toApplyFilter" class="form" :style="{
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
          <form v-if="isAddGroup" @submit.prevent="toCreateGroup" class="form" :style="{
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
import FieldManage from "../configArea/region/FieldManage.vue";
import Filter from "../svg/Filter.vue";
import Group from "../svg/Group.vue";
import Bar from "./Bar.vue";
import {useOptionConfig} from "../../store/OptionConfig.js";
import {ref} from "vue";
import CheckButton from "../svg/CheckButton.vue";
import {storeToRefs} from "pinia";
import {checkSeries, unloadSeries} from "../../utils/newArch/Check4Series.js";


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
const {
  echartsOptions,Ss,
  applyFilter,
  createGroup,
  refreshDataset
} = useOptionConfig()

const {Ds} = storeToRefs(useOptionConfig())

const toApplyFilter = () => {
  const isOK = applyFilter(props.dataset, currentExpressionFilter.value)
  if (isOK) {
    currentExpressionFilter.value = ''
    isAddFilter.value = false
    Ss.filter(i=>i.isLoad).forEach(i=>checkSeries(i,echartsOptions))
  }

}

const toCreateGroup = () => {
  //console.log(currentExpressionGroup.value)
  const isOK = createGroup(props.dataset, currentExpressionGroup.value)
  if (isOK) {
    currentExpressionGroup.value = ''
    isAddGroup.value = false
    Ss.filter(i=>i.isLoad).forEach(i=>checkSeries(i,echartsOptions))
  }


}

const deleteFilter = (dataset, i) => {
  dataset.filterConditions = dataset.filterConditions.filter((_, index) => index !== i)
  refreshDataset(dataset.id)
  Ss.filter(i=>i.isLoad).forEach(i=>checkSeries(i,echartsOptions))
}

const deleteGroup = (child, index) => {
  const deleteIs = []
  toDeleteNode(child, deleteIs, index)
  Ss.forEach(i=>{
    const needDelete = deleteIs.includes(i.D.id)
    if (needDelete){
      i.D =null
      if (i.isLoad){
        unloadSeries(i,echartsOptions)
      }
    }
  })
}

const toDeleteNode = (child, ids, i) => {

  if (!child) return
  child.groupCondition.forEach((item, index) => {

    toDeleteNode(item.child, ids, index) //递归
  })
  ids.push(child.id)
  deleteGroupCondition(child, i)
  Ds.value = Ds.value.filter(i => i.id !== child.id)
}

const deleteGroupCondition = (child, i) => {
  child.parent.groupCondition = child.parent.groupCondition.filter((_, index) => index !== i)
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
  color: var(--font-color);
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
