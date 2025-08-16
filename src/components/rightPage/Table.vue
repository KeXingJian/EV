<template>
  <div class="table">
    <div class="datasets">
      <div  class="item"
            @click="currentSource=-1"
            :class="{
              active: currentSource === -1,
            }"
      >
        <span>{{ $t('source') }}</span>
      </div>
      <div class="item"
           v-for="(item,index) in Ds"
           :key="item.id"
           @click="currentSource=index"
           :class="{
              active: currentSource === index,
            }"
      >
        <span>{{ item.name }}</span>
      </div>
    </div>
    <div class="option">
      <AddLongButton @click="addRow">{{ $t('addRow') }}</AddLongButton>
      <AddLongButton @click="startAddingField">{{ $t('addField') }}</AddLongButton>
      <select v-model="selectedType" class="type-select" v-if="isAddingField">
        <option value="number">{{ $t('number') }}</option>
        <option value="string">{{ $t('string') }}</option>
      </select>
      <form @submit="confirmAddField" v-if="isAddingField">
        <input-box
            width="100"
            text="text"
            v-model="newFieldName"
        ></input-box>
      </form>

      <CheckButton @click="confirmAddField" v-if="isAddingField"></CheckButton>
      <CloseButton @click="cancelAddField" v-if="isAddingField"></CloseButton>
      <DeleteLongButton v-if="currentSource===-1 && deleteIndex.length!==0" @click="deleteSelectedRows">{{ $t('deleteRow') }}</DeleteLongButton>
    </div>
    <ag-grid-vue
        :rowData="rowData"
        :columnDefs="columnDefs"
        :theme="myTheme"
        :style="{
            height: 'calc(100vh - 105px - 39px - 40px - 20px)',
         }"
        :single-click-edit="true"
        :components="components"
        @cell-value-changed="onCellValueChanged"
        :rowSelection=" currentSource===-1 && !isLoadRelation ?
          {
            mode: 'multiRow'
          } : undefined"
        @row-selected="onRowSelected"
    >

    </ag-grid-vue>
  </div>

</template>

<script setup>
import {themeQuartz} from 'ag-grid-community';
import {AgGridVue} from "ag-grid-vue3";
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../../store/OptionConfig.js";
import {computed, ref, watch} from "vue";
import EditableHeader from './EditableHeader.vue'
import InputBox from "../box/InputBox.vue";
import CheckButton from "../svg/CheckButton.vue";
import CloseButton from "../svg/CloseButton.vue";
import AddLongButton from "../button/AddLongButton.vue";
import DeleteLongButton from "../button/DeleteLongButton.vue";
import {checkSeries} from "../../utils/newArch/Check4Series.js";
import {reloadNumericStats, reloadNumericStats4One} from "../../utils/ExcelUtils.js";
import {v4 as uuidv4} from "uuid";

const {
  getDataFromD, refreshDataset,
  dataset, echartsOptions, fileData
} = useOptionConfig()
const {Ds, Ss,theme,isLoadRelation} = storeToRefs(useOptionConfig());

const isAddingField = ref(false)
const newFieldName = ref('')
const selectedType = ref('string')

const currentSource = ref(-1)

const deleteIndex = ref([])

const darkTheme = themeQuartz.withParams({
  backgroundColor: '#0d1f2d',
  foregroundColor: '#C9D6DF',
  headerBackgroundColor: '#1d2e3d',
  oddRowBackgroundColor: '#1d2e3d',
  headerColumnResizeHandleColor: '#15ccbe',
})

const lightTheme = themeQuartz.withParams({
  backgroundColor: '#FFFFFF',
  foregroundColor: '#C9D6DF',
  headerBackgroundColor: '#F0F4F8',
  oddRowBackgroundColor: '#F0F4F8',
  headerColumnResizeHandleColor: '#15ccbe',
})

const myTheme = ref(null)

myTheme.value = myTheme.value = theme.value ? darkTheme : lightTheme

const components = {
  'editable-header': EditableHeader
}

