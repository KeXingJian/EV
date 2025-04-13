<script setup>

</script>

<template>
  <button class="button-with-icon">
    <svg class="icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
      <path
          d="m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 58 136-58 76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-58-136 58Zm34-102 102-44 104 44 56-96 110-26-10-112 74-84-74-86 10-112-110-24-58-96-102 44-104-44-56 96-110 24 10 112-74 86 74 84-10 114 110 24 58 96Zm102-318Zm-42 142 226-226-56-58-170 170-86-84-56 56 142 142Z"/>
    </svg>
    <span class="text">finish</span>
  </button>

</template>

<style scoped>
.button-with-icon {
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #0f988e;
  font-family: "Istok Web", sans-serif;
  letter-spacing: 1px;
  padding: 0 12px;
  text-align: center;
  width: 120px;
  height: 40px;
  font-size: 14px;
  text-transform: uppercase;
  font-weight: normal;
  border-radius: 3px;
  outline: none;
  user-select: none;
  cursor: pointer;
  transform: translateY(0px);
  position: relative;
  box-shadow: inset 0 30px 30px -15px rgba(255, 255, 255, 0.1),
  inset 0 0 0 1px rgba(255, 255, 255, 0.3),
  inset 0 1px 20px rgba(0, 0, 0, 0),
  0 3px 0 #0f988e,
  0 3px 2px rgba(0, 0, 0, 0.2),
  0 5px 10px rgba(0, 0, 0, 0.1),
  0 10px 20px rgba(0, 0, 0, 0.1);
  background: #15ccbe;
  color: white;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3);
  transition: 150ms all ease-in-out;
}

.button-with-icon .icon {
  margin-right: 8px;
  width: 24px;
  height: 24px;
  transition: all 0.5s ease-in-out;
}

.button-with-icon:active {
  transform: translateY(3px);
  box-shadow: inset 0 16px 2px -15px rgba(0, 0, 0, 0),
  inset 0 0 0 1px rgba(255, 255, 255, 0.15),
  inset 0 1px 20px rgba(0, 0, 0, 0.1),
  0 0 0 #0f988e,
  0 0 0 2px rgba(255, 255, 255, 0.5),
  0 0 0 rgba(0, 0, 0, 0),
  0 0 0 rgba(0, 0, 0, 0);
}

.button-with-icon:hover .text {
  transform: translateX(150%);
}

.button-with-icon:hover .icon {
  transform: translate(130%);
}

.text {
  transition: all 0.5s ease-in-out;
}

</style>