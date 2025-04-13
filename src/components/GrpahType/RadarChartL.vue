<script setup>
import CheckBox from "../box/CheckBox.vue";
import {ref} from "vue";
import InputBox from "../box/InputBox.vue";

const isConsistency = ref(true)
</script>

<template>
  <div class="bar-chart">
    <div class="config-item">
      <span>最大值一致</span>
      <CheckBox v-model="isConsistency"></CheckBox>
    </div>
  </div>

  <div v-if="isConsistency" class="config-item">
    <span>Max:</span>
    <InputBox text="Number" :width="67"></InputBox>
  </div>
  <div v-else class="config-item">
    <span>Max:</span>
    <div class="inputs">
      <div class="input-box">
        <p>sss</p>
        <InputBox text="Number" :width="67"></InputBox>
      </div>
    </div>

  </div>

</template>

<style scoped>
.config-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  span {
    font-weight: bolder;
  }
}
.inputs{
  display: flex;
  max-width: 400px;
  overflow-x: scroll;
  gap:15px
}

.inputs::-webkit-scrollbar{
  display: none;
}

.input-box {
  display: flex;
  align-items: center;
  gap:5px;
  position: relative;
}
.input-box:after {
  content: '';
  position: absolute;
  border: 2px solid var(--hover-color);
  height: 20px;
  border-radius: 4px;
  left: calc(100% + 4px);
  z-index: 0;
}

</style>