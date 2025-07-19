<script setup >
import {useOptionConfig} from "../../store/OptionConfig.js";

const store = useOptionConfig()

</script>

<template>
  <div class="button-div" >
    <input type="checkbox" id="lock" />
    <label @click.stop="store.changeLock" for="lock" class="lock-label">
  <span class="lock-wrapper">
    <span class="shackle"></span>
    <svg
        class="lock-body"
        width=""
        height=""
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
      <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0 5C0 2.23858 2.23858 0 5 0H23C25.7614 0 28 2.23858 28 5V23C28 25.7614 25.7614 28 23 28H5C2.23858 28 0 25.7614 0 23V5ZM16 13.2361C16.6137 12.6868 17 11.8885 17 11C17 9.34315 15.6569 8 14 8C12.3431 8 11 9.34315 11 11C11 11.8885 11.3863 12.6868 12 13.2361V18C12 19.1046 12.8954 20 14 20C15.1046 20 16 19.1046 16 18V13.2361Z"
          fill="white"
      ></path>
    </svg>
  </span>
    </label>
  </div>
</template>

<style scoped>
.button-div {
  position: absolute;
  right: 30px;
  top: 2px;
  z-index: 999;
}

#lock {
  display: none;
}
.lock-label {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(80, 80, 80);
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s;
}
.lock-wrapper {
  width: fit-content;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: rotate(-10deg);
}
.shackle {
  background-color: transparent;
  height: 5px;
  width: 10px;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  border-top: 3px solid white;
  border-left: 3px solid white;
  border-right: 3px solid white;
  transition: all 0.3s;
}
.lock-body {
  width: 10px;
}
#lock:checked + .lock-label .lock-wrapper .shackle {
  transform: rotateY(150deg) translateX(3px);
  transform-origin: right;
}
#lock:checked + .lock-label {
  background-color: var(--theme-hover-color);
}
.lock-label:active {
  transform: scale(0.9);
}

</style>