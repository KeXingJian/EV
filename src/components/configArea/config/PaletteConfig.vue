<template>
  <div class="palette-config">
    <div class="palettes">
      <div  class="palettes-item" v-for="(palette) in colorSet" :key="palette.name">
          <span>{{palette.name}}</span>
          <PaletteBox :points="palette.colors">
          </PaletteBox>
          <FavoriteButton  v-model="palette.isLove" ></FavoriteButton>
      </div>
    </div>
    <div class="own">
      <span>{{ $t('myColor') }}</span>
      <OwnPaletteBox></OwnPaletteBox>
    </div>
  </div>
</template>

<script setup>
import PaletteBox from "../../box/PaletteBox.vue";
import FavoriteButton from "../../button/FavoriteButton.vue";
import {computed} from "vue";
import OwnPaletteBox from "../../box/OwnPaletteBox.vue";
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../../../store/OptionConfig.js";
import {usePalettesConfig} from "../../../store/PalettesConfig.js";

const {palettes} = storeToRefs(usePalettesConfig())

// 计算属性：保持断点排序
const colorSet = computed(() => {
  return palettes.value.filter((p,index) => index !== 0)
});

</script>

<style scoped>
.palettes {
  display: flex;
  width: 500px;
  flex-wrap: wrap;
}

.palette-config {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px - 42px);
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 8px;
}
.palette-config::-webkit-scrollbar {
  display: none;
}


.palettes-item{
  flex: 1;
  display: flex;
  gap: 10px;
  padding: 10px 10px;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px;
  span{
    width: 20px;
  }
  cursor: pointer;
}

.palettes-item:hover{
  background: var(--hover-color);
  transition: 300ms ease-in-out;
}

.own{
  width: 500px;
  display: grid;
  gap: 10px;
  align-items: center;
}

svg {
  transition: rotate 150ms ease;
}

span{
  font-weight: bolder;
}
</style>