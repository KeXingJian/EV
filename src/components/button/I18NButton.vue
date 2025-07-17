<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import { useI18n } from 'vue-i18n'
import emitter from "../../emitter/emitter.js";
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../../store/OptionConfig.js";

const { locale } = useI18n()
const {lang} = storeToRefs(useOptionConfig())

const toLang = ref('English');
const changeLang = ()=>{
  if (toLang.value==='English'){
    locale.value = 'en'
    toLang.value='中文'
    lang.value = false
  }else {
    locale.value = 'zh-CN'
    toLang.value='English'
    lang.value = true
  }

}

onMounted(()=>{
  emitter.on("change-lang",changeLang)
})

onUnmounted(()=>{
  emitter.off("change-lang",changeLang)
})
</script>

<template>
  <button class="btn" @click="changeLang">{{ toLang }}</button>
</template>

<style scoped>

.btn {
  width: 80px;
  font-size: 15px;
  font-weight: bolder;
  background: transparent;
  border: none;
  padding: 1em 1em;
  color: var(--font-color);
  position: relative;
  transition: 0.5s ease;
  cursor: pointer;
  border-radius: 0;
  z-index: 2;
}

.btn::before {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 0;
  background-color: var(--theme-hover-color);
  transition: 0.5s ease;
  z-index: 99;
}

.btn:hover {
  color: #1e1e2b;
  transition-delay: 0.5s;
}

.btn:hover::before {
  width: 80px !important;
}

.btn::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  height: 0;
  width: 100%;
  background-color: var(--theme-hover-color);
  transition: 0.4s ease;
  z-index: -1;
}

.btn:hover::after {
  height: 100%;
  transition-delay: 0.4s;
  color: var(--theme-hover-color);
}
</style>