<template>
  <div class="notice-container show">
    <div class="notice-head" @click="toggleNotice($event)">
      <div class="left">
        <NoticeButton @click.stop="1"></NoticeButton>
        <WarningButton @click.stop="1"></WarningButton>
        <ErrorButton @click.stop="1"></ErrorButton>
      </div>
      <div class="right">
        <HelpButton @click.stop="1"></HelpButton>
        <DropDown></DropDown>
      </div>
    </div>
    <section class="notice-items">
      <NoticeCard></NoticeCard>
      <NoticeCard></NoticeCard>
      <NoticeCard></NoticeCard>
      <NoticeCard></NoticeCard>
    </section>
  </div>

</template>

<script setup>
import NoticeButton from "../svg/NoticeButton.vue";
import WarningButton from "../svg/WarningButton.vue";
import ErrorButton from "../svg/ErrorButton.vue";
import HelpButton from "../svg/HelpButton.vue";
import NoticeCard from "../card/NoticeCard.vue";
import DropDown from "../svg/DropDown.vue";

const toggleNotice = (event) => {
  event.currentTarget.parentElement.classList.toggle('show')
  event.currentTarget.classList.toggle('rotate')
}
</script>

<style scoped>
.notice-container{
  max-height: 400px;
}

.show{
  height: 42px;
}

.notice-head {
  border: 1px solid var(--hover-color);
  padding: 4px;
  height: 42px
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
  padding: 10px;
  gap: 10px;
  overflow-y: scroll;
  overflow-x: hidden;
  max-height: 358px;
}

.notice-items::-webkit-scrollbar {
  display: none;
}


</style>