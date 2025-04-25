<template>
  <div class="bar-chart">
    <div class="top-config-item">
      <div class="config-item">
        <span>显示标签:</span>
        <check-box v-model="item.isLabel"></check-box>
      </div>
      <div class="config-item">
        <span>显示标线:</span>
        <check-box v-model="item.pieConfig.labelLine"></check-box>
      </div>
      <div class="config-item"

      >
        <span
            :style="{
              width:'55px',
           }"
        >玫瑰化:</span>
        <check-box v-model="item.pieConfig.isRose"></check-box>
      </div>
    </div>
    <div class="top-config-item">
      <div class="config-item">
        <span>默认颜色:</span>
        <ColorPoint v-model="item.color"></ColorPoint>
      </div>
      <div class="config-item">
        <span>标签颜色:</span>
        <ColorPoint v-model="item.labelColor"></ColorPoint>
      </div>
    </div>

    <div class="config-item"
         :class="{
          inactivation: !item.pieConfig.isRose }"
    >
      <span>数值映射:</span>
      <RadioBox
          v-model="item.pieConfig.roseType"
          :options="mapTypeSelect"
          :name="'mapTypeSelect'+item.id"
          :inactivation="!item.pieConfig.isRose"
      ></RadioBox>

    </div>
    <div class="config-item">
      <span>标签类型:</span>
      <RadioBox
          v-model="item.pieConfig.position"
          :options="labelTypeSelect"
          :name="'labelTypeSelect'+item.id"></RadioBox>
    </div>
    <section>
      <div class="left-config-item">
        <div class="config-item">
          <span>上:</span>
          <ProgressBar
              v-model="item.pieConfig.pt"
              :width="175"
              :min="0"
              :max="100"
              :step="0.1"
              unit="%"
          ></ProgressBar>
        </div>
        <div class="config-item">
          <span>左:</span>
          <ProgressBar
              v-model="item.pieConfig.pl"
              :width="175"
              :min="0"
              :max="100"
              :step="0.1"
              unit="%"
          ></ProgressBar>
        </div>
        <div class="config-item">
          <span>边角:</span>
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
          <span>内径:</span>
          <ProgressBar
              v-model="item.pieConfig.pi"
              :width="175"
              :min="0"
              :max="100"
              :step="0.1"
              unit="%"
          ></ProgressBar>
        </div>
        <div class="config-item">
          <span>外径:</span>
          <ProgressBar
              v-model="item.pieConfig.po"
              :width="175"
              :min="0"
              :max="100"
              :step="0.1"
              unit="%"
          ></ProgressBar>
        </div>
        <div class="config-item">
          <span>间隙:</span>
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
import {watch} from "vue";
import ColorPoint from "../button/ColorPoint.vue";
import emitter from "../../emitter/emitter.js";
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../../store/OptionConfig.js";
import {labelTypeForPosition, roseTypeSelect} from "../../utils/ChartUtils.js";
import {buildPolar, getPieData} from "../../utils/CheckUtils.js";

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const mapTypeSelect = [
  {
    value: 0,
    label: '半径',
  },
  {
    value: 1,
    label: '面积'
  }
]

const labelTypeSelect = [
  {
    value: 0,
    label: '内嵌'
  },
  {
    value: 1,
    label: '外引'
  },
]

const {echartsOptions} = storeToRefs(useOptionConfig())

watch(props.item, (newVal) => {
  const target = echartsOptions.value.series.find(i => i.id === newVal.id)

  target.label.show = newVal.isLabel
  target.label.color = newVal.labelColor

  target.itemStyle.borderRadius = newVal.pieConfig.borderRadius
  target.padAngle = newVal.pieConfig.padAngle

  target.label.position = labelTypeForPosition[newVal.pieConfig.position]


  const position = buildPolar(
      newVal.pieConfig.pi,
      newVal.pieConfig.po,
      newVal.pieConfig.pl,
      newVal.pieConfig.pt
  )
  target.radius = position.radius
  target.center = position.center


  if (newVal.pieConfig.isRose) target.roseType = roseTypeSelect[newVal.pieConfig.roseType]
  else target.roseType = false

  console.log('系列更新触发合并', echartsOptions.value)
  emitter.emit('merge-option')
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

  span {
    width: 70px;
  }

  justify-content: space-between;
  width: 500px;
}

.right-config-item, .left-config-item {
  display: flex;
  gap: 10px;
  flex-direction: column;
}
</style>
