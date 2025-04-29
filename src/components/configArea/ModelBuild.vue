<template>
  <div class="top-div">
      <GraphItem/>
  </div>

</template>

<script setup>
import GraphItem from "../card/GraphItem.vue";
</script>

<style scoped>
.top-div {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px - 42px);
  overflow-x: hidden;
  overflow-y: scroll;
  position: relative; /* 确保删除区域定位正确 */
}
.top-div::-webkit-scrollbar {
  display: none;
}

</style>
