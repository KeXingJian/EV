<template>
  <div class="radio-input" :class="{inactivation:inactivation}">
    <label
        v-for="option in options"
        :key="option.value"
        class="label"
        :class="{ 'checked': modelValue === option.value }"
    >
      <input
          type="radio"
          :value="option.value"
          :id="`${name}-${option.value}`"
          :name="name"
          :checked="modelValue === option.value"
          @change="handleChange(option.value)"
          :disabled="inactivation"
      />
      <p class="text">{{ $t(option.label) }}</p>
    </label>
  </div>
</template>

<script setup>
import {defineProps, defineEmits, onMounted} from 'vue';

const props = defineProps({
  options: {
    type: Array,
    required: true,

  },
  modelValue: {
    type: [String, Number],
    required: true
  },
  name: {
    type: String,
    default: () => `radio-group-${Math.random().toString(36).substr(2, 9)}`
  },
  inactivation:{
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

// 处理 change 事件
const handleChange = (value) => {
  if (!props.inactivation) {
    emit('update:modelValue', value);
  }
};

</script>
<style scoped>
.radio-input {
  display: flex;
}

.radio-input label {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 95px;
  height: 30px;
  cursor: pointer;
}

.radio-input .text {
  color: var(--font-color);
}

.radio-input input[type="radio"] {
  appearance: none;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background-color: #202030;
  display: flex;
  justify-content: center;
  align-items: center;
}

.radio-input input[type="radio"]:checked {
  background-color: var(--active-color);
  animation: pulse 0.7s forwards;
}

.radio-input input[type="radio"]:before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 50%;
  transition: all 0.1s cubic-bezier(0.165, 0.84, 0.44, 1);
  background-color: #fff;
  transform: scale(0);
}

.radio-input input[type="radio"]:checked::before {
  transform: scale(1);
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); }
  70% { box-shadow: 0 0 0 8px rgba(255, 255, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
}

p{
  font-weight: bolder;
}

.inactivation{
  cursor: not-allowed;
  p{
    color: var(--inactivation-color) !important;
  }
  .radio-input label{
    cursor: not-allowed;
  }
  input{
    cursor: not-allowed;
  }
}
</style>
