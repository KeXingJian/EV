<template>
  <Menu></Menu>
  <ColorMenu></ColorMenu>
  <OptionItem></OptionItem>
  <Page></Page>
  <main>
    <HeaderNavigation></HeaderNavigation>
    <div ref="container" class="container">
      <vue-resizable
          :active="['r']"
          :min-width="420"
          :width="500"
          @resize:move="onResize"
      >
        <section class="section-left">
          <ToolNavigation></ToolNavigation>
          <SelectArea></SelectArea>
        </section>
      </vue-resizable>
      <section class="section-right">
        <GraphCanvas></GraphCanvas>
        <AboutRegion></AboutRegion>
      </section>
    </div>
  </main>

</template>

<script setup>
import ToolNavigation from "./components/ToolNavigation.vue";
import SelectArea from "./components/SelectArea.vue";
import GraphCanvas from "./components/GraphCanvas.vue";
import HeaderNavigation from "./components/HeaderNavigation.vue";
import VueResizable from 'vue-resizable';
import AboutRegion from "./components/region/AboutRegion.vue";
import emitter from "./emitter/emitter.js";
import {onBeforeUnmount, onMounted} from "vue";
import Menu from "./components/card/Menu.vue";
import ColorMenu from "./components/card/ColorMenu.vue";
import OptionItem from "./components/card/OptionItem.vue";
import {storeToRefs} from "pinia";
import {useOptionConfig} from "./store/OptionConfig.js";
import {pushMsg} from "./utils/MsgUtils.js";
import Page from "./components/rightPage/Page.vue"; // 引入 vue-resizable

const onResize = () => {
  emitter.emit("resize");
}

const {Hs,Vs,Ss} = storeToRefs(useOptionConfig())

onMounted(() => {
window.addEventListener('resize', onResize)
pushMsg(0,'欢迎使用DATAVISION,如果您是第一次使用,强烈建议您关注通知栏,它会解答您的一些困惑,点击右侧半球可以查看使用手册')
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})
</script>

<style scoped>
main {
  display: grid;
  grid-template-rows: 80px 1fr;
  background: var(--1-background-color);
}

.container {
  display: grid;
  grid-template-columns:auto 1fr;
  overflow: hidden;
  height: calc(100vh - 80px);
  width: 100vw;
  flex-direction: row;
}

.section-left,.section-right{
  height: calc(100vh - 80px);
}

.section-left{
  overflow: hidden;
  margin-right: 6px;
  display: grid;
  grid-template-columns: 80px 1fr;
}

.section-right{
  margin-left: 6px;
  display: grid;
  cursor: pointer;
  grid-template-rows: calc(100vh - 80px) auto;
  overflow-y: scroll;
  overflow-x: hidden;
}

.section-right::-webkit-scrollbar {
  display: none;
}



</style>
