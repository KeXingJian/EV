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

const {palettes} = storeToRefs(useOptionConfig())

// 计算属性：保持断点排序
const colorSet = computed(() => {
  return palettes.value.filter((p,index) => index !== 0)
});

</script>

<style scoped>
.palettes {
  display: flex;
  overflow: hidden;
  width: 500px;
  flex-wrap: wrap;
}
.palette-config{
  background: var(--2-background-color);
  padding: 8px;
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
}

.palettes-item:hover{
  background: var(--hover-color);
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