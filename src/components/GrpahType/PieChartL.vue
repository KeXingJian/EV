<template>
  <div class="bar-chart">
    <div class="top-config-item">
      <div class="config-item">
        <span>{{ $t('label') }}</span>

        <check-box v-model="item.isLabel"></check-box>
        <ColorPoint v-model="item.labelColor"></ColorPoint>
      </div>
      <div class="config-item">
        <span>{{ $t('labelLine') }}</span>
        <check-box v-model="item.pieConfig.labelLine"></check-box>
      </div>
      <div class="config-item">
        <span
            :style="{
              width:'55px',
           }"
        >{{ $t('toRose') }}</span>
        <check-box v-model="item.pieConfig.isRose"></check-box>
      </div>
      <div class="config-item">
        <span>{{ $t('default') }}</span>
        <ColorPoint v-model="item.color"></ColorPoint>
      </div>
    </div>


    <div class="config-item"
         :class="{
          inactivation: !item.pieConfig.isRose }"
    >
      <span>{{ $t('mappingWay') }}</span>
      <RadioBox
          v-model="item.pieConfig.roseType"
          :options="mapTypeSelect"
          :name="'mapTypeSelect'+item.id"
          :inactivation="!item.pieConfig.isRose"
      ></RadioBox>

    </div>
    <div class="config-item">
      <span>{{ $t('labelType') }}</span>
      <RadioBox
          v-model="item.pieConfig.position"
          :options="labelTypeSelect"
          :name="'labelTypeSelect'+item.id"></RadioBox>
    </div>
    <section>
      <div class="left-config-item">
        <div class="config-item">
          <span>{{ $t('innerDiameter') }}</span>
          <ProgressBar
              v-model="item.pieConfig.polar.pi"
              :width="175"
              :min="0"
              :max="100"
              :step="0.1"
              unit="%"
          ></ProgressBar>
        </div>
        <div class="config-item">
          <span>{{ $t('roundness') }}</span>
          <ProgressBar
              v-model="item.pieConfig.borderRadius"
              :width="175"
              :min="0"
              :max="60"
              :step="0.1"
              unit="%"
          ></ProgressBar>
        </div>
      </div>
      <div class="right-config-item">


        <div class="config-item">
          <span>{{ $t('gap') }}</span>
          <ProgressBar
              v-model="item.pieConfig.padAngle"
              :width="175"
              :min="0"
              :max="60"
              :step="0.1"
              unit="%"
          ></ProgressBar>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import RadioBox from "../box/RadioBox.vue";
import CheckBox from "../box/CheckBox.vue";
import ProgressBar from "../button/ProgressBar.vue";
import {onBeforeMount, watch} from "vue";
import ColorPoint from "../button/ColorPoint.vue";
import emitter from "../../emitter/emitter.js";
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../../store/OptionConfig.js";
import {buildPolar, labelTypeForPosition, roseTypeSelect} from "../../utils/newArch/Position.js";
import {debounce} from "../../utils/DebounceUtils.js";
import {pieInit} from "../../utils/newArch/Check4Series.js";

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const mapTypeSelect = [
  {
    value: 0,
    label: 'radius',
  },
  {
    value: 1,
    label: 'area'
  }
]

const labelTypeSelect = [
  {
    value: 0,
    label: 'inner'
  },
  {
    value: 1,
    label: 'outer'
  },
]

const {echartsOptions} = storeToRefs(useOptionConfig())

const emitLoadChart = debounce(() => {
  emitter.emit('merge-option')
}, 200)


watch(props.item, (newVal) => {
  pieInit(newVal,echartsOptions)
  emitLoadChart()
})


</script>

<style scoped>
.bar-chart {
  display: grid;
  gap: 20px;

  > section {
    display: flex;
    gap: 20px;
    width: 500px;
    justify-content: space-between;
  }
}

.config-item {
  display: flex;
  gap: 10px;
  align-items: center;
}

span {
  font-weight: bolder;

}

.inactivation {
  cursor: not-allowed;

  span {
    color: var(--inactivation-color);
  }
}

.top-config-item {
  display: flex;
  gap: 20px;


  justify-content: space-between;
  width: 500px;
}

.right-config-item, .left-config-item {
  display: flex;
  gap: 10px;
  flex-direction: column;

  span{
    width: 60px;
    font-size: .8em;
  }

}
</style>
