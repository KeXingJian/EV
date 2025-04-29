<template>
  <div
      ref="ballRef"
      class="accelerate-ball"
      :style="ballStyle"
      @mousedown.prevent="startDrag"
      @touchstart.prevent="handleTouchStart"
      @click.stop="handleClick"
      :class="{
        rotate: isOpen
      }"

  >
    <div class="ball-content">
      <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#e8eaed"
          :class="{
            rotate: isOpen
          }"
      >

        <path
            d="m242-200 200-280-200-280h98l200 280-200 280h-98Zm238 0 200-280-200-280h98l200 280-200 280h-98Z"/>
      </svg>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted} from 'vue'

const props = defineProps({
  // 组件配置参数
  size: {type: Number, default: 60},       // 组件尺寸
  rightOffset: {type: Number, default: -32},  // 右侧贴边偏移
  isOpen: {type: Boolean, required: true}
})

const emit = defineEmits(['dragStart', 'dragEnd', 'click'])

const ballRef = ref(null)
const isDragging = ref(false)
const startY = ref(0)
const startTop = ref(0)
const currentTop = ref(0)
const hasDragged = ref(false) // 新增拖拽状态标记

// 计算球体样式
const ballStyle = computed(() => ({
  right: `${props.rightOffset}px`,
  width: `35px`,
  height: `60px`,
  borderRadius: `0 60px 60px 0`,
  top: `${currentTop.value}px`
}))

// 添加点击处理
const handleClick = () => {
  if (!isDragging.value && !hasDragged.value) {
    emit('click')
  }
  isDragging.value = false
  hasDragged.value = false
}

// 初始化位置
const initPosition = () => {
  currentTop.value = window.innerHeight / 2 - props.size / 2
}

// 拖拽处理
const startDrag = (e) => {
  isDragging.value = true
  hasDragged.value = false // 重置拖拽标记
  startY.value = e.clientY
  startTop.value = currentTop.value
  emit('dragStart')

  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

const handleTouchStart = (e) => {
  isDragging.value = true
  hasDragged.value = false // 重置拖拽标记
  startY.value = e.touches[0].clientY
  startTop.value = currentTop.value
  emit('dragStart')

  document.addEventListener('touchmove', onTouchDrag)
  document.addEventListener('touchend', stopDrag)
}

const onDrag = (e) => {
  if (!isDragging.value) return
  updatePosition(e.clientY)
}

const onTouchDrag = (e) => {
  if (!isDragging.value) return
  updatePosition(e.touches[0].clientY)
}

const updatePosition = (clientY) => {
  const deltaY = Math.abs(clientY - startY.value)
  if (deltaY > 2) { // 移动超过2像素视为拖拽操作
    hasDragged.value = true
  }

  const newTop = startTop.value + (clientY - startY.value)
  const maxTop = window.innerHeight - props.size
  currentTop.value = Math.min(Math.max(0, newTop), maxTop)
}

const stopDrag = () => {
  isDragging.value = false
  emit('dragEnd')

  // 清理事件监听
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('touchmove', onTouchDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchend', stopDrag)
}

// 窗口大小变化处理
const handleResize = () => {
  const maxTop = window.innerHeight - props.size
  currentTop.value = Math.min(currentTop.value, maxTop)
}

// 生命周期
onMounted(() => {
  initPosition()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.accelerate-ball {
  position: absolute;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  user-select: none;
  transition: transform 0.1s ease-out,
  top 0.2s ease-out;
  z-index: 1;
  background: var(--theme-hover-color);
}

.accelerate-ball:active {
  transform: scale(0.9);
  transition: transform 0.08s ease-out;
}


svg {
  transition: rotate 150ms ease;
  margin-right: 5px;
}

.rotate{
  svg{
    transform: rotate(180deg);
  }
}
</style>