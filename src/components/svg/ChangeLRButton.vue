<script setup>

</script>

<template>
  <div class="svg-box">
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M280-160 80-360l200-200 56 57-103 103h287v80H233l103 103-56 57Zm400-240-56-57 103-103H440v-80h287L624-743l56-57 200 200-200 200Z"/></svg>
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