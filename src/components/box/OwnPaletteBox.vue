<template>
  <div class="color-palette">

    <div class="color-container">
      <div
          v-for="(item, index) in palettes[0].colors"
          :key="index"
          class="color-point"
          :style="{ background: item }"
          @click.stop="handleRemove(index)"
      >
        <span class="remove-btn">×</span>
      </div>
      <!-- 修改后的添加按钮 -->
      <label class="add-button">
        +
        <input
            type="color"
            class="color-input"
            @change="handleColorAdd"
        >
      </label>

    </div>
  </div>
</template>

<script setup>
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../../store/OptionConfig.js";

const {palettes} = storeToRefs(useOptionConfig())

const handleColorAdd = (e) => {
  const newColor = e.target.value.toUpperCase()
  if (!palettes.value[0].colors.includes(newColor)) {
    palettes.value[0].colors.push(newColor)
    localStorage.setItem('my', JSON.stringify(palettes.value[0].colors))
  }
  // 清空输入值以便下次选择相同颜色也能触发change事件
  e.target.value = ''
}

const handleRemove = (index) => {
  palettes.value[0].colors.splice(index, 1)
  localStorage.setItem('my', JSON.stringify(palettes.value[0].colors))
}
</script>

<style scoped>

/* 新增input样式 */
.color-input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

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