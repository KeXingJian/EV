<template>
  <div class="datasets-container">
    <ul>
      <vue-draggable v-model="Ds">
        <li class="dataset" v-for="dataset in Ds" :key="dataset.id">
          <div class="dataset-head" @click="toggleDataset($event)">
            <Database></Database>
            <div class="dataset-name" >
              <span>{{dataset.name}}</span>
            </div>
            <div>
              <span>{{dataset.from}}</span>
            </div>
            <div>
              <span>{{dataset.count }}</span>
            </div>
            <DropDown></DropDown>
          </div>
          <DatasetEdit :dataset = dataset></DatasetEdit>
        </li>
      </vue-draggable>
    </ul>
  </div>
</template>

<script setup>
import DatasetEdit from "../card/DatasetEdit.vue";
import {VueDraggable} from "vue-draggable-plus";
import DropDown from "../svg/DropDown.vue";
import Database from "../svg/Database.vue";
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../../store/OptionConfig.js";

const toggleDataset = (event) => {
  event.currentTarget.nextElementSibling.classList.toggle('show')
  event.currentTarget.classList.toggle('rotate')
}

const {Ds} = storeToRefs(useOptionConfig())

console.log(Ds.value)
</script>

<style scoped>
.datasets-container {
  margin: 10px;
  border-radius: 8px;
  overflow-y: scroll;
  overflow-x: hidden;
}

.datasets-container::-webkit-scrollbar {
  display: none;
}

.dataset-name{
  display: flex;
  justify-content: space-between;
  align-items: center;
  span{
    color: var(--active-color);
    font-weight: bolder !important;
  }
}

ul {
  >div{
    list-style: none;
    display: grid;
    gap: 10px;
  }
}

.dataset {
  cursor: pointer;
  border-radius: 4px;
  display: grid;
  overflow: hidden;

  .dataset-head {
    padding: 8px;
    border-radius: 4px 4px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--2-background-color);
    transition: 300ms ease-in-out;
    span{
      font-weight: 500;
    }
    >div{
      width: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      white-space: nowrap;
    }
    svg:last-child {
      transition: 150ms ease-in-out;
    }
  }
}

.dataset-head:hover {
  background-color: var(--hover-color);
  .svg-box:hover{
    background: var(--2-background-color);
  }
}

.rotate {
  svg:last-child {
    rotate: 180deg;
  }
}

</style>
