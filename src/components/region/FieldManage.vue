<template>
  <div class="field-manage">
    <div class="index">
      <span class="head">索引</span>
      <div v-for="(item,index) in fields.map(item => item.index)" :key="index" class="index-item">
        <span>
           {{ item }}
        </span>
      </div>
    </div>
    <div class="file">
      <span class="head">字段</span>
      <div v-for="(item,index) in fields.map(item => item.field)" :key="index" class="file-item">
       <span>
           {{ item }}
        </span>
      </div>
    </div>
    <div class="type">
      <span class="head">类型</span>
      <div v-for="(item,index) in fields.map(item => item.type)" :key="index" class="type-item">
        <span>
           {{ item }}
        </span>
      </div>
    </div>
    <div class="sole">
      <span class="head">唯一性</span>
      <div v-for="(item,index) in fields.map(item => item.isSole)" :key="index" class="type-item">
        <Check v-if="item"></Check>
        <Close v-else></Close>
      </div>
    </div>
  </div>
</template>
<script setup>
import {onMounted, ref} from "vue";
import Close from "../svg/Close.vue";
import Check from "../svg/Check.vue";
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../../store/OptionConfig.js";
import ExcelColumnMap from "../../utils/ExcelColumnMapUtils.js";

const {fileData} = storeToRefs(useOptionConfig())

const fields = ref([])

onMounted(()=>{
  fileData.value.columnStats.forEach(item  =>{
    fields.value.push({
      index: ExcelColumnMap.getLetter(item.index+1),
      field: item.field,
      type: item.type,
      isSole: item.isUnique,
    })
  })
})
</script>

<style scoped>
.field-manage{
  display: flex;
  justify-content: space-between;
}

.index,.file,.type,.sole{
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;

  span.head{
    color: var(--active-color);
  }
  span{
    font-weight: bold;
  }
}
.index-item,.file-item,.type-item,.type-item{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
}
</style>
