<template>
  <div class="palette-container">
    <div class="header" @click="toggleDataset($event)">
      <div class="header-left">
        <span>调色盘</span>
      </div>
      <div class="header-right">
        <DropDown @click.stop></DropDown>
      </div>
    </div>
    <div class="options">
      <div>
        <PaletteConfig></PaletteConfig>
      </div>
    </div>
  </div>
</template>

<script setup>
import DropDown from "../svg/DropDown.vue";
import PaletteConfig from "../config/PaletteConfig.vue";

const toggleDataset = (event) => {
  event.currentTarget.nextElementSibling.classList.toggle('show')
  event.currentTarget.classList.toggle('rotate')
}
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
    gap: 20px;
  }
}

.show{
  grid-template-rows: 1fr;
}

.rotate.header .header-right{
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

svg {
  transition: rotate 150ms ease;
}

span{
  font-weight: bolder;
}
</style>