const columnDefs = computed(() => {
  if (fileData.columnStats?.length !== 0) {
    return fileData.columnStats.filter((_,index)=>index!==0).map((dim, index) => {
      return {
        headerName: dim.field,
        field: `col${index}`,
        suppressSizeToFit: false,
        editable: currentSource.value === -1 && !isLoadRelation.value,
        // 禁止排序
        sortable: false,
        suppressMovable: true,
        headerComponent: 'editable-header',
        cellStyle: {textAlign: 'center'}, // 单元格文字居中
        type: dim.type === 'number' ? 'numeric' : 'text',
        // 自动应用对应类型的编辑器（数字列自动使用数字输入框）
        cellEditor: dim.type === 'number' ? 'agNumberCellEditor' : 'agTextCellEditor',
      }
    })
  }
})

// 转换二维数组为对象数组
const rowData = computed(() => {
  if (currentSource.value===-1){
    return dataset.source.map(row =>
        row.filter((_,index)=>index!==0).reduce((obj, val, idx) => {
          obj[`col${idx}`] = val
          return obj
        }, {})
    )
  }else {
    return getDataFromD(Ds.value[currentSource.value]).map(row =>
        row.filter((_,index)=>index!==0).reduce((obj, val, idx) => {
          obj[`col${idx}`] = val
          return obj
        }, {})
    )
  }
})

// 修改事件
const onCellValueChanged = (event) => {
  const {rowIndex, colDef, data} = event
  const columnIdx = parseInt(colDef.field.replace('col', ''), 10);
  // 直接修改原始数据源
  dataset.source[rowIndex][columnIdx+1] = data[colDef.field];

  if (fileData.columnStats[columnIdx+1].type === 'number') reloadNumericStats4One(columnIdx+1)

  Ss.value.filter(i=>i.isLoad).forEach((s) => {
    checkSeries(s,echartsOptions)
  })
  refreshDataset(Ds.value[0].id)
}

const startAddingField = () => {
  isAddingField.value = true
  newFieldName.value = ''
  selectedType.value = 'string'
}

// 添加字段
const confirmAddField = () => {
  if (newFieldName.value.trim()) {
    // 添加新字段到columnStats
    const newColumn = {
      index: fileData.columnStats.length,
      field: newFieldName.value.trim(),
      type: selectedType.value
    }

    if(selectedType.value==='number') {
      newColumn.numericStats = {
        min: 0,
        max: 0,
      }
    }

    fileData.columnStats.push(newColumn)

    // 为每行数据添加新字段
    dataset.source.forEach(row => {
      row.push(selectedType.value === 'number' ? 0 : '')
    })

    cancelAddField()
  }
}

// 取消添加
const cancelAddField = () => {
  isAddingField.value = false
  newFieldName.value = ''
}

const addRow = () => {
  const newRow = []
  fileData.columnStats.forEach((i,index) => {
    if (index === 0){
      newRow.push(uuidv4())
    }else {
      newRow.push(i.type === 'number' ? 0 : '')
    }

  })
  dataset.source.push(newRow)
  refreshDataset(Ds.value[0].id)
}

const onRowSelected = (event)=> {
  if (event.node.isSelected()){
    deleteIndex.value.push(event.node.rowIndex)
  }else {
    deleteIndex.value = deleteIndex.value.filter(i => i!==event.node.rowIndex)
  }
}

const deleteSelectedRows = ()=>{
  // 方法一：使用 filter 生成新数组
  const indicesSet = new Set(deleteIndex.value);
  // 生成过滤后的新数据（排除选中行）
  dataset.source = dataset.source.filter(
      (_, index) => !indicesSet.has(index)
  );

  deleteIndex.value.length = 0
  reloadNumericStats()
  Ss.value.filter(i=>i.isLoad).forEach((s) => {
    checkSeries(s,echartsOptions)
  })
  refreshDataset(Ds.value[0].id)

}

watch(theme,(newVal)=>{
  myTheme.value = newVal ? darkTheme : lightTheme
})

</script>

<style scoped>

.table {
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


.datasets {
  display: flex;
  gap: 12px;
  overflow-x: scroll;
  flex: 1;
  max-width: 1100px;
}

.datasets::-webkit-scrollbar {
  display: none;
}

.item {
  position: relative;
  padding: 8px;
  border-radius: 10px;
  border: none;
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  transition: 300ms ease-in-out;

  span {
    width: 135px;
    white-space: nowrap;
    text-align: center;
  }
}

.item:hover {
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

.option {
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

.active{
  background: var(--theme-hover-color) !important;
}
</style>