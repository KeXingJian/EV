<template>
  <div class="select-area">
    <router-view/>
    <Notice></Notice>
  </div>

</template>

<script setup>
import Notice from "./configArea/region/Notice.vue";

</script>
<style scoped>
.select-area{
  position: relative;
  display: flex;
  height: calc(100vh - 80px);
  overflow: hidden;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
}
</style>