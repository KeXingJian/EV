<template>
  <div class="graph-container">
    <div class="header" @click="toggleDataset($event)">
      <div class="header-left">
        <span>图</span>
      </div>
      <div class="header-right">
        <DropDown @click.stop></DropDown>
      </div>
    </div>
    <div class="options">
      <div>
        <div class="graph" v-for="item in Gs" :key="item.id">
          <div class="graph-header" @click="toggleDataset($event)">
            <div class="graph-header-left">
              <span>{{item.name}}</span>
            </div>
            <div class="graph-header-right">
              <DropDown @click.stop></DropDown>
            </div>
          </div>
          <div class="graph-body">
            <div>
              <GraphConfig :item="item"></GraphConfig>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import GraphConfig from "../config/GraphConfig.vue";
import DropDown from "../svg/DropDown.vue";
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../../store/OptionConfig.js";

const toggleDataset = (event) => {
  event.currentTarget.nextElementSibling.classList.toggle('show')
  event.currentTarget.classList.toggle('rotate')
}

const {Gs} = storeToRefs(useOptionConfig())
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

.rotate.header .header-right,.rotate.graph-header .graph-header-right{
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

.graph-header{
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: 300ms ease-in-out;
  background-color: var(--2-background-color);
  position: relative;
}

.graph-header:hover{
  background-color: var(--hover-color);
}

.graph-header:after{
  content: '';
  width: 100%;
  position: absolute;
  height: 1px;
  border-radius: 1px;
  z-index: 0;
  top: 95%;
  left: 0;
  background: linear-gradient(
      90deg,
      var(--2-background-color) 0%,
      var(--border-color) 50%,
      var(--2-background-color) 100%
  );
}

.graph-body{
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
