<template>
  <button class="heart-btn" @click="toggle">
    <svg
        ref="heartSvg"
        class="heart-icon"
        :class="{ active: modelValue }"
        viewBox="0 0 24 24"
        width="24"
        height="24"
    >
      <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      />
    </svg>
  </button>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue'])
const heartSvg = ref(null)

function toggle() {
  // 触发心跳动画
  heartSvg.value.classList.add('animate')
  setTimeout(() => heartSvg.value.classList.remove('animate'), 300)

  // 更新状态
  emit('update:modelValue', !props.modelValue)
}
</script>

<style scoped>
.heart-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  outline: none;
  transition: transform 0.2s;
}

.heart-btn:active {
  transform: scale(0.95);
}

.heart-icon {
  transition:
      fill 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  fill: var(--font-color);
  transform-origin: center;
}

.heart-icon.active {
  fill: #ff3860 !important;
  transform: scale(1.1);
}

.animate {
  animation: heartbeat 0.45s ease-in-out;
}

@keyframes heartbeat {
  0% { transform: scale(1); }
  25% { transform: scale(1.3); }
  50% { transform: scale(1); }
  75% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
</style>