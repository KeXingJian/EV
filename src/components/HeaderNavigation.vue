<template>
  <section>
    <a @click.prevent class="logo" >
      EXCEL<span>VISION.</span>
      <div></div>
    </a>
    <div class="header-right">
      <input
          type="file"
          accept=".xlsx, .xls"
          @change="handleFileUpload"
          ref="fileInput"
          hidden
      >
      <button class="cta-btn" @click="triggerFileInput">导入Excel</button>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import * as XLSX from 'xlsx';
import {uploadExcel} from "../api/index.js";
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../store/OptionConfig.js";
import {analyzeColumns, detectRowCount} from "../utils/ExcelUtils.js";
import emitter from "../emitter/emitter.js";


// 策略配置
const STRATEGY_THRESHOLD = 1000000; // 前端处理最大行数
const fileInput = ref(null);
let isFrontend = false


// 数据存储结构
const {fileData,Ds,dataset,Ss,Hs,Vs} = storeToRefs(useOptionConfig())

// 触发文件选择
const triggerFileInput = () => fileInput.value.click();

// 核心文件处理
const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // 先进行前端行数检测
  const rowCount = await detectRowCount(file);

  // 根据行数选择处理策略
  const processingMode = rowCount > STRATEGY_THRESHOLD ? 'backend' : 'frontend';
  if(!fileData.value.raw) cleanup()
  if (processingMode === 'backend') {
    const result = await uploadExcel(file)
    console.log(result)
    isFrontend = false
  }else {
    // 总处理开始时间
    const totalStart = performance.now()
    isFrontend = true
    // 新增前端处理逻辑
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array', cellDates: true });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

      // 数据结构
      fileData.value = {
        rowCount: rawData.length - 1, // 排除表头
        columnStats: analyzeColumns(rawData,rawData[0]?.map(String) || [],),
      };
      dataset.value.source = rawData.slice(1) // 存储原始数据（排除表头）
      dataset.value.dimension = fileData.value.columnStats.map(i=>i.field)

      console.log('数据导入完成',dataset.value)

      importDone()
    };
    reader.readAsArrayBuffer(file);
  }

};

const importDone = () =>{
  if (fileData.value.columnStats){
    Ds.value[0] =  {
      id: 0,
      name: "ROOT",
      from: 'excel import',
      alias: 'ROOT',
      count: dataset.value.source.length,
      options:{
        filter: [],
        group: [],
      },
    }

    Ss.value[0].H = Hs.value[0]
    Ss.value[0].V = Vs.value[0]
    Ss.value[0].D = Ds.value[0]
    console.log('创建ROOT数据集')
    console.log('装载第一系列')

    emitter.emit('load-chart')
  }

}

// 清理数据
const cleanup = () => {
  fileData.value = {
    rowCount: 0,
  }
}

// 页面关闭时自动清理
window.addEventListener('beforeunload', cleanup);
</script>

<style scoped>
section{
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid var(--2-background-color);
  button{
    border-radius: 20px;
  }
}

.logo {
  font-size: 24px;
  font-weight: bold;
}

.logo span {
  color: var(--1-theme-color);
}

.header-right button {
  font-size: 18px;
  font-weight: bold;
  padding: 7px 25px;
  background-color: transparent;
  border: 1px solid var(--2-background-color);
  border-radius: 20px;
  transition: 0.3s;
  cursor: pointer;
}
.header-right button:hover {
  background-color: var(--theme-hover-color);
  border-color: var(--2-background-color);
  transform: scale(0.9);
}
</style>