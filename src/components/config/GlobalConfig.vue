<template>
  <div class="global-config">
    <div class="t">
      <div class="config-item">
        <span
            style="width: 100px"
        >大量数据优化:</span>
        <CheckBox v-model="global.isLarge"></CheckBox>
      </div>
      <div class="config-item">
        <span
            style="width: 50px"
        >分层化:</span>
        <CheckBox v-model="global.isLayer"></CheckBox>
      </div>
      <div class="config-item" v-if="false">
        <span
            style="width: 60px"
        >svg渲染:</span>
        <CheckBox v-model="global.isSvg"></CheckBox>
      </div>
      <div class="config-item">
        <span
            style="width: 40px"
        >背景:</span>
        <ColorPoint v-model="global.backGround"></ColorPoint>
      </div>
    </div>
    <div class="m">
      <div class="legend">
        <span>图例</span>
        <div class="item">
          <span>颜色:</span>
          <ColorPoint v-model="global.legend.color"></ColorPoint>
        </div>
        <div class="item">
          <span>显示:</span>
          <CheckBox v-model="global.legend.show"></CheckBox>
        </div>
        <div class="item">
          <span>朝向:</span>
          <CheckBox v-model="global.legend.type"></CheckBox>
        </div>
        <div class="item">
          <div class="button-top" @click.stop="showLegendStyle">
            <div class="box">
             <span>
             样式:
            </span>
              <span class="option-value">
                {{ currentStyle }}
            </span>
            </div>
          </div>
        </div>
        <div class="item">
          <span>大小:</span>
          <ProgressBar
              v-model="global.legend.fontSize"
              :width="175"
              :min="0"
              :max="100"
              :step="1"
              unit="px"
          ></ProgressBar>
        </div>
        <div class="item">
          <span>粗细:</span>
          <ProgressBar
              v-model="global.legend.fontWeight"
              :width="175"
              :min="0"
              :max="800"
              :step="100"
              unit=""
          ></ProgressBar>
        </div>
        <div class="item">
          <span>上:</span>
          <ProgressBar
              v-model="global.legend.t"
              :width="175"
              :min="0"
              :max="100"
              :step="1"
              unit=""
          ></ProgressBar>
        </div>
        <div class="item">
          <span>左:</span>
          <ProgressBar
              v-model="global.legend.l"
              :width="175"
              :min="0"
              :max="100"
              :step="1"
              unit=""
          ></ProgressBar>
        </div>
        <div class="item">
          <span>宽:</span>
          <ProgressBar
              v-model="global.legend.w"
              :width="175"
              :min="0"
              :max="100"
              :step="1"
              unit=""
          ></ProgressBar>
        </div>
        <div class="item">
          <span>高:</span>
          <ProgressBar
              v-model="global.legend.h"
              :width="175"
              :min="0"
              :max="100"
              :step="1"
              unit=""
          ></ProgressBar>
        </div>
      </div>
      <div class="font">
        <span>标题</span>
        <div class="item">
          <span>颜色:</span>
          <ColorPoint v-model="global.title.color"></ColorPoint>
        </div>
        <div class="item">
          <span>显示:</span>
          <CheckBox v-model="global.title.show"></CheckBox>
        </div>
        <div class="item">
          <span
          >水平居中:</span>
          <CheckBox v-model="global.title.isJustify"></CheckBox>
        </div>
        <div class="item">
          <span>垂直居中:</span>
          <CheckBox v-model="global.title.isAlign"></CheckBox>
        </div>
        <div class="config-item">
          <span>文本:</span>
          <input-box
              :width="175"
              text="text"
              v-model="global.title.text"
          ></input-box>
        </div>
        <div class="item">
          <span>大小:</span>
          <ProgressBar
              v-model="global.title.fontSize"
              :width="175"
              :min="0"
              :max="100"
              :step="1"
              unit="px"
          ></ProgressBar>
        </div>
        <div class="item">
          <span>粗细:</span>

          <ProgressBar
              v-model="global.title.fontWeight"
              :width="175"
              :min="0"
              :max="800"
              :step="100"
              unit=""
          ></ProgressBar>

        </div>
        <div class="item">
          <span>上:</span>
          <ProgressBar
              v-model="global.title.t"
              :width="175"
              :min="0"
              :max="100"
              :step="1"
              unit=""
          ></ProgressBar>

        </div>
        <div class="item">
          <span>左:</span>
          <ProgressBar
              v-model="global.title.l"
              :width="175"
              :min="0"
              :max="100"
              :step="1"
              unit=""
          ></ProgressBar>
        </div>
        <div class="item">
          <span>图片质量:</span>
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
import ProgressBar from "../button/ProgressBar.vue";
import CheckBox from "../box/CheckBox.vue";
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../../store/OptionConfig.js";
import {computed, watch} from "vue";
import ColorPoint from "../button/ColorPoint.vue";
import InputBox from "../box/InputBox.vue";
import {legendStyleSelect, legendTypeSelect} from "../../utils/BeautifyUtils.js";
import emitter from "../../emitter/emitter.js";
import ProgressBarArea from "../button/ProgressBarArea.vue";

const {global, echartsOptions} = storeToRefs(useOptionConfig())

const showLegendStyle = (event) => {
  emitter.emit('show-options', {
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

watch(global, (nweVal) => {

  echartsOptions.value.large = nweVal.isLarge


  if (nweVal.title.isJustify) echartsOptions.value.title[0].left = 'center'
  else echartsOptions.value.title[0].left = nweVal.title.l + '%'

  if (nweVal.title.isAlign) echartsOptions.value.title[0].top = 'center'
  else echartsOptions.value.title[0].top = nweVal.title.t + '%'

  echartsOptions.value.title[0].text = nweVal.title.text
  echartsOptions.value.title[0].show = nweVal.title.show

  echartsOptions.value.title[0].textStyle.color = nweVal.title.color
  echartsOptions.value.title[0].textStyle.fontSize = nweVal.title.fontSize
  echartsOptions.value.title[0].textStyle.fontWeight = nweVal.title.fontWeight

  echartsOptions.value.legend.show = nweVal.legend.show
  echartsOptions.value.legend.top = nweVal.legend.t + '%'
  echartsOptions.value.legend.left = nweVal.legend.l + '%'
  echartsOptions.value.legend.orient = legendTypeSelect[nweVal.legend.type ? 0 : 1]
  echartsOptions.value.legend.textStyle.fontSize = nweVal.legend.fontSize
  echartsOptions.value.legend.textStyle.fontWeight = nweVal.legend.fontWeight
  echartsOptions.value.legend.textStyle.color = nweVal.legend.color
  echartsOptions.value.legend.icon = nweVal.legend.icon
  echartsOptions.value.legend.itemWidth = nweVal.legend.w
  echartsOptions.value.legend.itemHeight = nweVal.legend.h
  echartsOptions.value.toolbox.feature.saveAsImage.pixelRatio = nweVal.pixelRatio


  echartsOptions.value.backgroundColor = nweVal.backGround


  if (nweVal.isLayer){
    echartsOptions.value.visualMap = {
      pieces: nweVal.visualMap.pieces,
      dimension: 1
    }
  }else {
    echartsOptions.value.visualMap = undefined
  }


  emitter.emit('load-chart')

}, {deep: true})
</script>

<style scoped>
.global-config {
  background-color: var(--2-background-color);
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

.font, .legend {
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
  height: 35px;
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
  width: 38px;
}

.font {
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

  .option-value{
    width: 56px;
  }
}

.button-top{
  cursor: pointer;
}
</style>
