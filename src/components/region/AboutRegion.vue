<script setup>

import VAD from "../AD/VAD.vue";
</script>

<template>
<div class="top-div">
  <h1>EV</h1>
  <div class="about-container">
  </div>
</div>
</template>

<style scoped>
.top-div{
  display: flex;
  margin: 40px 20px;
  justify-content: space-between;
}

h1{
  text-transform: uppercase;
  font-family: "Libre Baskerville", serif;
  font-size: 200px;
  line-height: 100%;
  font-weight: bold;
  background-image: radial-gradient(circle at 100% 107%, #ff89cc 0%, #9cb8ec 30%, #00ffee 60%, #62c2fe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.about-container{
  margin-right: 100px;
  display: flex;
  gap: 100px;
}
</style>