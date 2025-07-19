<template>
  <div class="axis-container">
    <div class="header" @click="toggleDataset($event)">
      <div class="header-left">
        <span>{{ $t('coordinate') }}</span>
      </div>
      <div class="header-right">
        <DropDown @click.stop></DropDown>
      </div>
    </div>
    <div class="options">
      <div>
        <div class="axis" v-for="item in Cs.filter(i=>i.id!==-1)"
             :key="item.id"
        >
          <div class="axis-header" @click="toggleDataset($event)">
            <div class="axis-header-left">
              <span>{{ item.name }}</span>
            </div>
            <div class="axis-header-right">
              <DropDown @click.stop></DropDown>
            </div>
          </div>
          <div class="axis-body">
            <div>
              <CoordinateSystem :item="item"></CoordinateSystem>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import DropDown from "../../svg/DropDown.vue";

import {storeToRefs} from "pinia";
import {useOptionConfig} from "../../../store/OptionConfig.js";
import CoordinateSystem from "./CoordinateSystem.vue";

const toggleDataset = (event) => {
  event.currentTarget.nextElementSibling.classList.toggle('show')
  event.currentTarget.classList.toggle('rotate')
}
const {Cs} = storeToRefs(useOptionConfig())

</script>


<style scoped>

.options{
  display: grid;
  grid-template-rows: 0fr;
  transition: 300ms ease-in-out;
  >div{
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
}

.rotate.header .header-right,.rotate.axis-header .axis-header-right{
  svg:last-child {
    rotate: 180deg;
  }
}

.header {
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: 300ms ease-in-out;
  background-color: var(--1-theme-color);
  .header-right {
    display: flex;
  }
}

.header:hover {
  background-color: var(--theme-hover-color);
}

.axis-header{
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: 300ms ease-in-out;
  background-color: var(--2-background-color);
}

.axis-header:hover{
  background-color: var(--hover-color);
}

.axis-body{
  display: grid;
  grid-template-rows: 0fr;
  transition: 300ms ease-in-out;
  >div{
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}

.show{
  grid-template-rows: 1fr;
}

svg {
  transition: rotate 150ms ease;
}

span{
  font-weight: bolder;
}

</style>
