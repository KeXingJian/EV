<template>
  <div class="graph-item">
    <div class="header" >
      <div class="header-left">
        <Canvas></Canvas>
      </div>
      <div class="header-right">
        <AddButton @click="add"></AddButton>
      </div>
    </div>
    <section class="Ys show">
      <div>
        <span>{{ $t('coordinate') }}</span>
        <div class="c">
          <C v-for="c in Cs.filter(i=>i.id!==-1)" :key="c.id" :model-item="c"></C>
        </div>
        <span>{{ $t('series') }}</span>
        <div class="s">
          <S v-for="s in Ss" :key="s.id" :model-item="s"></S>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import Canvas from "../svg/Canvas.vue";
import AddButton from "../svg/AddButton.vue";
import emitter from "../../emitter/emitter.js";
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../../store/OptionConfig.js";
import S from "../newArch/S.vue";
import C from "../newArch/C.vue";
import {useI18n} from "vue-i18n";
const {t} = useI18n()
const {Ss,Cs,isLoadRelation} = storeToRefs(useOptionConfig())
const add = (event) => {

  if (isLoadRelation.value){
    emitter.emit("toast", t('关系图独立唯一,不予以添加'))
    return
  }
  emitter.emit('show-menu',
      {
        x: event.clientX,
        y: event.clientY,
      }
  )
}

</script>

<style scoped>

.graph-item {
  overflow: scroll;
  cursor: pointer;
  display: grid;

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
}

.graph-item::-webkit-scrollbar{
  display: none;
}

.rotate.header .header-right {
  svg:last-child {
    rotate: 180deg;
  }
}

svg {
  transition: rotate 150ms ease;
}

.Ys {
  display: grid;
  grid-template-rows: 0fr;
  transition: 300ms ease-in-out;

  > div {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}

.Ys.show {
  margin: 4px;
  grid-template-rows: 1fr;
}

.c, .s {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;

}

.c:after {
  content: '';
  position: absolute;
  height: 2px;
  background: linear-gradient(
      90deg,
      var(--1-background-color) 0%,
      var(--2-background-color) 50%,
      var(--1-background-color) 100%
  );
  border-radius: 10px;
  width: 99%;
  top: calc(100% + 12px);
  z-index: 2;
}

span{
  font-weight: bolder;
}

</style>
