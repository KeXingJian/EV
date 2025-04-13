<script setup>

</script>

<template>
  <div class="svg-box">
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
  </div>
</template>

<style scoped>
.svg-box{
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 4px;
  padding: 4px;
  transition: 300ms ease-in-out;
}

.svg-box:hover{
  background: var(--hover-color);
}
</style>
