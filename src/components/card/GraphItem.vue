<template>
  <div class="graph-item">
    <div class="header" @click="toggleDataset($event)">
      <div class="header-left">
        <Canvas></Canvas>
      </div>
      <div class="header-right">
        <AddButton @click.stop="addAxis($event)"></AddButton>
        <DropDown @click.stop></DropDown>
      </div>
    </div>
    <section class="Ys">
      <div>
        <div class="x">
          <X v-for="(axis,index) in H"
             :key="index"
             :model-item="axis"
          ></X>
        </div>
        <div class="y">
          <Y v-for="(axis,index) in V"
             :key="index"
             :model-item="axis"
          ></Y>
        </div>
        <div class="s">
          <Series v-for="(series,index) in S"
                   :key="index"
                   :model-item="series"
          ></Series>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import DropDown from "../svg/DropDown.vue";
import Canvas from "../svg/Canvas.vue";
import AddButton from "../svg/AddButton.vue";
import X from "./X.vue";
import Y from "./Y.vue";
import Series from "./S.vue";
import emitter from "../../emitter/emitter.js";
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../../store/OptionConfig.js";
import {computed} from "vue";

const toggleDataset = (event) => {
  event.currentTarget.nextElementSibling.classList.toggle('show')
  event.currentTarget.classList.toggle('rotate')
}

const props = defineProps({
  graph: {
    type: Object,
    required: true,
  }
})

const {Hs, Vs, Ss} = storeToRefs(useOptionConfig())

const H = computed(() => {
  return Hs.value.filter(h => {
    if (!h || !h.G) return false
    return h.id !==-1+h.G.name && h.G.id === props.graph.id
  })
})

const V = computed(() => {
  return Vs.value.filter(v => {
    if (!v || !v.G) return false
    return v.id !==-1+v.G.name && v.G.id === props.graph.id
  })
})

const S = computed(() => {
  return Ss.value.filter(s => {
    if (!s || !s.G) return false
    return s.G.id === props.graph.id
  })
})

const addAxis = (event) => {
  emitter.emit('show-menu',
      {
        x: event.clientX,
        y: event.clientY,
        target: props.graph
      }
  )
}

</script>

<style scoped>

.graph-item {
  overflow: hidden;
  cursor: pointer;
  display: grid;

  .header {
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: 300ms ease-in-out;
    background-color: var(--1-theme-color);

    .header-right {
      display: flex;
    }
  }

  .header:hover {
    background-color: var(--theme-hover-color);
  }
}

.rotate.header .header-right {
  svg:last-child {
    rotate: 180deg;
  }
}

svg {
  transition: rotate 150ms ease;
}

.Ys {
  display: grid;
  grid-template-rows: 0fr;
  transition: 300ms ease-in-out;

  > div {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}

.Ys.show {
  margin: 4px;
  grid-template-rows: 1fr;
}

.x, .y, .s {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 30px;
}

.x:before, .y:before, .s:before {
  top: -28px;
  content: '横轴';
  position: absolute;
  border-radius: 10px;
  width: 99%;
  z-index: 2;
  font-weight: bolder;
}

.y:before {
  content: '纵轴';
}

.s:before {
  content: '系列';
}

.x:after, .y:after {
  content: '';
  position: absolute;
  height: 2px;
  background: linear-gradient(
      90deg,
      var(--1-background-color) 0%,
      var(--2-background-color) 50%,
      var(--1-background-color) 100%
  );
  border-radius: 10px;
  width: 99%;
  top: calc(100% + 12px);
  z-index: 2;
}

</style>
