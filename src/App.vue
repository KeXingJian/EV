<template>
  <div
      :class="{
        black: theme
      }"
  >
    <Menu></Menu>
    <ColorMenu></ColorMenu>
    <OptionItem></OptionItem>
    <Page></Page>
    <Contact></Contact>
    <main>
      <HeaderNavigation></HeaderNavigation>
      <div class="container">
        <section class="section-left"
                 :style="{ width: `${width}px`}"
                 :class="{
                    close: !isOpen
                 }"
        >
          <div
              class="br"
              @mousedown="startResize"
          ></div>
          <LeftFolatButton
              :is-open="isOpen"

              @click="toOpen"
          ></LeftFolatButton>
          <ToolNavigation></ToolNavigation>
          <SelectArea></SelectArea>
        </section>
        <section class="section-right">
          <GraphCanvas></GraphCanvas>
          <AboutRegion></AboutRegion>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import ToolNavigation from "./components/ToolNavigation.vue";
import SelectArea from "./components/SelectArea.vue";
import GraphCanvas from "./components/GraphCanvas.vue";
import HeaderNavigation from "./components/HeaderNavigation.vue";
import AboutRegion from "./components/region/AboutRegion.vue";
import emitter from "./emitter/emitter.js";
import {onBeforeUnmount, onMounted, ref} from "vue";

import ColorMenu from "./components/card/ColorMenu.vue";
import OptionItem from "./components/card/OptionItem.vue";
import {storeToRefs} from "pinia";
import {useOptionConfig} from "./store/OptionConfig.js";
import {pushMsg} from "./utils/MsgUtils.js";
import Page from "./components/rightPage/Page.vue";
import {init} from "./utils/newArch/InitUtils.js";
import Menu from "./components/newArch/Menu.vue";
import LeftFolatButton from "./components/button/LeftFolatButton.vue";
import {analyzeColumns2} from "./utils/ExcelUtils.js";
import {getMockData, getMockField, handle1, handle2, handle3, handle4, handle5, handle6} from "./utils/MockData.js";
import Contact from "./components/card/Contact.vue";


const {theme, echartsOptions,fileData,dataset,Ss,sIndex,Cs,cIndex,global,Ds} = storeToRefs(useOptionConfig())


const onResize = () => {
  const windowWidth = window.innerWidth;
  const threshold = windowWidth * 0.8;

  if (width.value > threshold) {
    const newWidth = windowWidth * 0.5;
    width.value = Math.max(minWidth, Math.min(maxWidth, newWidth));
  }
  emitter.emit('resize')
}

const toOpen = ()=>{
  if(isOpen.value) width.value = 0
  else width.value = 633

  isOpen.value = !isOpen.value
  // 延迟触发 resize 事件
  setTimeout(() => {
    emitter.emit('resize');
  }, 100);
}

const changeTheme = () => {
  theme.value = !theme.value
}

const isOpen = ref(true)
const width = ref(633);
const minWidth = 633;
const maxWidth = 1200;
const isResizing = ref(false);

const startResize = (e) => {
  isResizing.value = true;
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', stopResize);
}

const stopResize = () => {
  isResizing.value = false;
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', stopResize);
  emitter.emit('resize')
}

const handleMouseMove = (e) => {
  if (!isResizing.value) return;

  width.value = Math.max(minWidth, Math.min(maxWidth, e.clientX))

  emitter.emit('resize');

}

const loadFirstChart = (num)=>{
  const mockData = getMockData();
  const mockField = getMockField();

  fileData.value = {
    rowCount: mockData.length-1, // 排除表头
    columnStats: analyzeColumns2(mockData,mockData[0]?.map(String) || [],),
  };
  dataset.value.source = mockData.slice(1) // 存储原始数据（排除表头）
  dataset.value.dimension = mockField

  init()



  switch (num) {
    case 1:
      handle1(Ss,Cs,sIndex,cIndex,global,echartsOptions,Ds)
      return
    case 2:
      handle2(Ss,Cs,sIndex,cIndex,global,echartsOptions,Ds)
      return
    case 3:
      handle3(Ss,Cs,sIndex,cIndex,global,echartsOptions,Ds)
      return
    case 4:
      handle4(Ss,Cs,sIndex,cIndex,global,echartsOptions,Ds)
      return
    case 5:
      handle5(Ss,Cs,sIndex,cIndex,global,echartsOptions,Ds)
      return
    case 6:
      handle6(Ss,Cs,sIndex,cIndex,global,echartsOptions,Ds)
      return
    default:
      handle1(Ss,Cs,sIndex,cIndex,global,echartsOptions,Ds)
  }


  pushMsg(0, '示例图以为您加载,可以据此快速学习.您可以导入数据或右悬浮半球->数据编辑,即时编辑数据')
}

// 解析 URL 参数并验证
const parseNumberFromURL = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const rawNumber = urlParams.get('number');

  if (rawNumber === null || rawNumber === '') {
    return null;
  }

  // 严格验证是否为数字（允许整数或浮点数）
  if (!/^-?\d+(\.\d+)?$/.test(rawNumber)) {
    return null;
  }

  return Number(rawNumber);

};

onMounted(() => {
  window.addEventListener('resize',onResize)
  emitter.on("theme-change", changeTheme);
  pushMsg(0,
      '欢迎使用EXCELVISION,当前为测试版,如有问题QQ联系:',
      '2787901285(点击试试)',
      ()=>{
        emitter.emit('contact')
      }
  )

  const num = parseNumberFromURL()
  if (!num || num>6) return

  loadFirstChart(num)

})

onBeforeUnmount(() => {
  emitter.off("theme-change", changeTheme);
  window.removeEventListener('resize', onResize)
})

</script>

<style scoped>
main {
  display: grid;
  grid-template-rows: 80px 1fr;
  background: var(--1-background-color);
  transition: 300ms ease-in-out;
}

.container {
  display: grid;
  grid-template-columns:auto 1fr;
  overflow: hidden;
  height: calc(100vh - 80px);
  width: 100vw;
  flex-direction: row;
}

.section-left, .section-right {
  height: calc(100vh - 80px);
}

.section-left {
  padding-right: 8px;
  display: grid;
  grid-template-columns: 80px 1fr;
  position: relative;
}

.br {
  position: absolute;
  height: calc(100vh - 80px);
  width: 8px;
  background: var(--theme-hover-color);
  left: calc(100% - 8px);
  z-index: 2;
  cursor: e-resize;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.section-right {
  display: grid;
  cursor: pointer;
  grid-template-rows: calc(100vh - 80px) auto;
  overflow-y: scroll;
  overflow-x: hidden;
}

.section-right::-webkit-scrollbar {
  display: none;
}

.black {
  --border-color: #e0e0e0;
  --font-color: #ffffff;

  --1-background-color: #0d1f2d;
  --2-background-color: #1d2e3d;
  --3-background-color: #C9D6DF;
  --hover-color: #354656;

  --1-theme-color: #0d6e6e;
  --active-color: #ff3d3d;
  --theme-hover-color: #15ccbe;
}

.close{
  padding-right: 0;
}
</style>
