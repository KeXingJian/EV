<template>
  <!-- 右侧悬浮按钮 -->
  <RightFloatButton
      :isOpen="isOpen"
      @click="()=>{
          if(isOpen) width = 0
          else width = 500
          isOpen = !isOpen
      }"
      :rightOffset="width-2"/>
  <div
      class="top-div"
      :style="{
      left: `calc(100% - ${width}px)`,
      width: `${width}px`
    }"
  >
    <div
        class="br"
        @mousedown="startResize"
    ></div>
    <HeaderNav v-model="selectedIndex"></HeaderNav>
    <KeepAlive>
      <component :is="components[selectedIndex]"></component>
    </KeepAlive>

  </div>
</template>

<script setup>
import {ref, onBeforeUnmount, onMounted} from 'vue';
import RightFloatButton from "../button/RightFloatButton.vue";

import Table from "./Table.vue";
import HeaderNav from "./HeaderNav.vue";
import Enchiridion from "./Enchiridion.vue";
import emitter from "../../emitter/emitter.js";
const isOpen = ref(false);
const width = ref(0);
const minWidth = 0;
const maxWidth = 1200;
const isResizing = ref(false);

const components = [Enchiridion, Table]; // 组件顺序对应菜单项顺序
const selectedIndex = ref(0); // 默认选中第一个组件

const startResize = (e) => {
  isResizing.value = true;
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', stopResize);
}

// 新增：处理窗口大小变化
const handleWindowResize = () => {
  const windowWidth = window.innerWidth;
  const threshold = windowWidth * 0.8;

  if (width.value > threshold) {
    const newWidth = windowWidth * 0.5;
    width.value = Math.max(minWidth, Math.min(maxWidth, newWidth));
  }
}

const handleMouseMove = (e) => {
  if (!isResizing.value) return;

  const newWidth = window.innerWidth - e.clientX;
  width.value = Math.max(minWidth, Math.min(maxWidth, newWidth));
}

const stopResize = () => {
  isResizing.value = false;
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', stopResize);

}

const toShowPolicy = ()=>{
  if (!isOpen.value) {
    width.value = 500
    isOpen.value = true
  }
  if (selectedIndex.value===1) selectedIndex.value = 0
  setTimeout(() => {
    emitter.emit("scroll-to-bottom")
  }, 500)

}

onMounted(()=>{
  window.addEventListener('resize', handleWindowResize);
  emitter.on("show-policy", toShowPolicy);
})

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', stopResize);
  window.removeEventListener('resize', handleWindowResize);
  emitter.off("show-policy", toShowPolicy);

});

</script>
<style scoped>
.top-div {
  position: fixed;
  height: 100vh;
  z-index: 9999;
  background: var(--1-background-color);
}

.br {
  position: absolute;
  top: 0;
  left: 0;
  width: 8px;
  height: 100vh;
  background: var(--theme-hover-color);
  cursor: e-resize;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  z-index: 99;
}
.top-div{
  display: grid;
  grid-template-rows: 105px 1fr;
}


</style>