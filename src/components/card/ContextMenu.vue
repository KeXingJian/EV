<template>
  <div class="top-div" v-show="isShow || isShowE"    ref="draggableCard">
    <div class="flow-l" >
      <Drag @mousedown.stop="startDrag"></Drag>
    </div>

    <div class="flow">
      <CloseButton  @click="cleanAll"></CloseButton>
    </div>
    <div class="node" v-if="isShow">
      <div class="config-item top">
        <span>节点编辑</span>
      </div>
      <div class="config-item tow">
        <ColorPoint v-model="color"></ColorPoint>
        <AddButton @click="toAdd"></AddButton>
        <ConnectionButton @click="toConnect" v-if="isDouble"></ConnectionButton>
        <span @click.stop="showLegendStyle" class="option-value">{{ $t(currentStyle) }}</span>
        <DeleteButton @click="toDelete"></DeleteButton>
      </div>
      <div class="config-item top">
        <ProgressBar
            v-model="currentSize"
            :width="235"
            :min="0"
            :max="100"
            :step="1"
            unit=""
        ></ProgressBar>
      </div>
      <div class="config-item" v-if="!selected" :style="{height: '40px'}">
        <form v-if="isEditNode" @submit.prevent="toSaveName" class="form" :style="{width: `150px`}">
          <input
              class="input"
              placeholder="rename"
              required=""
              type="text"
              v-model="currentName"
          >
          <span class="input-border"></span>
        </form>
        <span v-if="!isEditNode">{{ currentName }}</span>
        <EditButton v-if="!isEditNode" @click="isEditNode=true"></EditButton>
        <CheckButton v-if="isEditNode" @click="toSaveName"></CheckButton>
        <CloseButton v-if="isEditNode" @click="toCancel"></CloseButton>
      </div>
    </div>
    <div class="node" v-if="isShowE">
      <div class="config-item top">
        <span>关系编辑</span>
      </div>


      <div class="config-item" :style="{height: '40px'}">
        <ColorPoint v-model="colorE"></ColorPoint>
        <DeleteButton @click="toDeleteE"></DeleteButton>
        <div v-if="!selectedE">
          <form v-if="isEditEdge" @submit.prevent="toSaveNameE" class="form" :style="{width: `150px`}">
            <input
                class="input"
                placeholder="rename"
                required=""
                type="text"
                v-model="currentNameE"
            >
            <span class="input-border"></span>
          </form>
          <span v-if="!isEditEdge">{{ currentNameE }}</span>
          <EditButton v-if="!isEditEdge" @click="isEditEdge=true"></EditButton>
          <CheckButton v-if="isEditEdge" @click="toSaveNameE"></CheckButton>
          <CloseButton v-if="isEditEdge" @click="toCancelE"></CloseButton>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import {useOptionConfig} from "../../store/OptionConfig.js";
import AddButton from "../svg/AddButton.vue";
import DeleteButton from "../svg/DeleteButton.vue";
import ColorPoint from "../button/ColorPoint.vue";
import {ref, watch} from "vue";
import EditButton from "../svg/EditButton.vue";
import CloseButton from "../svg/CloseButton.vue";
import CheckButton from "../svg/CheckButton.vue";
import ConnectionButton from "../button/ConnectionButton.vue";
import emitter from "../../emitter/emitter.js";
import ProgressBar from "../button/ProgressBar.vue";
import {getFieldDetails} from "../../utils/newArch/Check4Series.js";
import {v4 as uuidv4} from "uuid";
import {storeToRefs} from "pinia";
import {useI18n} from "vue-i18n";
import {relationStyleSelect} from "../../utils/newArch/ConstantPool.js";
import Drag from "../svg/Drag.vue";
import {debounce} from "../../utils/DebounceUtils.js";

const {t} = useI18n()

const {
  Ss,echartsOptions,
  chartInstance,selects,
  selectsE
} = useOptionConfig()

const {
  nodeIndex
} = storeToRefs(useOptionConfig())

const targetSeriesMap = Ss.find(i=>i.type === 5)
const {symbolConfig,weightConfig,edgeLabel} = targetSeriesMap

