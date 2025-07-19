<template>
    <div class="top-div">
      <CoordinateConfigRegion></CoordinateConfigRegion>
      <SeriesConfigRegion></SeriesConfigRegion>
    </div>
</template>

<script setup>

import SeriesConfigRegion from "./region/SeriesConfigRegion.vue";

import CoordinateConfigRegion from "./region/CoordinateConfigRegion.vue";
</script>

<style scoped>
.top-div {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px - 42px);
  overflow-y: scroll;
  overflow-x: hidden;
}
.top-div::-webkit-scrollbar {
  display: none;
}

</style>
