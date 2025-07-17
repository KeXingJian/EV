<script setup >

import {onMounted, onUnmounted, ref} from "vue";
import emitter from "../emitter/emitter.js";

const toastMessage = ref("")
const showToast = ref(false)

const toToast = (msg)=>{
  toastMessage.value = msg
  showToast.value = true

  setTimeout(() => {
    showToast.value = false
  }, 2000)
}

onMounted(() => {
  emitter.on("toast",toToast)
})

onUnmounted(()=>{
  emitter.off("toast")
})

</script>

<template>
  <transition name="slide">
    <div v-if="showToast" class="toast">
      {{ toastMessage }}
    </div>
  </transition>
</template>

<style scoped>
.toast {
  position: fixed;
  top: 35%;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--2-background-color);
  color: var(--font-color);
  padding: 10px 20px;
  border-radius: 4px;
  z-index: 10000;
}


</style>