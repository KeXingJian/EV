<template>
  <nav ref="navElement" class="dynamic-menu">
    <span
        v-for="(item, index) in menuItems"
        :key="index"
        :class="{ active: activeIndex === index }"
        @click="setActive(index, $event)"
    >
      {{ item }}
    </span>
    <div
        id="indicator"
        :class="{ change: isChanged }"
        :style="indicatorStyle"
    />

  </nav>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => ['使用手册', '数据编辑']
  }
})

const activeIndex = ref(0)
const isChanged = ref(false)
const navElement = ref(null)
const currentIndicator = ref({ left: 0, width: 0 })

const menuItems = ref([...props.items])

const indicatorStyle = computed(() => ({
  left: `${currentIndicator.value.left}px`,
  width: `${currentIndicator.value.width}px`,
  filter: `hue-rotate(${Math.random() * 360}deg)`
}))

const setActive = (index, event) => {
  activeIndex.value = index
  isChanged.value = !isChanged.value

  const target = event.target
  currentIndicator.value = {
    left: target.offsetLeft,
    width: target.offsetWidth
  }
}

onMounted(() => {
  // 初始化第一个菜单项的指示器位置
  const firstItem = navElement.value.querySelector('a')
  if (firstItem) {
    currentIndicator.value = {
      left: firstItem.offsetLeft,
      width: firstItem.offsetWidth
    }
  }
})
</script>

<style scoped>
.dynamic-menu {
  position: relative;
  display: flex;
  gap: 30px;
  background-color: var(--1-background-color);
  padding: 15px 60px;
  width: 600px;
}

.dynamic-menu span {
  position: relative;
  color: var(--font-color);
  text-decoration: none;
  font-size: 1.5em;
  z-index: 2;
  height: 75px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 30px;
  transition: 0.5s;
  cursor: pointer;
  font-weight: bolder;
  flex: 1;
  width: 150px;
}

.dynamic-menu span.active {
  color: var(--font-color);

}

#indicator {
  position: absolute;
  height: 75px;
  background-color: #29fd53;
  z-index: 1;
  transition: 0.5s;
  display: block;
}

#indicator::before,
#indicator::after {
  content: '';
  position: absolute;
  width: 50px;
  height: 15px;
  background-color: #29fd53;
  border-radius: 15px;
  transition: 0.5s;
}

#indicator::before {
  left: -30px;
  box-shadow: 15px 30px #29fd53,
  5px 60px #29fd53,
  -15px 15px #222327,
  -10px 45px #222327;
}

#indicator::after {
  right: -30px;
  box-shadow: 5px 30px #29fd53,
  -15px 60px #29fd53,
  15px 15px #222327,
  10px 45px #222327;
}

#indicator.change::before {
  left: -10px;
  box-shadow: -15px 30px #29fd53,
  -5px 60px #29fd53,
  -15px 15px #222327,
  -20px 45px #222327;
}

#indicator.change::after {
  right: -20px;
  box-shadow: 10px 30px #29fd53,
  20px 60px #29fd53,
  15px 15px #222327,
  25px 45px #222327;
}


</style>