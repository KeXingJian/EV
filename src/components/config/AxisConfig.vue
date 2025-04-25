<template>
  <div class="axis-config">
    <div class="t">
      <div class="r">
        <div class="config-item">
          <span>轴线:</span>
          <CheckBox v-model="item.show"></CheckBox>
        </div>
        <div class="config-item">
          <span>标线:</span>
          <CheckBox v-model="item.tickLine"></CheckBox>
        </div>
        <div class="config-item">
          <span>割线:</span>
          <CheckBox v-model="item.splitLine"></CheckBox>
        </div>
        <div class="config-item">
          <span>标签:</span>
          <CheckBox v-model="item.labelShow"></CheckBox>
        </div>
        <div class="config-item" >
          <span v-if="type===0">朝左</span>
          <span v-else>朝下</span>
          <SelectButton v-model="item.symbol"></SelectButton>
          <span v-if="type===0">朝右</span>
          <span v-else>朝上</span>
        </div>
        <div class="config-item" v-if="item.G.type===0">
          <span v-if="type===0">靠上</span>
          <span v-else>靠左</span>
          <SelectButton v-model="item.position"></SelectButton>
          <span v-if="type===0">靠下</span>
          <span v-else>靠右</span>
        </div>

      </div>
      <div class="l" >
        <ColorPoint v-model="item.lineColor"><span>轴线:</span></ColorPoint>
        <ColorPoint v-model="item.labelColor"><span>标签:</span></ColorPoint>
        <ColorPoint v-model="item.textColor"><span>轴名称:</span></ColorPoint>
        <div class="config-item">
          <span>单位:</span>
          <InputBox
              text="Text"
              :width="100"
              v-model="item.unit"
          ></InputBox>
        </div>
        <div class="config-item">
          <span>轴名称:</span>
          <InputBox
              text="Text"
              :width="100"
              v-model="item.axisName"
          ></InputBox>
        </div>
      </div>
    </div>

    <div class="b">
      <div class="config-item" v-if="item.G===0">
        <span>偏移量:</span>
        <ProgressBar
            v-model="item.offset"
            :width="267"
            :min="0"
            :max="100"
            :step="1"
            unit=""
        ></ProgressBar>
      </div>
      <div class="config-item" v-if="item.G.type===1 && type===1">
        <span>起始角:</span>
        <ProgressBar
            v-model="item.sa"
            :width="267"
            :min="0"
            :max="360"
            :step="1"
            unit=""
        ></ProgressBar>
      </div>
      <div class="config-item" v-if="item.G.type===1 && type===1">
        <span>结束角:</span>
        <ProgressBar
            v-model="item.ea"
            :width="267"
            :min="0"
            :max="360"
            :step="1"
            unit=""
        ></ProgressBar>
      </div>
    </div>
  </div>
</template>

<script setup>
import CheckBox from "../box/CheckBox.vue";
import InputBox from "../box/InputBox.vue";
import ProgressBar from "../button/ProgressBar.vue";
import ColorPoint from "../button/ColorPoint.vue";
import {onMounted, watch} from "vue";
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../../store/OptionConfig.js";
import emitter from "../../emitter/emitter.js";
import {getPosition, getSymbol} from "../../utils/CheckUtils.js";
import SelectButton from "../button/SelectButton.vue";
const props = defineProps({
  item:{
    type:Object,
    required:true
  },
  type:{
    type: Number,
    required:true
  }
})

const {echartsOptions} = storeToRefs(useOptionConfig())

watch(props.item,(newVal)=>{
  let target = null
  if (newVal.G.type ===0 &&props.type===0){
    target = echartsOptions.value.xAxis.find(i=>i.id===props.item.id)
  }else if (newVal.G.type ===0 && props.type===1){
    target = echartsOptions.value.yAxis.find(i=>i.id===props.item.id)
  }else if (newVal.G.type ===1 && props.type===0){
    target = echartsOptions.value.radiusAxis.find(i=>i.id===props.item.id)
  }else if (newVal.G.type ===1 && props.type===1){
    target = echartsOptions.value.angleAxis.find(i=>i.id===props.item.id)
    target.startAngle = newVal.sa
    target.endAngle = newVal.ea
  }

  target.name = newVal.axisName
  target.nameTextStyle.color = newVal.textColor
  target.axisLabel.show = newVal.labelShow
  target.axisLabel.color = newVal.labelColor
  target.axisLabel.formatter = function(value) {
    return `${value+newVal.unit}`
  }
  target.axisLine.show = newVal.show
  target.axisLine.symbol = getSymbol(newVal.symbol)
  target.axisLine.lineStyle.color = newVal.lineColor
  target.axisTick.show = newVal.tickLine
  target.splitLine.show = newVal.splitLine
  target.position = getPosition(newVal.position,props.type)
  target.inverse = !newVal.symbol
  target.offset = newVal.offset

  console.log('轴更新触发合并',target)
  emitter.emit('merge-option')
},{ deep: false })

onMounted(()=>{
  console.log(props.item)
})
</script>


<style scoped>
.axis-config {
  background-color: var(--2-background-color);
  display: grid;
  gap: 10px;
  padding: 15px 8px;
  position: relative;
}

.axis-config:after{
  content: '';
  width: 100%;
  position: absolute;
  height: 1px;
  border-radius: 1px;
  z-index: 0;
  top: 99%;
  left: 0;
  background: linear-gradient(
      90deg,
      var(--2-background-color) 0%,
      var(--border-color) 50%,
      var(--2-background-color) 100%
  );
}

.config-item {
  display: flex;
  gap: 10px;
  align-items: center;
  flex: 1;
}
.t {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 1fr;
  max-width: 500px;
}

.r, .l {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.l{
  .config-item {
    gap: 20px;
  }
}

span {
  font-weight: bolder;
  width: 53px;
}
</style>
