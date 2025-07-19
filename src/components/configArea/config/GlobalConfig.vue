<template>
  <div class="global-config">
    <div class="t">
      <div class="config-item">
        <span
            style="width: auto"
        >{{ $t('Optimization') }}</span>
        <CheckBox v-model="global.isLarge"></CheckBox>
      </div>
      <div class="config-item">
        <span
            style="width: auto"
        >{{ $t('layering') }}</span>
        <CheckBox v-model="global.isLayer"></CheckBox>
      </div>
      <div class="config-item">
        <span
            style="width: auto"
        >{{ $t('background') }}</span>
        <ColorPoint v-model="global.backGround"></ColorPoint>
      </div>
    </div>
    <div class="m">
      <div class="legend">
        <div class="item">
          <span>{{ $t('legend') }}</span>
          <CheckBox v-model="legend.show"></CheckBox>
          <ColorPoint v-model="legend.color"></ColorPoint>
        </div>

        <div class="item">
          <span>{{ $t('orientation') }}</span>
          <CheckBox v-model="legend.type"></CheckBox>
        </div>
        <div class="item">
          <div class="button-top" @click.stop="showLegendStyle">
            <div class="box">
             <span>
             {{ $t('shape') }}
            </span>
              <span class="option-value">
                {{ $t(currentStyle) }}
            </span>
            </div>
          </div>
        </div>
        <div class="item">
          <span>{{ $t('size') }}</span>
          <ProgressBar
              v-model="legend.fontSize"
              :width="175"
              :min="0"
              :max="100"
              :step="1"
              unit="px"
          ></ProgressBar>
        </div>
        <div class="item">
          <span>{{ $t('weight') }}</span>
          <ProgressBar
              v-model="global.legend.fontWeight"
              :width="175"
              :min="100"
              :max="800"
              :step="100"
              unit=""
          ></ProgressBar>
        </div>

      </div>
      <div class="title">

        <div class="item">
          <span>{{ $t('title') }}</span>
          <CheckBox v-model="title.show"></CheckBox>
          <ColorPoint v-model="title.color"></ColorPoint>
        </div>
        <div class="config-item">
          <span>{{ $t('text') }}</span>
          <input-box
              :width="175"
              text="text"
              v-model="title.text"
          ></input-box>
        </div>
        <div class="item">
          <span>{{ $t('size') }}</span>
          <ProgressBar
              v-model="title.fontSize"
              :width="175"
              :min="0"
              :max="100"
              :step="1"
              unit="px"
          ></ProgressBar>
        </div>
        <div class="item">
          <span>{{ $t('weight') }}</span>

          <ProgressBar
              v-model="title.fontWeight"
              :width="175"
              :min="100"
              :max="800"
              :step="100"
              unit=""
          ></ProgressBar>

        </div>

        <div class="item">
          <span>{{ $t('imageQuality') }}</span>
          <ProgressBar
              v-model="global.pixelRatio"
              :width="175"
              :min="0.5"
              :max="5"
              :step="0.5"
              unit=""
          ></ProgressBar>

        </div>
      </div>
    </div>

    <div class="b">
      <div class="config-item" v-show="global.isLayer">
        <ProgressBarArea default-color="#FF4081"  :map="global.visualMap" v-model="global.visualMap.pieces"></ProgressBarArea>
      </div>

    </div>
  </div>
</template>

<script setup>
import ProgressBar from "../../button/ProgressBar.vue";
import CheckBox from "../../box/CheckBox.vue";
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../../../store/OptionConfig.js";
import {computed, watch} from "vue";
import ColorPoint from "../../button/ColorPoint.vue";
import InputBox from "../../box/InputBox.vue";
import {legendStyleSelect, legendTypeSelect} from "../../../utils/BeautifyUtils.js";
import emitter from "../../../emitter/emitter.js";
import ProgressBarArea from "../../button/ProgressBarArea.vue";
import {debounce} from "../../../utils/DebounceUtils.js";
import {useGlobalConfig} from "../../../store/GlobalConfig.js";

