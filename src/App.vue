<template>
  <div
      :class="{
        black: theme
      }"
  >
    <Menu></Menu>
    <AIChat></AIChat>
    <ColorMenu></ColorMenu>
    <ContextMenu v-if="isLoadRelation"></ContextMenu>
    <OptionItem></OptionItem>
    <OptionItem4I8N></OptionItem4I8N>
    <Page></Page>
    <Toast></Toast>
    <Appreciate1></Appreciate1>
    <Appreciate2></Appreciate2>
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
import AboutRegion from "./components/configArea/region/AboutRegion.vue";
import emitter from "./emitter/emitter.js";
import {onBeforeUnmount, onMounted, ref} from "vue";

import ColorMenu from "./components/card/ColorMenu.vue";
import OptionItem from "./components/card/OptionItem.vue";
import {storeToRefs} from "pinia";
import {useOptionConfig} from "./store/OptionConfig.js";
import {pushMsg} from "./utils/MsgUtils.js";
import Page from "./components/rightPage/Page.vue";
import {init} from "./utils/InitUtils.js";
import Menu from "./components/newArch/Menu.vue";
import LeftFolatButton from "./components/button/LeftFolatButton.vue";
import {analyzeColumns2} from "./utils/ExcelUtils.js";
import {
  getMockData,
  handle1,
  handle2,
  handle3,
  handle4,
  handle5,
  handle6,
  handle7
} from "./utils/MockData.js";
import Toast from "./components/Toast.vue";
import Appreciate1 from "./components/card/Appreciate1.vue";
import Appreciate2 from "./components/card/Appreciate2.vue";
import {useI18n} from 'vue-i18n'
import OptionItem4I8N from "./components/card/OptionItem4I8N.vue";

import {useGlobalConfig} from "./store/GlobalConfig.js";
import {usePalettesConfig} from "./store/PalettesConfig.js";
import {v4 as uuidv4} from "uuid";
import {useNodeState} from "./store/NodeState.js";
import ContextMenu from "./components/card/ContextMenu.vue";
import AIChat from "./components/button/AIChat.vue";

const {locale, t} = useI18n()

const {
  addX0Y,
  addPolar,
  addSeries,
  addRelation,
  echartsOptions,dataset,Ss,Cs,Ds,fileData
} = useOptionConfig()

const {theme,isLoadRelation} = storeToRefs(useOptionConfig())
const {palettes} = usePalettesConfig()
const {global} = useGlobalConfig()
const {setColorPie} = useNodeState()

const onResize = () => {
  const windowWidth = window.innerWidth;
  const threshold = windowWidth * 0.8;

  if (width.value > threshold) {
    const newWidth = windowWidth * 0.5;
    width.value = Math.max(minWidth, Math.min(maxWidth, newWidth));
  }
  emitter.emit('resize')
}

const toOpen = () => {
  if (isOpen.value) width.value = 0
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

const startResize = () => {
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

const loadFirstChart = (num) => {
  const userLang = navigator.language || navigator.userLanguage
  const mockData = getMockData(!userLang.startsWith('zh'));
  const endData = mockData.slice(1)

  mockData[0].unshift('id')
  endData.forEach(i => i.unshift(uuidv4()))


  fileData.rowCount = endData.length - 1
  fileData.columnStats.splice
  (0,
      fileData.columnStats.length,
      ...analyzeColumns2(endData, mockData[0].map(String))
  )

  dataset.dimension = mockData[0]
  dataset.source = endData// 存储原始数据（排除表头）

  init()
  switch (num) {
    case 1:
      handle1(Ss,Cs,echartsOptions,addX0Y,addSeries)
      return
    case 2:
      handle2(Ss,Cs,echartsOptions,addPolar,addSeries,global)
      return
    case 3:
      handle3(Ss,Cs,echartsOptions,addX0Y,addSeries,global)
      return
    case 4:
      handle4(
          Ss,Cs,echartsOptions,addX0Y,addSeries,
          dataset.source,setColorPie
      )
      return
    case 5:
      handle5(Ss,Cs,echartsOptions,addX0Y,addSeries)
      return
    case 6:
      handle6(Ss,Cs,global,echartsOptions,addX0Y,addSeries)
      return
    default:
      handle1(Ss,Cs,echartsOptions,addX0Y,addSeries)
      //handle7(Ss,echartsOptions,addRelation)
  }

  pushMsg(0, `${t('Notice.A')}`)

}

const langInit = () => {

  const userLang = navigator.language || navigator.userLanguage

  if (userLang.startsWith('zh')) {
    locale.value = 'zh-CN'
  } else {
    document.title = "ExcelVision - Free online chart maker | ExcelVision is ready to use, real-time data visualization"
    Ds[0].from = "Temporary Data"
    emitter.emit('change-lang')
  }
}

const colorInit = () => {

  const my = JSON.parse(localStorage.getItem('my'))
  const love = JSON.parse(localStorage.getItem('love'))


  if (!my) localStorage.setItem('my', JSON.stringify(palettes[0].colors))
  else palettes[0].colors = my

  //console.log(my)

  if (!love) localStorage.setItem('love', JSON.stringify([0, 1, 2, 3, 4, 5]))
  else {
    palettes.forEach((color, index) => {
      color.isLove = !!love.includes(index);
    })

  }
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
  langInit()
  colorInit()

  window.addEventListener('resize', onResize)
  emitter.on("theme-change", changeTheme);


  const num = parseNumberFromURL()

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
  background: var(--2-background-color);
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

.close {
  padding-right: 0;
}
</style>
