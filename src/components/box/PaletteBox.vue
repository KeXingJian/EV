<script setup>
defineProps({
  points:{
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="box-top">
    <div class="point"
         v-for="(item,index) in points"
         :style="{
            top: '8px',
            left: `${12 * (index + 2.7)}px`,
            background: item,
         }"
    ></div>
  </div>
</template>

<style scoped>
.box-top{
  position: relative;
  width: 150px;
  height: 40px;
  background: var(--3-background-color);
  border-radius: 8px;
  cursor: pointer;
  transition: 300ms ease-in-out;
}

.box-top:hover{
  background: var(--hover-color);
}

.point{
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #c8ffff;
}
</style>