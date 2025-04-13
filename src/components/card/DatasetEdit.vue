<template>
  <div class="dataset-edit">
    <div>
      <div class="option-item">
        <Filter></Filter>
        <div class="option-value filter">
          <button class="value" v-for="(filter, index) in dataset.options.filter" :key="index">
            <span>{{ filter }}</span>
            <CloseButton></CloseButton>
          </button>
          <AddButton></AddButton>
        </div>
      </div>

      <div class="option-item">
       <Group></Group>
        <div class="option-value filter">
          <button class="value" v-for="(group, index) in dataset.options.group" :key="index">
            <span>{{ group }}</span>
            <CloseButton></CloseButton>
          </button>
          <AddButton></AddButton>
        </div>
      </div>

      <Bar v-if="dataset.name === 'ROOT'" ></Bar>
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

defineProps({
  dataset: {
    type: Object,
    required: true,
  }
})
</script>

<style scoped>
.dataset-edit {
  padding: 0;
  background-color: var(--2-background-color);
  display: grid;
  grid-template-rows: 0fr;
  overflow: hidden;
  transition: 300ms ease-in-out;
  >div{
    overflow: hidden;
    display: grid;
    gap: 2px;
  }
}

.dataset-edit.show{
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
  }
}

.option-value.filter {
  overflow-x: scroll;
  overflow-y: hidden;
}

.option-value.filter::-webkit-scrollbar {
  display: none;
}



</style>
