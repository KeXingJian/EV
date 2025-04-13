<script setup>

</script>

<template>
<div class="top-div">
  <h1>EV</h1>
  <div class="about-container">

    <div class="about-item">
      <h3>作者</h3>
    </div>
    <div class="about-item">
      <h3>贡献</h3>
    </div>
    <div class="about-item">

      <h3>联系</h3>
    </div>
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
  background-image: linear-gradient(135deg, var(--theme-hover-color), var(--hover-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.about-container{
  margin-right: 100px;
  display: flex;
  gap: 100px;
}
</style>