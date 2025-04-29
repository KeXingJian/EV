<template>
  <section>
    <a @click.prevent="test" class="logo">
      EXCEL<span>VISION.</span>
      <span class="label">测试版</span>
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
import {ref} from 'vue';
import * as XLSX from 'xlsx';
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../store/OptionConfig.js";
import {analyzeColumns2, detectRowCount} from "../utils/ExcelUtils.js";
import emitter from "../emitter/emitter.js";
import {pushMsg} from "../utils/MsgUtils.js";
import {init} from "../utils/newArch/InitUtils.js";
import {searchDocuments, uploadDocuments} from "../api/EVsApi.js";
import VAD from "./AD/VAD.vue";



const fileInput = ref(null);


const store = useOptionConfig()
// 数据存储结构
const {fileData, dataset, Ss, Ds} = storeToRefs(useOptionConfig())

// 触发文件选择
const triggerFileInput = () => fileInput.value.click();

// 核心文件处理
const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;


  if (!fileData.value.raw) cleanup()


  // 新增前端处理逻辑
  const reader = new FileReader();
  reader.onload = async (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, {type: 'array', cellDates: true});
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(sheet, {header: 1, defval: null});

    // 数据结构
    fileData.value = {
      rowCount: rawData.length - 1, // 排除表头
      columnStats: analyzeColumns2(rawData, rawData[0]?.map(String) || [],),
    };
    dataset.value.source = rawData.slice(1) // 存储原始数据（排除表头）
    dataset.value.dimension = fileData.value.columnStats.map(i => i.field)


    importDone()
  };
  reader.readAsArrayBuffer(file);


};

const importDone = () => {
  if (fileData.value.columnStats) {
    pushMsg(0, generateAnalysisReport(fileData.value.columnStats))
    init()
    Ds.value[0].from = 'excel import'
    emitter.emit('load-chart')
  }

}

const generateAnalysisReport = (data) => {
  const anomalies = data.filter(item => item.hasAnomaly);

  if (anomalies.length > 0) {
    const anomalyFields = anomalies.map(item => item.field);
    return `您的数据解析完毕,共计${fileData.value.rowCount}条数据条目，但是发现字段[${anomalyFields.join(', ')}]下的条目存在数据类型不一致或为空的情况，在必要时刻将移除该条目`;
  }
  return `您的数据解析完毕${fileData.value.rowCount}条数据条目，可以开始构建系列啦!!!`;
}


// 清理数据
const cleanup = () => {
  fileData.value = {
    rowCount: 0,
    columnStats: []
  }
}

const test = async () => {
  const res = await searchDocuments(1, '道德目标', true)
  console.log(res.data)
}

// 页面关闭时自动清理
window.addEventListener('beforeunload', cleanup);
</script>

<style scoped>
section {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid var(--2-background-color);

  button {
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

.header-right {

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

.label {
  font-size: 10px;
}
</style>