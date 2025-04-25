<template>
  <!-- The AG Grid component -->
  <div class="table">
    <div class="datasets">
        <div class="item">
          <span>数据源</span>
        </div>
        <div class="item" v-for="item in Ds" :key="item.id">
          <span>{{item.name}}</span>
        </div>
      </div>
    <div class="option">
      <AddLongButton @click="addRow">添加行</AddLongButton>
      <AddLongButton @click="startAddingField">添加字段</AddLongButton>
      <form @submit="confirmAddField" v-if="isAddingField">
        <input-box
            width="100"
            text="text"
            v-model="newFieldName"
        ></input-box>
      </form>
      <select v-model="selectedType" class="type-select" v-if="isAddingField">
        <option value="number">数字</option>
        <option value="string">字符串</option>
      </select>
      <CheckButton @click="confirmAddField" v-if="isAddingField"></CheckButton>
      <CloseButton @click="cancelAddField" v-if="isAddingField"></CloseButton>
    </div>
    <ag-grid-vue
        :rowData="rowData"
        :columnDefs="columnDefs"
        :theme="myTheme"
        :style="{
            height: '80vh',
         }"
        :single-click-edit="true"
        :components="components"
        @cell-value-changed="onCellValueChanged"
    >
    </ag-grid-vue>
  </div>

</template>

<script setup>
import {AllCommunityModule, ModuleRegistry, themeQuartz} from 'ag-grid-community';
import { AgGridVue } from "ag-grid-vue3";
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../../store/OptionConfig.js";
import {computed, ref} from "vue";
import EditableHeader from './EditableHeader.vue'
import InputBox from "../box/InputBox.vue";
import CheckButton from "../svg/CheckButton.vue";
import CloseButton from "../svg/CloseButton.vue";
import AddLongButton from "../button/AddLongButton.vue";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const {dataset,Ds,fileData} = storeToRefs(useOptionConfig());

const isAddingField = ref(false)
const newFieldName = ref('')
const selectedType = ref('string')

const myTheme = themeQuartz.withParams({
  backgroundColor: '#0d1f2d',
  foregroundColor: '#C9D6DF',
  headerBackgroundColor: '#1d2e3d',
  oddRowBackgroundColor: '#1d2e3d',
  headerColumnResizeHandleColor: '#15ccbe',
})

const components = {
  'editable-header': EditableHeader
}

const columnDefs = computed(() => {
  // 如果维度数组存在且有效，优先使用维度数组
  if (fileData.value?.columnStats?.length !== 0) {
    return fileData.value.columnStats.map((dim, index) => {
      return {
        headerName: dim.field,
        field: `col${index}`,
        suppressSizeToFit: false,
        editable: true,  // 确保维度列可编辑
        // 禁止排序
        sortable: false,
        suppressMovable: true,   // 新增：禁止列交换
        headerComponent: 'editable-header',
        headerComponentParams: {
          onHeaderNameChange: (colIndex, newName) => {
            console.log(colIndex)
            fileData.value.columnStats[colIndex].field = newName
          },
          deleteField: (colIndex) => {
            deleteField(colIndex)
          }
        },
        cellStyle: {textAlign: 'center'}, // 单元格文字居中
        type: dim.type === 'number' ? 'numeric' : 'text',
        // 自动应用对应类型的编辑器（数字列自动使用数字输入框）
        cellEditor: dim.type === 'number' ? 'agNumberCellEditor' : 'agTextCellEditor',
      }
    })
  }else return []


});

// 转换二维数组为对象数组
const rowData = computed(() => {
  return dataset.value.source.map(row =>
      row.reduce((obj, val, idx) => {
        obj[`col${idx}`] = val;
        return obj;
      }, {})
  );
});

// 新增事件处理函数
const onCellValueChanged = (event) => {
  const { rowIndex, colDef, data } = event;
  const columnIdx = parseInt(colDef.field.replace('col', ''), 10);
  // 直接修改原始数据源
  dataset.value.source[rowIndex][columnIdx] = data[colDef.field];
};

const startAddingField = () => {
  isAddingField.value = true
  newFieldName.value = ''
  selectedType.value = 'string'
}

const confirmAddField = () => {
  if (newFieldName.value.trim()) {
    // 添加新字段到columnStats
    const newColumn = {
      index: fileData.value.columnStats.length,
      field: newFieldName.value.trim(),
      type: selectedType.value
    }

    fileData.value.columnStats.push(newColumn)

    // 为每行数据添加新字段
    dataset.value.source.forEach(row => {
      row.push(selectedType.value === 'number' ? 0 : '')
    })

    cancelAddField()
  }
}

const cancelAddField = () => {
  isAddingField.value = false
  newFieldName.value = ''
}

// 修改删除字段功能
const deleteField = (colIndex) => {
  // 从列配置中删除
  fileData.value.columnStats.splice(colIndex, 1)

  // 从每行数据中删除对应列
  dataset.value.source.forEach(row => {
    row.splice(colIndex, 1)
  })
}

const addRow = ()=>{
  const newRow = []
  fileData.value.columnStats.forEach(i=>{
    newRow.push(i.type === 'number' ? 0 : '')
  })
  dataset.value.source.push(newRow)
}
</script>

<style scoped>

.table{
  display: grid;
  grid-template-rows: auto auto 1fr;
  margin-left: 8px;
  gap: 10px
}
.table ::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

.table ::-webkit-scrollbar-track {
  background: var(--1-background-color); /* 与主题背景色一致 */
  border-radius: 10px;
}

.table ::-webkit-scrollbar-thumb {
  background: var(--font-color); /* 与表头背景色一致 */
  border-radius: 10px;
  border: 2px solid #0d1f2d;
}

.table ::-webkit-scrollbar-thumb:hover {
  background: #C9D6DF; /* 与前景色呼应 */
}


.datasets{
  display: flex;
  gap: 12px;
  overflow-x: scroll;
  flex: 1;
  max-width: 1100px;
}

.datasets::-webkit-scrollbar{
  display: none;
}

.item{
  position: relative;
  padding: 8px;
  border-radius: 10px;
  border: none;
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  transition: 300ms ease-in-out;

  span{
    width: 135px;
    white-space: nowrap;
    text-align: center;
  }
}

.item:hover{
  background-color: var(--hover-color);
}

.item:before {
  content: '';
  position: absolute;
  background: var(--hover-color);
  width: 4px;
  height: 28px;
  border-radius: 2px;
  left: calc(100% + 5px);
  z-index: 1;
}

.option{
  display: flex;
  align-items: center;
  gap: 10px
}

.type-select {
  height: 32px;
  background: var(--1-background-color);
  color: var(--font-color);
  border: 1px solid var(--hover-color);
  border-radius: 4px;
  padding: 0 8px;
}
</style>