const {echartsOptions} = storeToRefs(useOptionConfig())
const {global} = storeToRefs(useGlobalConfig())

// 防抖处理，避免频繁触发 load-chart
const emitLoadChart = debounce(() => {
  emitter.emit('load-chart');
}, 200);

const showLegendStyle = (event) => {
  emitter.emit('show-options-i18n', {
    x: event.clientX,
    y: event.clientY,
    target: global.value,
    options: legendStyleSelect,
    handle: (index, target) => {
      target.legend.icon = index
    }
  })
}

const currentStyle = computed(() => {
  const target = legendStyleSelect.find(i => i.index === global.value.legend.icon)
  return target.label
})

// 提取配置项为 computed 属性
const title = computed(() => global.value.title)
const legend = computed(() => global.value.legend)
const backGround = computed(() => global.value.backGround)
const visualMap = computed(() => global.value.visualMap)
const pixelRatio = computed(() => global.value.pixelRatio)

// 监听 title 变化
watch(
    title,
    (newTitle) => {
      const titleConfig = echartsOptions.value.graphic.elements[0]

      titleConfig.invisible = !newTitle.show;
      titleConfig.style.text = newTitle.text;
      titleConfig.style.fill = newTitle.color;
      titleConfig.style.fontSize = newTitle.fontSize;
      titleConfig.style.fontWeight = newTitle.fontWeight;

      emitLoadChart();
    },
    { deep: true }
);

// 监听 legend 变化
watch(
    legend,
    (newLegend) => {
      const legendConfig = echartsOptions.value.legend
      legendConfig.show = newLegend.show
      legendConfig.textStyle.fontSize = newLegend.fontSize

      const r = newLegend.fontSize / 12

      legendConfig.itemWidth = 25 * r
      legendConfig.itemHeight = 14 * r

      legendConfig.textStyle.fontWeight = newLegend.fontWeight
      legendConfig.textStyle.color = newLegend.color
      legendConfig.icon = newLegend.icon

      legendConfig.orient = legendTypeSelect[newLegend.type ? 0 : 1]
      emitter.emit('init-legend-area')
      emitLoadChart();
    },
    { deep: true }
);

// 监听 background 变化
watch(
    backGround,
    (newBg) => {
      echartsOptions.value.backgroundColor = newBg;
      emitLoadChart();
    }
);

watch(
    title,
    ()=>{
      echartsOptions.value.dataZoom
    }
)

// 监听 visualMap 变化
watch(
    visualMap,
    (newVisualMap) => {
      if (global.value.isLayer) {
        echartsOptions.value.visualMap = {
          pieces: newVisualMap.pieces,
          dimension: newVisualMap.type ? 0 : 1,
        };
      } else {
        echartsOptions.value.visualMap = undefined;
      }
      emitLoadChart();
    },
    { deep: true }
);

// 监听 pixelRatio 变化
watch(
    pixelRatio,
    (newRatio) => {
      echartsOptions.value.toolbox.feature.saveAsImage.pixelRatio = newRatio;
      emitLoadChart();
    }
);

</script>

<style scoped>
.global-config {
  display: grid;
  gap: 10px;
  padding: 20px 4px;
}

.t,.b {
  display: flex;
  gap: 20px;
  align-items: center;

}

.m {
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 1fr;
  width: 500px;
}

.title, .legend {
  display: flex;
  flex-direction: column;
  gap: 15px;

  > span {
    font-weight: bolder;

  }

  > div span {
    font-size: 15px;
  }
}

.item {
  display: flex;
  gap: 10px;
  align-items: center;
  height: 38px;
}

.config-item {
  display: flex;
  gap: 10px;
  align-items: center;

}

.t span {
  flex: 1;
  white-space: nowrap;
  font-weight: bolder;
}

.b span {
  font-weight: bolder;
}

span {
  font-weight: bolder;
  width:70px;
}

.title {
  span {
    width: 66px;
  }
}

.legend{
  span {
    width: 66px;
  }
}

.box{
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  .option-value{
    color: var(--active-color);
  }

}

.button-top{
  cursor: pointer;
}
</style>
