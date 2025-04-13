<script setup>
import emitter from "../../emitter/emitter.js";
import { defineProps, defineEmits } from 'vue'
defineProps({
  // v-model 绑定的值
  modelValue: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:modelValue'])

const chooseColor = (event)=>{
  emitter.emit('show-menu-color',
      {
        x: event.clientX,
        y: event.clientY,
        handle: (color)=>{
          console.log(color)
          emit('update:modelValue',color)
        }
      })
}
</script>

<template>
  <div class="config-item">
    <slot></slot>
    <div class="color-point" @click="chooseColor($event)" :style="{
      backgroundColor: modelValue
    }"></div>
  </div>
</template>

<style scoped>
.color-point{
  height: 20px;
  width: 20px;
  border-radius: 50%;
  cursor: pointer;
}
</style>