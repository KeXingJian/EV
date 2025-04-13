<template>
  <div class="top-div">
    <VueDraggable
        v-model="Gs"
        class="draggable-items"
    >
      <GraphItem
          v-for="item in Gs"
          :key="item.id"
          draggable="true"
          @dragstart="onDragStart(item)"
          @dragend="handleDragEnd"
          :graph="item"
      />
    </VueDraggable>

    <!-- 删除区域 -->
    <div
        v-if="isDragged"
        class="delete-zone zone"
        @dragover.prevent
        @drop="handleDrop"
        @dragenter="isDeleteZoneActive = true"
        @dragleave="isDeleteZoneActive = false"
        :class="{ 'active': isDeleteZoneActive }"
    >
      拖到这里删除
    </div>

  </div>

</template>

<script setup>
import GraphItem from "../card/GraphItem.vue";
import {VueDraggable} from "vue-draggable-plus";
import {ref, watch} from "vue";
import {useOptionConfig} from "../../store/OptionConfig.js";
import {storeToRefs} from "pinia";
import {checkGraphDelete, reloadGraph} from "../../utils/CheckUtils.js";
import {getGridSet} from "../../utils/GridSetUtils.js";

const {Gs,echartsOptions} = storeToRefs(useOptionConfig())

const draggedItem = ref(null);
const isDeleteZoneActive = ref(false);
const isDragged = ref(false);

const onDragStart = (item) => {
  draggedItem.value = item;
  isDragged.value = true;
};

const handleDragEnd = ()=>{
  isDragged.value = false;
}

const handleDrop = () => {
  if (draggedItem.value && Gs.value.length > 1) {
    console.log('删除图', draggedItem.value);
    checkGraphDelete(draggedItem.value.id)

    console.log('图从映射配置移除')
    Gs.value = Gs.value.filter(i => i.id !== draggedItem.value.id);

    const gridSet = getGridSet()
    echartsOptions.value.grid = gridSet[Gs.value.length-1].map(i=>i.item)
    console.log('变更echartsOptions.grid',echartsOptions.value.grid)

    reloadGraph()

    draggedItem.value = null;
    isDeleteZoneActive.value = false;
  }
}

watch(Gs,()=>{
  reloadGraph()
})
</script>

<style scoped>
.top-div {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100vh - 80px - 42px);
  overflow-x: hidden;
  overflow-y: scroll;
  position: relative; /* 确保删除区域定位正确 */
}
.top-div::-webkit-scrollbar {
  display: none;
}

.draggable-items{
  display: flex;
  flex-direction: column;
  margin: 0 0 20px 0;
}
.zone{
  height: 80px;
  font-weight: bolder;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.delete-zone {
  background: #ff4949;
  color: var(--font-color);
  transition: background 0.3s;
  opacity: 0.8;
}

.delete-zone.active {
  background: #ff1a1a;
  opacity: 1;
}

.delete-zone:hover {
  opacity: 1;
}
</style>
