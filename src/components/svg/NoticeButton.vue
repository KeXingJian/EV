<script setup>
import {computed} from "vue";

const props = defineProps({
  count: {
    type: Number,
    default: 0,
    validator: value => value >= 0
  }
});

const formattedCount = computed(() => {
  return props.count > 99 ? '99+' : props.count;
});
</script>

<template>
  <div
      class="svg-box"
      :data-count="formattedCount"
      :class="{ 'has-count': count > 0 }"
  >
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
  </div>
</template>

<style scoped>
.svg-box{
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 4px;
  padding: 4px;
  transition: 300ms ease-in-out;
}

.svg-box:hover{
  background: var(--3-background-color);
}


.svg-box.has-count:before{
  position: absolute;
  text-align: center;
  line-height: 1.3;
  border-radius: 12px;
  content: attr(data-count);
  width: 20px;
  height: 20px;
  padding: 0 4px;
  top: -6px;
  left: calc(100% - 16px);
  z-index: 1;
  background: var(--info-activate-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: Arial, sans-serif;
  box-sizing: border-box;
}
</style>