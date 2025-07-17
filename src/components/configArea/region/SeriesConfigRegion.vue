<template>
  <div class="series-container">
    <div class="header" @click="toggleDataset($event)">
      <div class="header-left">
        <span>{{ $t('series') }}</span>
      </div>
      <div class="header-right">
        <DropDown @click.stop></DropDown>
      </div>
    </div>
    <div class="options">
      <div>
        <div class="series"  v-for="item in loadedSeries" :key="item.id">
          <div class="series-header" @click="toggleDataset($event)">
            <div class="series-header-left">
              <span>{{item.name}}</span>
            </div>
            <div class="series-header-right">
              <DropDown @click.stop></DropDown>
            </div>
          </div>
          <div class="series-body">
            <div>
              <SeriesConfig :item="item"></SeriesConfig>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import DropDown from "../../svg/DropDown.vue";
import SeriesConfig from "../config/SeriesConfig.vue";
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../../../store/OptionConfig.js";
import {computed, watch} from "vue";

const toggleDataset = (event) => {
  event.currentTarget.nextElementSibling.classList.toggle('show')
  event.currentTarget.classList.toggle('rotate')
}

const {Ss} = storeToRefs(useOptionConfig())

const loadedSeries = computed(()=>{
  return Ss.value.filter(i=>i.isLoad)
})

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

.rotate.header .header-right,.rotate.series-header .series-header-right{
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


.series-header{
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: 300ms ease-in-out;
  background-color: var(--2-background-color);
  position: relative;
}

.series-header:hover{
  background-color: var(--hover-color);
}

.series-header:after{
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


.series-header:after{
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

.series-body{
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
