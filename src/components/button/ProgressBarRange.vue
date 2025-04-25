<template>
  <div class="container" :class="{inactivation:inactivation}">

    <!-- 进度条容器 -->
    <div
        class="progress-bar"
        ref="progressBar"
    >
      <!-- 颜色分段 -->
      <div
          v-for="(segment, index) in colorSegments"
          :key="index"
          class="color-segment"
          :style="{
          left: segment.start + '%',
          width: (segment.end - segment.start) + '%',
          backgroundColor: segment.color
        }"
      ></div>

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
        <div v-if="index === draggingIndex" id="range-thumb" ref="rangeThumb" class="range__thumb" >
          <div ref="rangeValue" class="range__value">
            <span class="range__value-number">{{ bp.position.toFixed(1) }}</span>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
import {ref, reactive, computed, onMounted, watch} from 'vue';


const props = defineProps({
  inactivation:{
    type: Boolean,
    required: true
  }

})

// 响应式引用
const progressBar = ref(null);
const draggingIndex = ref(null);


// 初始断点数据（包含位置和颜色）
const breakpoints = reactive([
  {position: 0, color: '#15ccbe'},
  {position: 100, color: '#4ECDC4'}
]);

const colorSegments = computed(() => {
  return sortedBreakpoints.value.slice(0, -1).map((bp, i) => ({
    start: bp.position,
    end: sortedBreakpoints.value[i+1].position,
    color: bp.color
  }));
});

// 计算属性：保持断点排序
const sortedBreakpoints = computed(() => {
  return [...breakpoints].sort((a, b) => a.position - b.position);
});

// 开始拖拽
const startDragging = (index, e) => {
  if (props.inactivation) return
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


// 组件挂载后初始化图表
onMounted(() => {

});

</script>

<style scoped>
.container {
  display: grid;
  width: 200px;
  align-items: center;
}

.progress-bar {
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
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  background-color: var(--font-color);
}

.breakpoint:first-child {
  display: none;
}


.range__value {
  visibility: visible;
  width: 40px;
  height: 40px;
  background: linear-gradient(95deg, var(--1-background-color) -7%, var(--1-theme-color) 112%);
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
}

.inactivation{
  cursor: not-allowed;
  .breakpoint{
    background-color: var(--inactivation-color) !important;
    cursor: not-allowed !important;
  }
  .color-segment{
    background-color: var(--inactivation-color) !important;
    cursor: not-allowed !important;
  }
}
</style>
