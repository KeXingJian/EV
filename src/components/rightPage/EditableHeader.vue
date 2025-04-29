<template>
  <div class="header-cell" @dblclick="startEditing">
    <span v-if="!isEditing">{{ displayName }}</span>
    <input
        class="input"
        v-else
        ref="input"
        v-model="tempName"
        @blur="saveChanges"
        @keydown.enter="saveChanges"
        @keydown.esc="cancelEditing"
    />
    <CloseButton @click="deleteField"></CloseButton>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import CloseButton from "../svg/CloseButton.vue";

const props = defineProps({
  params: Object
})

const emit = defineEmits(['header-changed'])

const isEditing = ref(false)
const tempName = ref('')
const input = ref(null)
const displayName = ref(props.params.displayName)

const startEditing = () => {
  isEditing.value = true
  tempName.value = displayName.value
  nextTick(() => input.value.focus())
}

const saveChanges = () => {
  isEditing.value = false
  if (tempName.value !== displayName.value) {
    displayName.value = tempName.value
    // 获取列索引（从col0等字段名中提取）
    const colId = props.params.column.colId
    const columnIndex = parseInt(colId.replace('col', ''), 10)
    // 触发父组件更新
    props.params.onHeaderNameChange(columnIndex, tempName.value)
  }
}

const cancelEditing = () => {
  isEditing.value = false
}

const deleteField =()=>{
  const colId = props.params.column.colId
  const columnIndex = parseInt(colId.replace('col', ''), 10)
  props.params.deleteField(columnIndex)
}


</script>

<style scoped>

</style>