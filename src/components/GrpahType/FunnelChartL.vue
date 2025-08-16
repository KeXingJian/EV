<template>
  <div class="bar-chart">
    <div class="top-config-item">

      <div class="config-item">
        <span>{{ $t('default') }}</span>
        <ColorPoint v-model="item.color"></ColorPoint>
      </div>
    </div>
    <div class="top-config-item">
      <div class="config-item">
        <span>{{ $t('label') }}</span>
        <ColorPoint v-model="item.labelColor"></ColorPoint>
      </div>
      <div class="config-item">

        <check-box v-model="item.isLabel"></check-box>
      </div>
      <RadioBox
          v-model="item.funnelConfig.labelPosition"
          :options="labelPosition"
          :name="'labelPosition'+item.id"
      ></RadioBox>
    </div>


    <div class="config-item">
      <span>{{ $t('stop') }}</span>
      <RadioBox
          v-model="item.funnelConfig.align"
          :options="stopType"
          :name="'stopType'+item.id"></RadioBox>
    </div>
    <div class="config-item">
      <span>{{ $t('sort') }}</span>
      <RadioBox
          v-model="item.funnelConfig.sort"
          :options="sortType"
          :name="'sortType'+item.id"></RadioBox>
    </div>

    <section>
      <div class="left-config-item">
        <div class="config-item">
          <span>{{ $t('gap') }}</span>
          <ProgressBar
              v-model="item.funnelConfig.gap"
              :width="175"
              :min="0"
              :max="100"
              :step="0.1"
              unit="%"
          ></ProgressBar>
        </div>
      </div>
      <div class="right-config-item">


      </div>
    </section>
  </div>
</template>

<script setup>
import RadioBox from "../box/RadioBox.vue";
import CheckBox from "../box/CheckBox.vue";
import ProgressBar from "../button/ProgressBar.vue";
import { watch} from "vue";
import ColorPoint from "../button/ColorPoint.vue";
import emitter from "../../emitter/emitter.js";
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../../store/OptionConfig.js";
import { funnelInit, } from "../../utils/newArch/Check4Series.js";
import {debounce} from "../../utils/DebounceUtils.js";

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const labelPosition = [
  {
    value: 0,
    label: 'left',
  },
  {
    value: 1,
    label: 'Middle'
  },
  {
    value: 2,
    label: 'right'
  }
]

const stopType = [
  {
    value: 0,
    label: 'left',
  },
  {
    value: 1,
    label: 'Middle'
  },
  {
    value: 2,
    label: 'right'
  }
]

const sortType = [
  {
    value: 0,
    label: 'asc',
  },
  {
    value: 1,
    label: 'none'
  },
  {
    value: 2,
    label: 'desc'
  }
]

const {echartsOptions} = useOptionConfig()

const emitLoadChart = debounce(() => {
  emitter.emit('merge-option')
}, 200);


watch(props.item, (newVal) => {
  funnelInit(newVal,echartsOptions)
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

    span {
      width: 38px;
    }

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


  width: 500px;
}

.right-config-item, .left-config-item {
  display: flex;
  gap: 10px;
  flex-direction: column;
}
</style>
