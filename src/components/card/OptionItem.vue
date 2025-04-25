<template>
  <ul class="options" v-if="show" :style="{
    left: `${position.x}px`,
    top: `${position.y}px`
  }">
    <li class="option-item" v-for="(item) in options" :key="item.index" @click="toOption(item)">
      <button>
        <span>{{ item.label }}</span>
      </button>
    </li>
  </ul>
</template>

<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import emitter from "../../emitter/emitter.js";

const show = ref(false);

let options = null
let target = null
let handle = null

const position = ref({
  x: 0,
  y: 0
})

const showOptions  = (args)=>{
  position.value.x = args.x;
  position.value.y = args.y;
  options = args.options;
  target = args.target;
  handle = args.handle;
  show.value = true;

}

const toOption = (item)=>{
  handle(item.index,target);
}

const handleClickOutside = ()=>{
  show.value = false
}

emitter.on('show-options',showOptions)
onMounted(()=>{
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(()=>{
  document.removeEventListener('click', handleClickOutside)
  emitter.off('show-options',showOptions)
})
</script>

<style scoped>

ul{
  position: fixed;
  list-style-type: none;
  z-index: 9999;
  display: block;
}

.option-item{

  padding: 10px;
  background: var(--1-background-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 300ms ease-in-out;
  button{
    transition: 300ms ease-in-out;
    cursor: pointer;
    border: none;
    background: var(--1-background-color);
    max-width: 150px;
    min-width: 80px;
  }
  span{
    white-space: nowrap;      /* 禁止换行 */
    overflow: hidden;         /* 隐藏溢出内容 */
    text-overflow: ellipsis;  /* 显示省略号 */
    width: 100%;              /* 必须设置宽度（或max-width）*/
    display: block;           /* 块级元素或 inline-block */
  }

}
.option-item:hover {
  background: var(--theme-hover-color);
  button{
    background: var(--theme-hover-color);
  }
}

.option-item:first-child {
  border-radius: 0.5rem 0.5rem 0 0;
}

.option-item:last-child {
  border-radius: 0 0 0.5rem 0.5rem;
}

/* 修改部分 */
.option-item:only-child {
  border-radius: 0.5rem;
  border-bottom: none;
}
</style>