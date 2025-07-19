<template>
  <div class="field-manage">
    <div class="index">
      <span class="head">{{ $t('index') }}</span>
      <div v-for="(item,index) in fileData.columnStats.map(item => ExcelColumnMap.getLetter(item.index+1))" :key="index" class="index-item">
        <span>
           {{ item }}
        </span>
      </div>
    </div>
    <div class="file">
      <span class="head">{{ $t('field') }}</span>
      <div v-for="(item,index) in fileData.columnStats.map(item => item.field)" :key="index" class="file-item">
       <span>
           {{ item }}
        </span>
      </div>
    </div>
    <div class="type">
      <span class="head">{{ $t('type') }}</span>
      <div v-for="(item,index) in fileData.columnStats.map(item => item.type)" :key="index" class="type-item">
        <span>
           {{ item }}
        </span>
      </div>
    </div>
<!--    <div class="sole">-->
<!--      <span class="head">{{ $t('sole') }}</span>-->
<!--      <div v-for="(item,index) in fileData.columnStats.map(item => item.isUnique)" :key="index" class="type-item">-->
<!--        <Check v-if="item"></Check>-->
<!--        <Close v-else></Close>-->
<!--      </div>-->
<!--    </div>-->
  </div>
</template>
<script setup>
import Close from "../../svg/Close.vue";
import Check from "../../svg/Check.vue";
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../../../store/OptionConfig.js";
import ExcelColumnMap from "../../../utils/ExcelColumnMapUtils.js";

const {fileData} = storeToRefs(useOptionConfig())

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