const targetSeries = echartsOptions.series.find(x=>x.type === 'graph')

const showLegendStyle = (event) => {
  emitter.emit('show-options-i18n', {
    x: event.clientX,
    y: event.clientY,
    target: cache,
    options: relationStyleSelect,
    handle: (index, target) => {
      target.forEach(i=> {
        i.symbol = relationStyleSelect[index].label
      })
      emitter.emit('merge-option')
    }
  })
}

const currentStyle = ref(relationStyleSelect[symbolConfig.symbol].label)

const selected = ref(false)
const isShow =ref(false)
const isEditNode = ref(false)
const currentName = ref('示例')
let beforeName = '示例'
const currentSize = ref(40)

const color = ref(symbolConfig.color)

const isDouble = ref(false)

let cache = null

const toSaveName = ()=>{

  if (currentName.value===''){
    emitter.emit("toast", t('节点名不能为空'))
  }

  const isSole = targetSeries.nodes.find(i=>i.name === currentName.value)
  if(isSole) emitter.emit("toast", t('节点名重复不予以修改'))
  else {

    targetSeries.edges.forEach(i=>{
      if (cache[0].name===i.source) i.source = currentName.value
      if (cache[0].name===i.target) i.target = currentName.value
    })
    beforeName = currentName.value
    cache[0].name = currentName.value
    emitter.emit('merge-option')

    toCancel()
    chartInstance.dispatchAction({
      type: 'select',
      seriesId: targetSeries.id,
      dataIndex: selects[0]
    })
  }
}

const toAdd = ()=>{
  const newName = '节点'+(++nodeIndex.value)

  cache.forEach(node=>{

    targetSeries.edges.push({
      source: newName,
      target: node.name,
      label:{
        formatter: '新关系',
      },
    })

  })

  const position = {
    x: cache[0].x + 20,
    y: cache[0].y + 20,
  }

  targetSeries.nodes.push({
    name: newName,
    symbolSize: weightConfig.symbolSize,
    itemStyle:{},
    ...position
  })

  cleanAllN()
  emitter.emit('merge-option')
}

const toConnect = ()=>{

  targetSeries.edges.push({
    source: cache[0].name,
    target: cache[1].name,
    label:{
      formatter: '新关系',
    },
  })

  emitter.emit('merge-option')
}

const toDelete = ()=>{
  targetSeries.nodes = targetSeries.nodes.filter((_,index)=> !selects.includes(index))
  cleanAllN()
  selects.length = 0
  emitter.emit('merge-option')
}

const toCancel = ()=>{
  isEditNode.value = false
  currentName.value = beforeName
}

const cleanAllN = ()=>{
  chartInstance.dispatchAction({
    type: 'unselect',
    seriesId: targetSeries.id,
    dataIndex: selects
  })
  selects.length = 0
}

const cleanAll = ()=>{
  chartInstance.dispatchAction({
    type: 'unselect',
    seriesId: targetSeries.id,
    dataIndex: selects
  })

  if (selects.length===0){
    emitter.emit("toast", t('无法取消关系选择,请手动取消'))
  }

  selects.length = 0
}

watch(color, (newVal)=>{

  cache.forEach((item)=> {
    item.itemStyle.color = newVal
  })
  emitter.emit('merge-option')
})

watch(currentSize, (newVal) => {
  debounce(()=>{
    cache.forEach(item=> item.symbolSize = newVal)
    emitter.emit('merge-option')
  },100)()

})

watch(selects, (newVal) => {
  const length = newVal.length

  cache = length > 0 ?
      targetSeries.nodes.filter((_,index)=> newVal.includes(index))
      :
      []

  isDouble.value = length === 2
  selected.value = !(newVal.length === 0 || newVal.length===1)
  isShow.value = newVal.length > 0

  currentName.value = length===1 ? cache[0].name : ''
  beforeName = length===1 ? cache[0].name : ''

  currentStyle.value = relationStyleSelect[symbolConfig.symbol].label

  //console.log(cache)
})

