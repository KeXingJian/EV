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
    <HeaderNav></HeaderNav>
    <Table></Table>
  </div>
</template>

<script setup>
import {ref, onBeforeUnmount, onMounted} from 'vue';
import RightFloatButton from "../button/RightFloatButton.vue";

import Table from "./Table.vue";
import HeaderNav from "./HeaderNav.vue";
const isOpen = ref(false);
const width = ref(0);
const minWidth = 40;
const maxWidth = 1200;
const isResizing = ref(false);



const startResize = (e) => {
  isResizing.value = true;
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', stopResize);
};

// 新增：处理窗口大小变化
const handleWindowResize = () => {
  const windowWidth = window.innerWidth;
  const threshold = windowWidth * 0.8;

  if (width.value > threshold) {
    const newWidth = windowWidth * 0.5;
    width.value = Math.max(minWidth, Math.min(maxWidth, newWidth));
  }
};

const handleMouseMove = (e) => {
  if (!isResizing.value) return;

  const newWidth = window.innerWidth - e.clientX;
  width.value = Math.max(minWidth, Math.min(maxWidth, newWidth));
};

const stopResize = () => {
  isResizing.value = false;
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', stopResize);

};

onMounted(()=>{
  window.addEventListener('resize', handleWindowResize);
})

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', stopResize);
  window.removeEventListener('resize', handleWindowResize);
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
  grid-template-rows: auto 1fr;
}
</style>