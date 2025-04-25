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
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z"/></svg>
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
  background: var(--warn-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: Arial, sans-serif;
  box-sizing: border-box;
}
</style>