<template>
  <div class="notice-container show">
    <div class="notice-head" @click="toggleNotice($event)">
      <div class="left">
        <NoticeButton :count="info.length" @click.stop="type=0"></NoticeButton>
        <WarningButton :count="warning.length" @click.stop="type=1"></WarningButton>
        <ErrorButton :count="error.length" @click.stop="type=2"></ErrorButton>
      </div>
      <div class="right">
        <HelpButton @click.stop="1"></HelpButton>
        <DropDown></DropDown>
      </div>
    </div>
    <section class="notice-items">
      <NoticeCard
          v-if="type ===0"
          v-for="(item,index) in info"
          :key="index"
          activeColor="#0d6e6e"
          color="#15ccbe"
          :msg="item.msg"
          :link="item.link"
          :active="item.active"
          :sign-for="()=>{
            info.splice(index,1);
          }"
      ></NoticeCard>
      <NoticeCard
          v-if="type ===1"
          v-for="(item,index) in warning"
          :key="index"
          activeColor="rgb(141, 56, 0)"
          color="rgb(250 204 21)"
          :msg="item.msg"
          :link="item.link"
          :sign-for="()=>{
            warning.splice(index,1);
          }"
      ></NoticeCard>
      <NoticeCard
          v-if="type ===2"
          v-for="(item,index) in error"
          :key="index"
          activeColor="#ff3d3d"
          color="#dc2626"
          :msg="item.msg"
          :link="item.link"
          :sign-for="()=>{
            error.splice(index,1);
          }"
      ></NoticeCard>
    </section>
  </div>
</template>

<script setup>
import NoticeButton from "../../svg/NoticeButton.vue";
import WarningButton from "../../svg/WarningButton.vue";
import ErrorButton from "../../svg/ErrorButton.vue";
import HelpButton from "../../svg/HelpButton.vue";
import NoticeCard from "../../card/NoticeCard.vue";
import DropDown from "../../svg/DropDown.vue";
import {ref} from "vue";
import {storeToRefs} from "pinia";
import {useNotice} from "../../../store/Notice.js";

const toggleNotice = (event) => {
  event.currentTarget.parentElement.classList.toggle('show')
  event.currentTarget.classList.toggle('rotate')
}
const {info,warning,error} = storeToRefs(useNotice())
const type = ref(0)


</script>

<style scoped>
.notice-container {
  max-height: 400px;
  height: 400px;
}

.show {
  height: 42px;
}

.notice-head {
  border: 1px solid var(--hover-color);
  padding: 4px;
  height: 42px;
  transition: 300ms ease-in-out;
}

.notice-head:hover {
  background: var(--hover-color);
}

.notice-head {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .left, .right {
    display: flex;
    gap: 10px;
    align-items: center;
  }
}

.rotate {
  svg:last-child {
    rotate: 0deg;
  }
}

svg {
  transition: rotate 150ms ease;
  rotate: 180deg;
}

.notice-items {
  display: flex;
  flex-direction: column;

  gap: 10px;
  overflow-y: scroll;
  overflow-x: hidden;
  height: 358px;
}

.notice-items::-webkit-scrollbar {
  display: none;
}


</style>