//edge
const currentNameE = ref('示例')
let beforeNameE = '示例'
const selectedE = ref(false)
const isEditEdge = ref(false)
const isShowE = ref(false)

const colorE = ref(edgeLabel.color)

let cacheE = null

const toSaveNameE = ()=>{

  if (currentNameE.value===''){
    emitter.emit("toast", t('不能为空,至少输入空格'))
  }

  beforeNameE =  currentNameE.value
  cacheE[0].label.formatter = currentNameE.value

  isEditEdge.value = false
  emitter.emit('merge-option')
}

const toCancelE = ()=>{
  isEditEdge.value = false
  currentNameE.value = beforeNameE
}

const toDeleteE = ()=>{
  targetSeries.edges = targetSeries
      .edges
      .filter((_,index)=> !selectsE.includes(index))
  selectsE.length = 0
  selects.length = 0
  emitter.emit('merge-option')
}

watch(colorE,
    (newVal) => {
      cacheE.forEach((item) => {
        item.label.color = newVal
        item.lineStyle.color = newVal
      })
      emitter.emit('merge-option')
    }
)

watch(selectsE, (newVal) => {
  const length = newVal.length

  cacheE = length > 0 ?
      targetSeries.edges.filter((_,index)=> newVal.includes(index))
      :
      []

  selectedE.value = !(length===0 || length===1)

  isShowE.value = length > 0

  currentNameE.value = length===1 ? cacheE[0].label.formatter : ''
  beforeNameE =  length===1 ? cacheE[0].label.formatter : ''

  //console.log(newVal)
})

// 拖动相关
const draggableCard = ref()
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })

// 拖动方法
const startDrag = (event) => {
  if (!draggableCard.value) return

  const rect = draggableCard.value.getBoundingClientRect()
  dragOffset.value.x = event.clientX - rect.left
  dragOffset.value.y = event.clientY - rect.top
  isDragging.value = true

  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

const onDrag = (event) => {
  if (!isDragging.value || !draggableCard.value) return

  const x = event.clientX - dragOffset.value.x
  const y = event.clientY - dragOffset.value.y

  draggableCard.value.style.left = `${x}px`
  draggableCard.value.style.top = `${y}px`
  draggableCard.value.style.right = 'auto' // 清除原有的 right 样式
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}
</script>
<style scoped>
.top-div {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  position: fixed;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 255px;
  span{
    font-weight: bolder;
    line-height: 1.1;
    white-space: nowrap;
  }
  background: var(--1-background-color);
  z-index: 99;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid var(--2-background-color);
  right: 0;
  top: 80px;

}

.node{
  display: flex;
  flex-direction: column;
  gap: 10px;

}

.flow{
  position: absolute;
  right: 4px;
  top: 4px;
}

.flow-l{
  position: absolute;
  left: 4px;
  top: 4px;
  cursor: move;
}

.top{
  justify-content:center;
  span{
    font-size: 18px;
  }
}

.config-item{
  display: flex;
  align-items: center;
  gap: 10px;
  >div{
    display: flex;
    align-items: center;
    gap: 10px;
  }
}

.form {
  --border-height: 1px;
  --border-before-color: rgba(221, 221, 221, 0.39);
  --border-after-color: #5891ff;
  --input-hovered-color: #4985e01f;
  position: relative;
  width: 0;
  display: flex;
  align-items: center;
}

.input {
  color: var(--font-color);
  font-size: 0.9rem;
  background-color: transparent;
  width: 100%;
  box-sizing: border-box;
  padding-inline: 0.5em;
  padding-block: 0.7em;
  border: none;
  border-bottom: var(--border-height) solid var(--border-before-color);
  transition: 300ms ease-in-out;
}

.input-border {
  position: absolute;
  background: var(--border-after-color);
  width: 0 !important;
  height: 2px;
  bottom: 0;
  left: 0;
  transition: 0.3s;
}

input:hover {
  background: var(--input-hovered-color);
}

input:focus {
  outline: none;
}

/* here is code of animated border */
input:focus ~ .input-border {
  width: 100% !important;
}

.option-value {
  color: var(--active-color);
  cursor: pointer;
}
</style>