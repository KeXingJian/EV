<template>
  <div class="axis-config">
    <div class="b">
      <div class="left">
        <span>边距</span>
        <div class="config-item" v-if="item.type===0">
          <span>上:</span>
          <ProgressBar
              v-model="item.grid.t"
              :width="175"
              :min="0"
              :max="100"
              :step="0.1"
              unit="%"
          ></ProgressBar>
        </div>
        <div class="config-item" v-if="item.type===0">
          <span>左:</span>
          <ProgressBar
              v-model="item.grid.l"
              :width="175"
              :min="0"
              :max="100"
              :step="0.1"
              unit="%"
          ></ProgressBar>
        </div>
        <div class="config-item" v-if="item.type===1">
          <span>上:</span>
          <ProgressBar
              v-model="item.polar.pt"
              :width="175"
              :min="0"
              :max="100"
              :step="0.1"
              unit="%"
          ></ProgressBar>
        </div>
        <div class="config-item" v-if="item.type===1">
          <span>左:</span>
          <ProgressBar
              v-model="item.polar.pl"
              :width="175"
              :min="0"
              :max="100"
              :step="0.1"
              unit="%"
          ></ProgressBar>
        </div>

      </div>
      <div class="right">
        <span>大小</span>
        <div class="config-item" v-if="item.type===0">
          <span>宽:</span>
          <ProgressBar
              v-model="item.grid.w"
              :width="175"
              :min="0"
              :max="100"
              :step="0.1"
              unit="%"
          ></ProgressBar>
        </div>
        <div class="config-item" v-if="item.type===0">
          <span>高:</span>
          <ProgressBar
              v-model="item.grid.h"
              :width="175"
              :min="0"
              :max="100"
              :step="0.1"
              unit="%"
          ></ProgressBar>
        </div>

        <div class="config-item" v-if="item.type===1">
          <span>内径:</span>
          <ProgressBar
              v-model="item.polar.pi"
              :width="175"
              :min="0"
              :max="100"
              :step="0.1"
              unit="%"
          ></ProgressBar>
        </div>
        <div class="config-item" v-if="item.type===1">
          <span>外径:</span>
          <ProgressBar
              v-model="item.polar.po"
              :width="175"
              :min="0"
              :max="100"
              :step="0.1"
              unit="%"
          ></ProgressBar>
        </div>
      </div>
    </div>
    <div class="t">
      <div class="r">
        <span>横轴</span>
        <div class="config-item">
          <span>轴线:</span>
          <CheckBox v-model="item.H.show"></CheckBox>
        </div>
        <div class="config-item">
          <span>标线:</span>
          <CheckBox v-model="item.H.tickLine"></CheckBox>
        </div>
        <div class="config-item">
          <span>割线:</span>
          <CheckBox v-model="item.H.splitLine"></CheckBox>
        </div>
        <div class="config-item">
          <span>标签:</span>
          <CheckBox v-model="item.H.labelShow"></CheckBox>
        </div>
        <div class="config-item" >
          <span >朝左</span>
          <SelectButton v-model="item.H.symbol"></SelectButton>
          <span>朝右</span>
        </div>

        <div class="config-item" v-if="item.type===0">
          <span >靠上</span>
          <SelectButton v-model="item.H.position"></SelectButton>
          <span >靠下</span>
        </div>

        <ColorPoint v-model="item.H.lineColor"><span>轴线:</span></ColorPoint>
        <ColorPoint v-model="item.H.labelColor"><span>标签:</span></ColorPoint>
        <ColorPoint v-model="item.H.textColor"><span>轴名称:</span></ColorPoint>
        <div class="config-item">
          <span>单位:</span>
          <InputBox
              text="Text"
              :width="100"
              v-model="item.H.unit"
          ></InputBox>
        </div>
        <div class="config-item">
          <span>轴名称:</span>
          <InputBox
              text="Text"
              :width="100"
              v-model="item.H.axisName"
          ></InputBox>
        </div>
        <div class="config-item" v-if="item.type===0">
          <span>偏移量:</span>
          <ProgressBar
              v-model="item.H.offset"
              :width="175"
              :min="0"
              :max="100"
              :step="1"
              unit=""
          ></ProgressBar>
        </div>

      </div>
      <div class="l" >
        <span>纵轴</span>
        <div class="config-item">
          <span>轴线:</span>
          <CheckBox v-model="item.V.show"></CheckBox>
        </div>
        <div class="config-item">
          <span>标线:</span>
          <CheckBox v-model="item.V.tickLine"></CheckBox>
        </div>
        <div class="config-item">
          <span>割线:</span>
          <CheckBox v-model="item.V.splitLine"></CheckBox>
        </div>
        <div class="config-item">
          <span>标签:</span>
          <CheckBox v-model="item.V.labelShow"></CheckBox>
        </div>
        <div class="config-item" >
          <span >朝下</span>
          <SelectButton v-model="item.V.symbol"></SelectButton>
          <span>朝上</span>
        </div>

        <div class="config-item" v-if="item.type===0">
          <span >靠左</span>
          <SelectButton v-model="item.V.position"></SelectButton>
          <span >靠右</span>
        </div>

        <ColorPoint v-model="item.V.lineColor"><span>轴线:</span></ColorPoint>
        <ColorPoint v-model="item.V.labelColor"><span>标签:</span></ColorPoint>
        <ColorPoint v-model="item.V.textColor"><span>轴名称:</span></ColorPoint>
        <div class="config-item">
          <span>单位:</span>
          <InputBox
              text="Text"
              :width="100"
              v-model="item.V.unit"
          ></InputBox>
        </div>
        <div class="config-item">
          <span>轴名称:</span>
          <InputBox
              text="Text"
              :width="100"
              v-model="item.V.axisName"
          ></InputBox>
        </div>
        <div class="config-item" v-if="item.type===0">
          <span>偏移量:</span>
          <ProgressBar
              v-model="item.V.offset"
              :width="175"
              :min="0"
              :max="100"
              :step="1"
              unit=""
          ></ProgressBar>
        </div>
        <div class="config-item" v-if="item.type===1">
          <span>起始角:</span>
          <ProgressBar
              v-model="item.V.sa"
              :width="175"
              :min="0"
              :max="360"
              :step="1"
              unit=""
          ></ProgressBar>
        </div>
        <div class="config-item" v-if="item.type===1">
          <span>结束角:</span>
          <ProgressBar
              v-model="item.V.ea"
              :width="175"
              :min="0"
              :max="360"
              :step="1"
              unit=""
          ></ProgressBar>
        </div>

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
import SelectButton from "../button/SelectButton.vue";
import {buildGrid, buildPolar, getPosition, getSymbol} from "../../utils/newArch/Position.js";
import emitter from "../../emitter/emitter.js";
const props = defineProps({
  item:{
    type:Object,
    required:true
  },
})

