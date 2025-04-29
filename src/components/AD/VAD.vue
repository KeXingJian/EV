<template>
  <ins
      class="adsbygoogle"
      :style="adStyle"
      :data-ad-client="adClient"
      :data-ad-slot="adSlot"
      :data-ad-format="adFormat"
  ></ins>
</template>
<script setup>
import { onMounted, computed } from 'vue'

const props = defineProps({
  adClient: {
    type: String,
    required: true
  },
  adSlot: {
    type: String,
    required: true
  },
  width: {
    type: [Number, String],
    default: 728
  },
  height: {
    type: [Number, String],
    default: 90
  },
  adFormat: {
    type: String,
    default: 'auto'
  }
})

// 动态广告样式
const adStyle = computed(() => ({
  display: 'inline-block',
  width: `${props.width}px`,
  height: `${props.height}px`
}))

// 广告加载逻辑
const loadAd = () => {
  if (window.adsbygoogle?.push) {
    window.adsbygoogle.push({})
  } else {
    setTimeout(loadAd, 50) // 循环检测直到脚本加载完成
  }
}

onMounted(() => {
  loadAd() // 组件挂载时触发加载
})
</script>
<style scoped>

</style>