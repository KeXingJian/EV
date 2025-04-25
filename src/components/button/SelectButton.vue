<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  inactivation:{
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const toggle = (event) => {
  emit('update:modelValue', event.target.checked)
}
</script>

<template>
  <label class="switch" :class="{
          inactivation: inactivation
        }">
    <input
        type="checkbox"
        :checked="modelValue"
        @change="toggle"
        @keydown.space.prevent="toggle"
        :disabled="inactivation"
    >
    <span class="slider"></span>
  </label>
</template>

<style scoped>
.switch {
  --thumb-size: 20px;
  --track-width: 50px;
  --transition-timing: cubic-bezier(0.175, 0.885, 0.32, 1.275);

  position: relative;
  display: inline-block;
  width: var(--track-width);
  height: calc(var(--thumb-size) + 4px);
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--1-theme-color, #e0e0e0);
  border-radius: 34px;
  transition: all 0.4s var(--transition-timing);
}

.slider:before {
  content: "";
  position: absolute;
  height: var(--thumb-size);
  width: var(--thumb-size);
  left: 2px;
  bottom: 2px;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  transition: all 0.4s var(--transition-timing);
}



.switch input:checked + .slider:before {
  transform: translateX(calc(var(--track-width) - var(--thumb-size) - 4px));
}

.switch input:focus-visible + .slider {
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.3);
}

.switch:hover .slider:before {
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
}

.inactivation {
  cursor: not-allowed !important;

  .slider{
    cursor: not-allowed !important;
    background-color: var(--inactivation-color) !important;
  }
}

</style>