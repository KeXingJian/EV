<template>
  <div class="bar-chart" >
    <RadioBox
        v-model="pieType"
        :options="pieTypeSelect"
        name="pieTypeSelect"></RadioBox>
    <div class="config-item":class="{
      inactivation: !isRoes
    }"
    >
      <span>值映射:</span>
      <RadioBox
          v-model="mapType"
          :options="mapTypeSelect"
          name="mapTypeSelect"
          :inactivation="!isRoes"
      ></RadioBox>

    </div>
    <div class="config-item">
      <span>标签:</span>
      <RadioBox
          v-model="labelType"
          :options="labelTypeSelect"
          name="labelTypeSelect"></RadioBox>

    </div>
    <div class="config-item" :class="{
      inactivation: !isStop
    }">
      <span>外引类型:</span>
      <RadioBox
          v-model="stopType"
          :options="stopTypeSelect"
          name="stopTypeSelect"
          :inactivation="!isStop"
      ></RadioBox>
    </div>
    <div class="config-item">
      <span>范围:</span>
      <ProgressBarRange :inactivation="false"></ProgressBarRange>
    </div>
  </div>
</template>

<script setup>
import ProgressBarRange from "../button/ProgressBarRange.vue";
import RadioBox from "../box/RadioBox.vue";
import {ref, watch} from "vue";



const pieType = ref(1)
const pieTypeSelect = [
  {
    value: 1,
    label: '简单'
  },
  {
    value: 2,
    label: '玫瑰图'
  }
]

const mapType = ref(0);
const mapTypeSelect = [
  {
    value: 1,
    label: '半径',
  },
  {
    value: 2,
    label: '面积'
  }
]

const labelType = ref(1)
const labelTypeSelect = [
  {
    value: 1,
    label: '内嵌'
  },
  {
    value: 2,
    label: '外引'
  },
  {
    value: 3,
    label: '隐藏'
  }
]

const stopType = ref(0)
const stopTypeSelect = [
  {
    value: 1,
    label: '环绕'
  },
  {
    value: 2,
    label: '侧边'
  }
]

const isStop = ref(false)
const isRoes = ref(false)

watch(pieType ,(newPie)=>{
  if(newPie===2){
    mapType.value = 1
    isRoes.value = true
  }else {
    mapType.value = 0
    isRoes.value = false
  }
})

watch(labelType ,(newPie)=>{
  if(newPie===2){
    stopType.value = 1
    isStop.value = true
  }else {
    stopType.value = 0
    isStop.value = false
  }
})
</script>

<style scoped>
.bar-chart{
  display: grid;
  gap: 20px;
}

.config-item{
  display: flex;
  gap: 20px;
  align-items: center;
}

span{
  font-weight: bolder;
}

.inactivation{
  cursor: not-allowed;
  span{
    color: var(--inactivation-color);
  }
}
</style>
