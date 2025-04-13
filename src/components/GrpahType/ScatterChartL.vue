<template>
  <div class="bar-chart">
    <RadioBox
        v-model="scatterType"
        :options="scatterTypeSelect"
        name="scatterTypeSelect"></RadioBox>
  </div>
  <div class="bubble-option" :class="{idBubble:idBubble}">
    <div>
      <div class="config-item" :class="{
    }"
      >
        <span>气泡映射:</span>
        <Option></Option>
      </div>
    </div>
  </div>
  <div class="config-item">
    <span>轴中心化:</span>
    <MultipleChoiceBox
        v-model="axisValues"
        :options=axisSelect
        name="selectedValues"
    />

  </div>
  <div class="config-item">
    <span>函数表达式:</span>
    <InputBox></InputBox>
  </div>


</template>

<script setup>

import RadioBox from "../box/RadioBox.vue";
import {ref, watch} from "vue";
import Option from "../button/Option.vue";
import MultipleChoiceBox from "../box/MultipleChoiceBox.vue";
import InputBox from "../box/InputBox.vue";

const idBubble = ref(false)
const scatterType = ref(1)
const scatterTypeSelect = [
  {
    value: 1,
    label: '散点'
  },
  {
    value: 2,
    label: '气泡'
  }
]

const axisValues = ref([])
const axisSelect = ref([
  {label: 'X轴', value: 1},
  {label: 'Y轴', value: 2},
])

watch(scatterType, (newScatter) => {
  if (newScatter === 2) {
    idBubble.value = true

  } else {
    idBubble.value = false
  }

})
</script>

<style scoped>
.bar-chart {
  display: grid;
  gap: 20px;
}

.config-item {
  display: flex;
  gap: 20px;
  align-items: center;
}

span {
  font-weight: bolder;
}


.bubble-option {
  display: grid;
  grid-template-rows: 0fr;
  transition: 300ms ease-in-out;

  > div {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

}

.idBubble.bubble-option {
  grid-template-rows: 1fr;
}
</style>
