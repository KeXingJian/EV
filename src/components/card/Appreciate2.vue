<template>
  <div v-show="isShow" class="dialog" @click="isShow = false">
    <img src="/src/assets/appreciate2.jpg" alt="appreciate2" />
  </div>
</template>

<script setup>
import { onUnmounted, ref } from 'vue'
import emitter from "../../emitter/emitter.js";

let isShow = ref(false)

const show = ()=>{
  isShow.value = true
}

emitter.on('appreciate2', show)

onUnmounted(() => {
  emitter.off('appreciate2', show)
})
</script>

<style scoped>
.dialog {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100vw;
  height: 100%;
  z-index: 9999;
}
.dialog::before {
  width: 1000vw;
  height: 1000vh;
  left: -500vh;
  top: -500vh;
  content: '';
  position: absolute;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  z-index: -1;
}

img {
  width: 28%;
  margin-bottom: 100px;
}
</style>