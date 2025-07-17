<script setup>
import emitter from "../../emitter/emitter.js";
import {onMounted, onUnmounted, ref} from "vue";
import {useOptionConfig} from "../../store/OptionConfig.js";
import {storeToRefs} from "pinia";

const doc = ref(null)
const {lang} = storeToRefs(useOptionConfig())

const scrollToBottom = ()=>{
  if (doc) {
    // 使用 scrollTo 实现平滑滚动
    doc.value.scrollTo({
      top: doc.value.scrollHeight,
      behavior: 'smooth'
    })
  }
}

onMounted(() => {
  emitter.on("scroll-to-bottom", scrollToBottom);
})

onUnmounted(()=>{
  emitter.off("scroll-to-bottom");
})

</script>

<template>
  <div ref="doc" class="doc">
    <div class="container">
      <h2>{{ $t('series') }}</h2>
      <span>
        <span class="im">C({{ $t('coordinate') }})</span>: {{ $t('DSeries.A') }}<span class="im t">{{ $t('DSeries.B') }}</span>{{ $t('DSeries.C') }}<span class="im t">{{ $t('DSeries.D') }}</span>{{ $t('DSeries.E') }}<br>
        <span class="im">X</span>: {{ $t('DSeries.F') }}<span class="im t">{{ $t('DSeries.G') }}</span>{{ $t('DSeries.H') }}<br>
        <span class="im">Y</span>: {{ $t('DSeries.I') }}<span class="im t">{{ $t('DSeries.J') }}</span><br>
        <span class="im">D({{ $t('dataset') }})</span>: {{ $t('DSeries.K') }}
      </span>
    </div>
    <div class="container">
      <h2>{{ $t('coordinate') }}</h2>
      <span>
        {{ $t('DC.A') }}<span class="im t">{{ $t('DSeries.D') }}</span>{{ $t('DSeries.C') }}<span class="im t">{{ $t('DC.B') }}</span>{{ $t('DC.D') }}
      </span>
    </div>
    <div class="container">
      <h2>{{ $t('sampling') }}</h2>
      <span>
        <span class="im">{{ $t('Sampling.A') }}</span>: {{ $t('Sampling.B') }}<br>
        <span class="im">{{ $t('Sampling.C') }}</span>: {{ $t('Sampling.D') }}<span class="im t">{{ $t('Sampling.E') }}</span>{{ $t('Sampling.F') }}<span class="im t">{{ $t('Sampling.G') }}</span>{{ $t('Sampling.H') }}<span class="im t">{{ $t('Sampling.I') }}</span>{{ $t('Sampling.J') }}<br>
        <span class="im">{{ $t('Sampling.K') }}</span>: {{ $t('Sampling.L') }}<br>
        <span class="im">{{ $t('Sampling.M') }}</span>: {{ $t('Sampling.N') }}<br>
      </span>
      <img v-if="lang" src="/src/assets/zh.png" alt="zh">
      <img v-else src="/src/assets/en.png" alt="en">
    </div>
    <div class="container">
      <h2>{{ $t('dataEdition') }}</h2>
      <span>
        <span class="im">{{ $t('field') }}</span>: <span class="im t">{{ $t('DDataEdition.A') }}</span>{{ $t('DDataEdition.B') }}<br>
        <span class="im">{{ $t('DDataEdition.C') }}</span>: {{ $t('DDataEdition.D') }}<span class="im t">{{ $t('DDataEdition.E') }}</span>{{ $t('DDataEdition.F') }}<span class="im t">{{ $t('DDataEdition.G') }}</span>{{ $t('DDataEdition.H') }}<span class="im t">{{ $t('DDataEdition.I') }}</span>{{ $t('DDataEdition.J') }}<br>
        <span class="im">{{ $t('DDataEdition.K') }}</span>: {{ $t('DDataEdition.L') }}<span class="im t">{{ $t('DDataEdition.M') }}</span>{{ $t('DDataEdition.N') }}
      </span>
    </div>
    <div class="container">
      <h2>{{ $t('privacyPolicy') }}</h2>
      <span>
        <span class="im">{{ $t('DData.A') }}</span>: {{ $t('DData.B') }}<span class="im t">{{ $t('DData.C') }}</span>{{ $t('DData.D') }}<span class="im t">{{ $t('DData.E') }}</span><br>
        <span class="im">{{ $t('DData.F') }}</span>: {{ $t('DData.G') }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.doc {
  margin-left: 8px;
  overflow: scroll;
}

.doc::-webkit-scrollbar {
  display: none;
}

.doc span {
  color: var(--font-color);
  line-height: 1.8; /* 推荐 1.5-1.8 倍字号 */
  margin-bottom: 15px;
  font-size: 20px;
}

.container {
  border: 1px solid var(--2-background-color);
  border-radius: 1em;
  margin-bottom: 20px;
  padding: min(2em, 15%);


}

h2{
  font-size: 2em;
  font-weight: bolder;
  margin-bottom: 1em;
}

span{
  margin-top: 1em;
  font-weight: initial;
}

.im{
  font-size: 25px;
  font-weight: bolder;

}

.t{
  color: var(--active-color) !important;
}

img{
  width: 1000px;
  height: 400px;
}
</style>