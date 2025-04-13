<template>
  <div class="customCheckBoxHolder">
    <template v-for="(option, index) in options" :key="option.value">
      <input
          class="customCheckBoxInput"
          type="checkbox"
          :id="`${name}-${index}`"
          :value="option.value"
          :checked="modelValue.includes(option.value)"
          @change="handleChange(option.value, $event.target.checked)"
      >
      <label class="customCheckBoxWrapper" :for="`${name}-${index}`">
        <div class="customCheckBox">
          <div class="inner">{{ option.label }}</div>
        </div>
      </label>
    </template>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  options: {
    type: Array,
    required: true,
    validator: value => value.every(option => 'value' in option && 'label' in option)
  },
  name: {
    type: String,
    required: true,
    validator: value => /^[a-zA-Z]+$/.test(value)
  }
});

const emit = defineEmits(['update:modelValue']);

const handleChange = (value, checked) => {
  const newValue = [...props.modelValue];
  checked ? newValue.push(value) : newValue.splice(newValue.indexOf(value), 1);
  emit('update:modelValue', newValue);
};
</script>


<style scoped>
.customCheckBoxHolder {
  margin: 5px;
  display: flex;
}

.customCheckBox {
  width: fit-content;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  user-select: none;
  padding: 2px 8px;
  background-color: rgba(0, 0, 0, 0.16);
  border-radius: 0px;
  color: rgba(255, 255, 255, 0.7);
  transition: all 300ms cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  height: 32px;
  align-items: center;
  box-shadow:
      inset rgba(0, 0, 0, 0.15) 0 2px 1px,
      rgba(255, 255, 255, 0.17) 0 1px 1px;
  justify-content: center;
  min-width: 55px;
}

.customCheckBox:hover {
  background-color: var(--hover-color);
  color: white;
  box-shadow:
      inset rgba(0, 0, 0, 0.23) 0 -4px 1px,
      rgba(255, 255, 255, 0.17) 0 -1px 1px,
      rgba(0, 0, 0, 0.17) 0 2px 4px;
}

.customCheckBox .inner {
  font-size: 18px;
  font-weight: 900;
  pointer-events: none;
  transition: transform 300ms cubic-bezier(0.25, 0.8, 0.25, 1);
}

.customCheckBox:hover .inner {
  transform: translateY(-2px);
}

.customCheckBoxWrapper:first-of-type .customCheckBox {
  border-radius: 5px 0 0 5px;
}

.customCheckBoxWrapper:last-of-type .customCheckBox {
  border-radius: 0 5px 5px 0;
}

.customCheckBoxInput {
  display: none;
}

.customCheckBoxInput:checked + .customCheckBoxWrapper .customCheckBox {
  background-color: var(--1-theme-color);
  color: white;
  box-shadow:
      inset rgba(0, 0, 0, 0.23) 0 -4px 1px,
      rgba(255, 255, 255, 0.17) 0 -1px 1px,
      rgba(0, 0, 0, 0.17) 0 2px 4px;
}

.customCheckBoxInput:checked + .customCheckBoxWrapper .customCheckBox:hover {
  background-color: var(--theme-hover-color);
}
</style>