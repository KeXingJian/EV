<script setup>

</script>

<template>
  <div class="br" ></div>
</template>

<style scoped>
.br{
  position: relative;
  height: 8px;
}

.br:after{
  content: '';
  width: 100%;
  position: absolute;
  height: 2px;
  z-index: 0;
  background: linear-gradient(
      90deg,
      var(--2-background-color) 0%,
      var(--border-color) 50%,
      var(--2-background-color) 100%
  );
}

</style>