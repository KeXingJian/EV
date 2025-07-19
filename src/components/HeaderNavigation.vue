<template>
  <section>
    <a class="logo">
      EXCEL<span>VISION.</span>
      <span class="label">v1.3.3</span>
    </a>

    <div class="header-right">
      <input
          type="file"
          accept=".xlsx, .xls"
          @change="handleFileUpload"
          ref="fileInput"
          hidden
      >
      <button class="cta-btn" @click="triggerFileInput">{{ $t('import') }}</button>
    </div>
  </section>
</template>

<script setup>
import {ref} from 'vue';
import * as XLSX from 'xlsx';
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../store/OptionConfig.js";
import {analyzeColumns2} from "../utils/ExcelUtils.js";
import emitter from "../emitter/emitter.js";
import {pushMsg} from "../utils/MsgUtils.js";
import {init} from "../utils/newArch/InitUtils.js";
import {useI18n} from "vue-i18n";
const { t } = useI18n()

const fileInput = ref(null);

// 数据存储结构
const {fileData, dataset, Ss, Ds} = storeToRefs(useOptionConfig())

// 触发文件选择
const triggerFileInput = () => fileInput.value.click();

// 核心文件处理
const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return

  Ds.value = Ds.value.filter(i=>i.id===-1)

  if (!fileData.value.raw) cleanup()

  const reader = new FileReader();
  reader.onload = async (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, {type: 'array', cellDates: true});
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(sheet, {header: 1, defval: null});
    const endData = rawData.slice(1)
    // 数据结构
    fileData.value = {
      rowCount: rawData.length - 1, // 排除表头
      columnStats: analyzeColumns2(endData, rawData[0]?.map(String) || [],),
    };

    dataset.value.source =  endData// 存储原始数据（排除表头）
    dataset.value.dimension = fileData.value.columnStats.map(i => i.field)

    importDone()
  };
  reader.readAsArrayBuffer(file);

};

const importDone = () => {
  if (fileData.value.columnStats) {
    pushMsg(0, generateAnalysisReport(fileData.value.columnStats))
    Ds.value[0].from = 'excel import'
    Ds.value[0].groupCondition.length = 0
    Ds.value[0].filterConditions.length = 0
    Ds.value[0].filterConditions.filterChain = null
    init()
    emitter.emit('load-chart')
  }

}

const generateAnalysisReport = (data) => {

  const anomalies = data.filter(item => item.hasAnomaly)
  const noUniques = data.filter(item => !item.isUnique)

  data.forEach(item => {
    if (item.change4N.length!==0){
      pushMsg(2,`${t('Notice.G')}${item.field}${t('Notice.H')}[${item.change4N}]`)
    }

  })
  if (noUniques.length > 0) {
    const noUniquesFields = noUniques.map(item => item.field)
    pushMsg(1,`${t('Notice.G')}${noUniquesFields.join(', ')}${t('Notice.I')}`)
  }

  if (anomalies.length > 0) {
    const anomalyFields = anomalies.map(item => item.field);
    return `${t('Notice.B')}${fileData.value.rowCount}${t('Notice.C')}${anomalyFields.join(', ')}${t('Notice.D')}`;
  }
  return `${t('Notice.B')}${fileData.value.rowCount}${t('Notice.E')}`;
}


// 清理数据
const cleanup = () => {
  fileData.value = {
    rowCount: 0,
    columnStats: []
  }
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

.header-right .cta-btn {
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