<template>
  <div class="chart-config">

    <div class="config-item">
      <span>默认颜色</span>
      <div class="button-top" @click.stop="showLegendStyle">
        <div class="box">
          <span :style="{width:'50px'}" class="option-value">{{ $t(currentStyle) }}</span>
        </div>
      </div>
      <ColorPoint v-model="symbolConfig.color"></ColorPoint>
      <span>矢量化</span>
      <check-box v-model="otherConfig.isDirected"></check-box>
    </div>

    <div class="config-item">
      <span>标签</span>
      <CheckBox v-model="labelConfig.isLabel"></CheckBox>
      <ColorPoint v-model="labelConfig.labelColor"></ColorPoint>
      <RadioBox
          v-model="labelConfig.position"
          :options="labelTypeSelect"
          :name="'labelTypeSelect'+item.id"
      ></RadioBox>
    </div>

    <div class="config-item">
      <span>关系</span>
      <CheckBox v-model="edgeLabel.show"></CheckBox>
      <ColorPoint v-model="edgeLabel.color"></ColorPoint>
    </div>

    <div class="config-item">
      <div class="button-top">
        <div class="box">
          <span v-if="weightConfig.canWeightMap">权重映射</span>
          <CheckBox v-if="weightConfig.canWeightMap" v-model="weightConfig.isWeightMap"></CheckBox>
          <ProgressBarRange v-if="weightConfig.isWeightMap " v-model="weightConfig.symbolRange"></ProgressBarRange>
          <ProgressBar
              v-model="weightConfig.symbolSize"
              :width="175"
              :min="0"
              :max="100"
              :step="1"
              unit="px"
              v-else
          ></ProgressBar>
        </div>
      </div>
    </div>


    <div class="config-item" v-if="false">
      <span>颜色集</span>
      <RelationPaletteBox :colors="colorSet"></RelationPaletteBox>
    </div>

  </div>
</template>

<script setup>
import RadioBox from "../box/RadioBox.vue";
import CheckBox from "../box/CheckBox.vue";
import ColorPoint from "../button/ColorPoint.vue";
import ProgressBar from "../button/ProgressBar.vue";
import emitter from "../../emitter/emitter.js";
import {
  relationEdgeLabelPosition, relationEdgeSymbol,
  relationLabelPosition,
  relationStyleSelect
} from "../../utils/newArch/ConstantPool.js";
import {computed, watch} from "vue";
import {useOptionConfig} from "../../store/OptionConfig.js";
import ProgressBarRange from "../button/ProgressBarRange.vue";
import RelationPaletteBox from "../box/RelationPaletteBox.vue";
import {debounce} from "../../utils/DebounceUtils.js";
import {getFieldDetails} from "../../utils/newArch/Check4Series.js";
import {useI18n} from "vue-i18n";
const {t} = useI18n()

const {echartsOptions} = useOptionConfig()

const emitLoadChart = debounce(() => {
  emitter.emit('load-chart');
}, 200)

const props = defineProps({
  item: {
    type: Object,
    required: true,
  }
})

const {item} = props

const tagetSeries = echartsOptions.series.find(i => i.id === item.id)

const labelTypeSelect = [
  {
    value: 0,
    label: 'inner'
  },
  {
    value: 1,
    label: 'left'
  },
  {
    value: 2,
    label: 'right'
  }
]


const showLegendStyle = (event) => {
  emitter.emit('show-options-i18n', {
    x: event.clientX,
    y: event.clientY,
    target: symbolConfig,
    options: relationStyleSelect,
    handle: (index, target) => {
      target.value.symbol = index
    }
  })
}

const currentStyle = computed(() => {
  const target = relationStyleSelect.find((_, index) => index === symbolConfig.value.symbol)
  return target.label
})


// 提取配置项为 computed 属性
const symbolConfig = computed(() => item.symbolConfig)
const weightConfig = computed(() => item.weightConfig)
const edgeLabel = computed(() => item.edgeLabel)
const otherConfig = computed(() => item.otherConfig)
const colorSet = computed(() => item.colorSet)
const labelConfig = computed(() => item.labelConfig)

watch(
    symbolConfig,
    (newVal) => {
      tagetSeries.color = newVal.color
      tagetSeries.symbol = relationStyleSelect[newVal.symbol].label
      tagetSeries.symbolSize = newVal.symbolSize
      emitLoadChart()
    },
    { deep: true }
)

watch(
    labelConfig,
    (newVal) => {

      tagetSeries.label.show = newVal.isLabel
      tagetSeries.label.color = newVal.labelColor
      tagetSeries.label.position = relationLabelPosition[newVal.position]

      emitLoadChart()
    },
    { deep: true }
)

watch(
    edgeLabel,
    (newVal) => {

      tagetSeries.edgeLabel.show = newVal.show
      tagetSeries.edgeLabel.color = newVal.color
      tagetSeries.edgeLabel.position = relationEdgeLabelPosition[newVal.position]
      tagetSeries.lineStyle.color = newVal.color

      emitLoadChart()
    },
    { deep: true }
)

watch(
    weightConfig,
    (newVal) => {

      if (!newVal.canWeightMap) return

      const {isWeightMap} = newVal

      const {max, min} = isWeightMap ? getFieldDetails(4) : {max:0, min:0}
      const [rMin,rMax] = newVal.symbolRange

      tagetSeries.nodes.forEach(i=>{
        i.symbolSize = newVal.isWeightMap && i.weight!==-1 ?
            rMin + (rMax - rMin) * (i.weight - min) / (max - min)
            :
            newVal.symbolSize

      })

      emitLoadChart()

    },
    { deep: true }
)


watch(
    colorSet,
    (newVal) => {
      const toCategoryMap = categoryConfig.value.isCategoryMap && categoryConfig.value.categoryMap !==-1

      if (toCategoryMap){
        tagetSeries.categories.forEach((i,index)=>{
          const length = newVal.length
          i.itemStyle.color = length > 0 ? newVal[index % length] : symbolConfig.value.col
        })

        emitLoadChart()
      }

    },
    { deep: true }
)

watch(
    otherConfig,
    (newVal) => {
      tagetSeries.edgeSymbol = relationEdgeSymbol[newVal.isDirected*1]
      emitLoadChart()
    },
    { deep: true }
)


</script>

<style scoped>
.chart-config {
  display: flex;
  flex-direction: column;
  gap: 10px;
  span{
    width: 64px;
  }
}

.config-item {
  display: flex;
  align-items: center;
  gap: 10px;

  span {
    font-weight: bolder;
  }
}

.inactivation {
  cursor: not-allowed !important;

  span {
    color: var(--inactivation-color);
  }
}

.box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  span{
    text-align: center;
    width: 64px;
  }
  .option-value {
    color: var(--active-color);
  }
}

.button-top {
  cursor: pointer;
}
</style>