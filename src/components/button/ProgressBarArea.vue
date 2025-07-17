<template>
  <div class="container">
    <div>
      <div class="config-item">
        <span>精度:</span>
        <ProgressBar
            v-model="precision"
            :width="40"
            :min="0"
            :max="10"
            :step="1"
        ></ProgressBar>
      </div>
      <div class="config-item">
        <span :style="{
          width:'55px'
        }">最小值:</span>
        <InputForNumber text="min" :width="100" v-model="map.min">
        </InputForNumber>
      </div>
      <div class="config-item">
        <span :style="{
          width:'55px'
        }">最大值:</span>
        <InputForNumber text="Max" :width="100" v-model="map.max">
        </InputForNumber>
      </div>
    </div>

    <div>
      <div class="config-item">
        <span>等分:</span>
        <CheckBox v-model="isEq"></CheckBox>
      </div>
      <div class="config-item">
        <span>(x,y]</span>
        <SelectButton v-model="map.mode"></SelectButton>
        <span>[x,y)</span>
      </div>
      <div class="config-item">
        <span>纵轴</span>
        <SelectButton v-model="map.type"></SelectButton>
        <span>横轴</span>
      </div>
      <div class="options">
        <AddButton @click="addBreakpointBefore($event)">添加分界点</AddButton>
        <DeleteButton @click="removeBreakpoint">删除分界点</DeleteButton>
      </div>
    </div>
    <div>

      <!-- 进度条容器 -->
      <div class="progress-bar" ref="progressBar">
        <!-- 颜色分段 -->
        <div
            v-for="(segment, index) in colorSegments"
            :key="index"
            class="color-segment"
            @click.stop="changeSegmentColor(index, $event)"
            :style="{
          left: segment.start + '%',
          width: (segment.end - segment.start) + '%',
          backgroundColor: segment.color
        }"></div>

        <!-- 断点组件 -->
        <div
            v-for="(bp, index) in sortedBreakpoints"
            :key="index"
            class="breakpoint"
            :style="{
            left: bp.position + '%',
          }"
            @mousedown="startDragging(index, $event)"
        >
          <div v-if="index === draggingIndex" id="range-thumb" ref="rangeThumb" class="range__thumb">
            <div ref="rangeValue" class="range__value">
              <span class="range__value-number">{{ calcActualValue(bp.position) }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import {ref, reactive, computed, onMounted, watch} from 'vue';
import DeleteButton from "../svg/DeleteButton.vue";
import AddButton from "../svg/AddButton.vue";
import CheckBox from "../box/CheckBox.vue";
import emitter from "../../emitter/emitter.js";
import SelectButton from "./SelectButton.vue";
import ProgressBar from "./ProgressBar.vue";
import InputForNumber from "../box/InputForNumber.vue";

const props = defineProps({
  defaultColor: {
    type: String,
    required: true
  },
  min: {type: Object},
  max: {type: Object},
  map: {type: Object},

  modelValue: Array
})

const emit = defineEmits(['update:modelValue']);

const isEq = ref(false)
const precision = ref(0)
// 响应式引用
const progressBar = ref(null);
const draggingIndex = ref(null);


const breakpoints = reactive([
  {position: 0, color: props.defaultColor},
  {position: 100, color: '#4ECDC4'}
]);


const colorSegments = computed(() => {
  return sortedBreakpoints.value.slice(0, -1).map((bp, i) => ({
    start: bp.position,
    end: sortedBreakpoints.value[i + 1].position,
    color: bp.color
  }));
});

// 计算属性：保持断点排序
const sortedBreakpoints = computed(() => {
  return [...breakpoints].sort((a, b) => a.position - b.position);
});

// 生成v-model数据
const modelValue = computed(() => {
  return sortedBreakpoints.value.slice(0, -1).map((bp, index) => {
    const current = calcActualValue(bp.position);
    const next = calcActualValue(sortedBreakpoints.value[index + 1].position);

    return props.map.mode
        ? {gte: current, lt: next, color: bp.color}
        : {gt: current, lte: next, color: bp.color};
  })
})

// 开始拖拽
const startDragging = (index, e) => {
  if (index === 0 || index === breakpoints.length - 1 || isEq.value) return
  draggingIndex.value = index;
  const mouseMoveHandler = (e) => {
    if (draggingIndex.value === null) return;

    const rect = progressBar.value.getBoundingClientRect();
    let newPosition = ((e.clientX - rect.left) / rect.width) * 100;
    newPosition = Math.max(0, Math.min(100, newPosition));

    // 限制在相邻断点之间
    if (draggingIndex.value > 0) {
      newPosition = Math.max(sortedBreakpoints.value[draggingIndex.value - 1].position, newPosition);
    }
    if (draggingIndex.value < sortedBreakpoints.value.length - 1) {
      newPosition = Math.min(sortedBreakpoints.value[draggingIndex.value + 1].position, newPosition);
    }

    sortedBreakpoints.value[draggingIndex.value].position = newPosition;

  };

  const mouseUpHandler = () => {
    draggingIndex.value = null;
    window.removeEventListener('mousemove', mouseMoveHandler);
    window.removeEventListener('mouseup', mouseUpHandler);
  };

  window.addEventListener('mousemove', mouseMoveHandler);
  window.addEventListener('mouseup', mouseUpHandler);
};

// 在最后两个断点中间添加新断点
const addBreakpointBefore = (event) => {
  emitter.emit('show-menu-color',
      {
        x: event.clientX,
        y: event.clientY,
        handle: (color) => {
          addBreakpoint(color)
        }
      })
};

// 修改后的添加断点方法
const addBreakpoint = (color) => {
  const middlePoints = breakpoints.slice(1, -1);
  const newCount = middlePoints.length + 1;
  const positions = calculateEqualPositions(newCount);

  // 保留原有颜色顺序并添加新颜色
  const newMiddle = positions.map((pos, index) => ({
    position: pos,
    color: index < middlePoints.length ? middlePoints[index].color : color
  }));

  // 更新断点数组
  breakpoints.splice(1, middlePoints.length, ...newMiddle);
};

// 修改后的删除断点方法
const removeBreakpoint = () => {
  if (breakpoints.length <= 2) return;

  const middlePoints = breakpoints.slice(1, -1);
  const newCount = middlePoints.length - 1;
  if (newCount < 0) return;

  const positions = calculateEqualPositions(newCount);

  // 保留剩余颜色
  const newMiddle = positions.map((pos, index) => ({
    position: pos,
    color: middlePoints[index].color
  }));

  breakpoints.splice(1, middlePoints.length, ...newMiddle);
};

// 添加颜色修改方法
const changeSegmentColor = (segmentIndex, event) => {
  // 找到对应的断点索引（颜色由左侧断点决定）
  const breakpointIndex = segmentIndex;

  emitter.emit('show-menu-color', {
    x: event.clientX,
    y: event.clientY,
    handle: (newColor) => {
      // 更新对应断点的颜色
      const sorted = sortedBreakpoints.value;
      const originalIndex = breakpoints.findIndex(
          bp => bp === sorted[breakpointIndex]
      );
      if (originalIndex > -1) {
        breakpoints[originalIndex].color = newColor;
      }
    }
  });
};

// 计算等分位置
const calculateEqualPositions = (count) => {
  return Array.from({length: count}, (_, i) => (i + 1) * (100 / (count + 1)));
};

// 计算实际值（带精度）
const calcActualValue = (position) => {
  const value = props.map.min + (props.map.max - props.map.min) * (position / 100);
  return Number(value.toFixed(precision.value));

}

// 监听数据变化
watch(modelValue, (val) => {

  emit('update:modelValue', val);

}, {deep: true})

// 添加等分模式监听
watch(isEq, (newVal) => {
  if (newVal) {
    const middleCount = breakpoints.length - 2;
    const positions = calculateEqualPositions(middleCount);
    breakpoints.forEach((bp, index) => {
      if (index > 0 && index < breakpoints.length - 1) {
        bp.position = positions[index - 1];
      }
    });
  }
});
// 添加对modelValue的监听
onMounted(() => {
  if (!props.modelValue || props.modelValue.length === 0) return;

  // 退出等分模式以确保断点位置可自定义
  isEq.value = false;

  //console.log(props.modelValue)

  const minVal = props.map.min;
  const maxVal = props.map.max;
  const range = maxVal - minVal;
  if (range <= 0) return;

  const newBreakpoints = [];

  if (!props.modelValue[0]) {
    // 处理第一个断点
    newBreakpoints.push({
      position: 0,
      color: props.defaultColor
    });
  } else {
    // 处理第一个断点
    newBreakpoints.push({
      position: 0,
      color: props.modelValue[0].color
    });
  }


  // 处理中间断点
  props.modelValue.forEach((item, index) => {
    if (index === props.modelValue.length - 1) return

    const rightValue = props.map.mode ? item.lt : item.lte;
    const position = ((rightValue - minVal) / range) * 100;
    newBreakpoints.push({
      position,
      color: props.modelValue[index + 1].color
    });
  });

  // 添加最后一个断点
  newBreakpoints.push({
    position: 100,
    color: props.defaultColor
  });


  // 更新breakpoints数组
  breakpoints.splice(0, breakpoints.length, ...newBreakpoints);

});

</script>

<style scoped>
.container {
  padding: 0 0 20px 0;
  display: grid;

  > div {
    display: flex;
    gap: 20px;
    align-items: center
  }

  gap: 10px;
  align-items: center;
  width: 500px;
}

.options {
  display: flex;
  gap: 10px;
}

.progress-bar {
  margin-left: 10px;
  position: relative;
  width: 100%;
  height: 8px;
  border-radius: 10px;
  cursor: pointer;
  background-color: var(--1-background-color);
}

.color-segment {
  position: absolute;
  border-radius: 10px;
  height: 100%;
  top: 0;
  transition: all 0.3s;
  z-index: 1;
}

.breakpoint {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  user-select: none;
  top: 4px;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  background-color: var(--font-color);
}

.breakpoint:first-child {
  display: none;
}


.range__value {
  visibility: visible;
  width: 40px;
  height: 40px;
  background:  var(--theme-hover-color);
  position: absolute;
  top: -47px;
  left: -11px;
  border-radius: 2rem 2rem 2rem 0.25rem;
  transform: rotate(-45deg);
  display: grid;
  place-items: center;
}

.range__value-number {
  transform: rotate(45deg);
  color: var(--font-color);
  font-size: 17px;
  text-align: center;
}

.config-item {
  display: flex;
  align-items: center;
  gap: 10px;

  span {
    font-weight: bolder;
    width: 37px;
  }
}

/* 添加指针样式 */
.color-segment {
  cursor: pointer;
  transition: background-color 0.3s;
}

/* 可选：添加hover效果 */
.color-segment:hover {
  filter: brightness(1.1);
}
</style>
