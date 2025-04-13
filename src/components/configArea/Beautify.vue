<template>
    <div class="top-div">
      <GraphConfigRegion></GraphConfigRegion>
      <AxisConfigRegion></AxisConfigRegion>
      <SeriesConfigRegion></SeriesConfigRegion>
      <PaletteConfigRegion></PaletteConfigRegion>
      <GlobalConfigRegion></GlobalConfigRegion>
    </div>
</template>

<script setup>
import GraphConfigRegion from "../region/GraphConfigRegion.vue";
import AxisConfigRegion from "../region/AxisConfigRegion.vue";
import GlobalConfigRegion from "../region/GlobalConfigRegion.vue";
import SeriesConfigRegion from "../region/SeriesConfigRegion.vue";
import PaletteConfigRegion from "../region/PaletteConfigRegion.vue";
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