const {echartsOptions} = storeToRefs(useOptionConfig())

watch(props.item.H,(newVal)=>{
  let target = null
  if (props.item.type===0){
    target = echartsOptions.value.xAxis.find(i=>i.id===props.item.id)
  }else {
    target = echartsOptions.value.radiusAxis.find(i=>i.id===props.item.id)
  }

  update(target,newVal,0)

  console.log('轴更新触发合并',target)
  emitter.emit('merge-option')

},{ deep: false })

watch(props.item.V,(newVal)=>{
  console.log(newVal)
  let target = null
  if (props.item.type===0){
    target = echartsOptions.value.yAxis.find(i=>i.id===props.item.id)
  }else {
    target = echartsOptions.value.angleAxis.find(i=>i.id===props.item.id)
    target.startAngle = newVal.sa
    target.endAngle = newVal.ea
  }

  update(target,newVal,1)

  console.log('轴更新触发合并',target)
  emitter.emit('merge-option')
},{ deep: false })


watch(props.item.grid,(newVal)=>{
  const target = echartsOptions.value.grid.find(i=>i.id===props.item.id)
  const position = buildGrid(
      newVal.t,
      newVal.b,
      newVal.l,
      newVal.r,
      newVal.w,
      newVal.h,
  )
  target.top = position.top
  target.bottom = position.bottom
  target.left = position.left
  target.right = position.right
  target.width = position.width
  target.height = position.height

  console.log('轴更新触发合并',target)
  emitter.emit('merge-option')

},{ deep: false })

watch(props.item.polar,(newVal)=>{
  const target = echartsOptions.value.polar.find(i=>i.id===props.item.id)

  const position = buildPolar(
      newVal.pi,
      newVal.po,
      newVal.pl,
      newVal.pt,
  )

  target.radius = position.radius
  target.center = position.center

  console.log('轴更新触发合并',target)
  emitter.emit('merge-option')

},{ deep: false })

const update = (target,newVal,type)=>{
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
  target.position = getPosition(newVal.position,type)
  target.inverse = !newVal.symbol
  target.offset = newVal.offset

  console.log('轴更新触发合并',target)
  emitter.emit('merge-option')
}

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
.t,.b {
  display: flex;
  gap: 20px;
  grid-template-columns: 1fr 1fr;
  max-width: 500px;
  justify-content: space-between;
}

.r, .l,.left,.right {
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
