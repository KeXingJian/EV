<template>
  <div class="top-card">
    <div class="range" :style="{
      width: `${width}px`
    }">
      <div class="range__content">
        <div class="range__slider">
          <div id="range-line" class="range__slider-line" :style="lineStyle"></div>
        </div>
        <div id="range-thumb" ref="rangeThumb" class="range__thumb" :style="thumbStyle">
          <div ref="rangeValue" class="range__value">
            <span class="range__value-number">{{ modelValue }}{{ unit }}</span>
          </div>
        </div>
        <input
            ref="rangeInput"
            :value="modelValue"
            type="range"
            class="range__input"
            :min="min"
            :max="max"
            :step="step"
            @input="handleInput"
            @mouseup="showRange"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed} from 'vue'


const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  step: {
    type: Number,
    default: 1
  },
  unit: {
    type: String,
    default: ''
  },
  width: {
    type: Number,
    required: true,
  }
})

const emit = defineEmits(['update:modelValue'])

const rangeInput = ref(null)
const rangeThumb = ref(null)
const rangeValue = ref(null)

const lineStyle = computed(() => {
  const range = props.max - props.min
  const percentage = range === 0 ? 0 : ((props.modelValue - props.min) / range) * 100
  return {
    width: `${percentage}%`
  }
})

const thumbStyle = computed(() => {
  if (!rangeInput.value || !rangeThumb.value) return {}
  const space = rangeInput.value.offsetWidth - rangeThumb.value.offsetWidth
  const range = props.max - props.min
  const percentage = range === 0 ? 0 : (props.modelValue - props.min) / range
  const thumbPosition = percentage * space
  return {
    left: `${thumbPosition}px`
  }
})

function handleInput(event) {
  let newValue = Number(event.target.value)
  // 确保数值在[min, max]范围内
  newValue = Math.max(props.min, Math.min(props.max, newValue))
  emit('update:modelValue', newValue)
  showValue()
}

function showValue() {
  if (rangeValue.value) {
    rangeValue.value.style.visibility = 'visible'
  }
}

function showRange() {
  if (rangeValue.value) {
    rangeValue.value.style.visibility = 'hidden'
  }
}
</script>

<style scoped>
.top-card {
  height: 100%;
  flex: 1;
  display: grid;
  background: var(--2-background-color);
  span{
    color: var(--font-color);
  }

}

.range {
  display: flex;
}

.range__content {
  position: relative;
  width: 100%;
  display: grid;
  place-items: center;
}

.range__slider {
  width: 100%;
  height: 8px;
  background-color: var(--1-background-color);
  border-radius: 4rem;
  box-shadow: 0 4px 12px hsla(256, 72%, 24%, 0.2);
  overflow: hidden;
}

.range__slider-line {
  width: 100%;
  height: 100%;
  background: linear-gradient(95deg, var(--1-theme-color) -7%, var(--theme-hover-color) 112%);
  width: 0;
}

.range__thumb {
  width: 12px;
  height: 12px;
  background-color: hsl(256, 58%, 94%);
  border-radius: 50%;
  box-shadow: 0 0 12px hsla(256, 72%, 24%, 0.2);
  position: absolute;
}

.range__value {
  visibility: hidden;
  width: 40px;
  height: 40px;
  background: linear-gradient(95deg, var(--1-background-color) -7%, var(--1-theme-color) 112%);
  position: absolute;
  top: -47px;
  left: -14px;
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

.range__input {
  appearance: none;
  width: 100%;
  height: 16px;
  position: absolute;
  opacity: 0;
}

.range__input::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
}

.range__input::-webkit-slider-thumb:hover {
  cursor: pointer;
}

</style>
