<template>
  <div class="color-palette">
    <div class="color-container">
      <div
          v-for="(item, index) in colors"
          :key="index"
          class="color-point"
          :style="{ background: item }"
          @click.stop="handleRemove(index)"
      >
        <span class="remove-btn">×</span>
      </div>

      <!-- 添加按钮 -->
      <label class="add-button" @click="chooseColor">
        +
      </label>
    </div>
  </div>
</template>

<script setup>
// 定义 props
import emitter from "../../emitter/emitter.js";

const props = defineProps({
  colors: {
    type: Array,
    default: () => []
  }
})

// 定义 emit 事件
const emit = defineEmits(['update:colors'])

const chooseColor = (event)=>{
  emitter.emit('show-menu-color',
      {
        x: event.clientX,
        y: event.clientY,
        handle: (color)=>{
          props.colors.push(color)
        }
      })
}

const handleRemove = (index) => {
  props.colors.splice(index, 1)

}
</script>


<style scoped>

/* 修改label样式 */
.add-button {
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s;
}

.color-container {
  position: relative;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding: 12px;
  background: var(--3-background-color);
  border-radius: 8px;
  cursor: pointer;
  transition: 300ms ease-in-out;
  min-width: 150px;
  min-height: 40px;
}

.color-container:hover {
  background: var(--hover-color);
}

.color-point {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  position: relative;
  transition: transform 0.2s;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.color-point:hover {
  transform: scale(1.1);
}

.add-button:hover {
  background: #ccc;
  transform: rotate(90deg);
}

.remove-btn {
  display: none;
  color: white;
  font-weight: bold;
  font-size: 18px;
  text-shadow: 0 0 3px rgba(0,0,0,0.5);
}

.color-point:hover .remove-btn {
  display: block;
}
</style>