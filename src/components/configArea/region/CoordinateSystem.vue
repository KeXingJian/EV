<template>
  <div class="axis-config">

    <div class="t">
      <div class="r">
        <span>{{ $t('horizontal') }}</span>
        <div class="config-item">
          <span>{{ $t('axisLine') }}</span>
          <CheckBox v-model="item.H.show"></CheckBox>
        </div>
        <div class="config-item">
          <span>{{ $t('labelLine') }}</span>
          <CheckBox v-model="item.H.tickLine"></CheckBox>
        </div>
        <div class="config-item">
          <span>{{ $t('splitLine') }}</span>
          <CheckBox v-model="item.H.splitLine"></CheckBox>
        </div>
        <div class="config-item">
          <span>{{ $t('label') }}</span>
          <CheckBox v-model="item.H.labelShow"></CheckBox>
        </div>
        <div class="config-item" >
          <span>{{ $t('toLeft') }}</span>
          <SelectButton v-model="item.H.symbol"></SelectButton>
          <span>{{ $t('toRight') }}</span>
        </div>

        <div class="config-item" v-if="item.type===0">
          <span>{{ $t('stopTop') }}</span>
          <SelectButton v-model="item.H.position"></SelectButton>
          <span>{{ $t('stopBottom') }}</span>
        </div>

        <ColorPoint v-model="item.H.lineColor"><span>{{ $t('axisLine') }}</span></ColorPoint>
        <ColorPoint v-model="item.H.labelColor"><span>{{ $t('label') }}</span></ColorPoint>
        <ColorPoint v-model="item.H.textColor"><span>{{ $t('axisName') }}</span></ColorPoint>
        <div class="config-item">
          <span>{{ $t('unit') }}</span>
          <InputBox
              text="Text"
              :width="100"
              v-model="item.H.unit"
          ></InputBox>
        </div>
        <div class="config-item">
          <span>{{ $t('axisName') }}</span>
          <InputBox
              text="Text"
              :width="100"
              v-model="item.H.axisName"
          ></InputBox>
        </div>
        <div class="config-item" v-if="item.type===0">
          <span>{{ $t('offset') }}</span>
          <ProgressBar
              v-model="item.H.offset"
              :width="175"
              :min="0"
              :max="100"
              :step="1"
              unit=""
          ></ProgressBar>
        </div>
        <div class="config-item" v-if="item.type===1">
          <span>{{ $t('innerDiameter') }}</span>
          <ProgressBar
              v-model="item.polar.pi"
              :width="175"
              :min="0"
              :max="100"
              :step="0.1"
              unit="%"
          ></ProgressBar>
        </div>

      </div>
      <div class="l" >
        <span>{{ $t('vertical') }}</span>
        <div class="config-item">
          <span>{{ $t('axisLine') }}</span>
          <CheckBox v-model="item.V.show"></CheckBox>
        </div>
        <div class="config-item">
          <span>{{ $t('labelLine') }}</span>
          <CheckBox v-model="item.V.tickLine"></CheckBox>
        </div>
        <div class="config-item">
          <span>{{ $t('splitLine') }}</span>
          <CheckBox v-model="item.V.splitLine"></CheckBox>
        </div>
        <div class="config-item">
          <span>{{ $t('label') }}</span>
          <CheckBox v-model="item.V.labelShow"></CheckBox>
        </div>
        <div class="config-item" >
          <span>{{ $t('toBottom') }}</span>
          <SelectButton v-model="item.V.symbol"></SelectButton>
          <span>{{ $t('toTop') }}</span>
        </div>

        <div class="config-item" v-if="item.type===0">
          <span>{{ $t('stopLeft') }}</span>
          <SelectButton v-model="item.V.position"></SelectButton>
          <span>{{ $t('stopRight') }}</span>
        </div>

        <ColorPoint v-model="item.V.lineColor"><span>{{ $t('axisLine') }}</span></ColorPoint>
        <ColorPoint v-model="item.V.labelColor"><span>{{ $t('label') }}</span></ColorPoint>
        <ColorPoint v-model="item.V.textColor"><span>{{ $t('axisName') }}</span></ColorPoint>
        <div class="config-item">
          <span>{{ $t('unit') }}</span>
          <InputBox
              text="Text"
              :width="100"
              v-model="item.V.unit"
          ></InputBox>
        </div>
        <div class="config-item">
          <span>{{ $t('axisName') }}</span>
          <InputBox
              text="Text"
              :width="100"
              v-model="item.V.axisName"
          ></InputBox>
        </div>
        <div class="config-item" v-if="item.type===0">
          <span>{{ $t('offset') }}</span>
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
          <span>{{ $t('startAngle') }}</span>
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
          <span>{{ $t('endAngle') }}</span>
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
import CheckBox from "../../box/CheckBox.vue";
import InputBox from "../../box/InputBox.vue";
import ProgressBar from "../../button/ProgressBar.vue";
import ColorPoint from "../../button/ColorPoint.vue";
import {watch} from "vue";
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../../../store/OptionConfig.js";
import SelectButton from "../../button/SelectButton.vue";
import {buildPolar} from "../../../utils/newArch/Position.js";
import emitter from "../../../emitter/emitter.js";
import {debounce} from "../../../utils/DebounceUtils.js";
import {updatePolar} from "../../../utils/newArch/AxisUtis.js";
const props = defineProps({
  item:{
    type:Object,
    required:true
  },
})


const {echartsOptions} = storeToRefs(useOptionConfig())

const emitLoadChart = debounce(() => {
  emitter.emit('merge-option')
}, 200);

watch(props.item.H,(newVal)=>{
  let target = null
  if (props.item.type===0){
    target = echartsOptions.value.xAxis.find(i=>i.id===props.item.id)
  }else {
    target = echartsOptions.value.radiusAxis.find(i=>i.id===props.item.id)
  }

  updatePolar(target,newVal,0)

  //console.log('轴更新触发合并',target)
  emitLoadChart()

},{ deep: false })

watch(props.item.V,(newVal)=>{
  //console.log(newVal)
  let target = null
  if (props.item.type===0){
    target = echartsOptions.value.yAxis.find(i=>i.id===props.item.id)
  }else {
    target = echartsOptions.value.angleAxis.find(i=>i.id===props.item.id)
    target.startAngle = newVal.sa
    target.endAngle = newVal.ea
  }

  updatePolar(target,newVal,1)

  //console.log('轴更新触发合并',target)
  emitLoadChart()
},{ deep: false })

watch(props.item.polar,(newVal)=>{
  const target = echartsOptions.value.polar.find(i=>i.id===props.item.id)

  const position = buildPolar(
      newVal.po * newVal.pi / 100,
      newVal.po,
      newVal.pl,
      newVal.pt,
  )

  target.radius = position.radius
  target.center = position.center

  //console.log('轴更新触发合并',target)
  emitLoadChart()

},{ deep: false })


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
  height: 4px;
  border-radius: 1px;
  z-index: 0;
  top: 99.8%;
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

  height: 25px;

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



span {
  font-weight: bolder;
  width: 53px;
  font-size: 0.8em;
}

</style>
