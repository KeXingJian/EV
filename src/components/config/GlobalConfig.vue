<script setup>
import ProgressBar from "../button/ProgressBar.vue";
import CheckBox from "../box/CheckBox.vue";
</script>

<template>
  <div class="global-config">
    <div class="t">
      <div class="config-item">
       <span>大量数据优化:</span>
        <CheckBox></CheckBox>
      </div>
      <div class="config-item">
       <span>采样优化:</span>
       <CheckBox></CheckBox>
      </div>
      <div class="config-item">
        <span>svg渲染:</span>
        <CheckBox></CheckBox>
      </div>
    </div>
    <div class="m">
      <div class="font">
        <span>标题</span>
        <div class="item">
          <span>颜色:</span>
          <div class="color-point"></div>
        </div>
        <div class="item">
          <span>显示:</span>
          <CheckBox></CheckBox>
        </div>
        <div class="item">
          <span>大小:</span>
          <ProgressBar :width="70"></ProgressBar>
        </div>
        <div class="item">
          <span>粗细:</span>
          <ProgressBar :width="70"></ProgressBar>
        </div>
        <div class="item">
          <span>上:</span>
          <ProgressBar :width="150"></ProgressBar>
        </div>
        <div class="item">
          <span>下:</span>
          <ProgressBar :width="150"></ProgressBar>
        </div>
      </div>
      <div class="legend">
        <span>图例</span>
        <div class="item">
          <span>显示:</span>
          <CheckBox></CheckBox>
        </div>
        <div class="item">
          <span>朝向:</span>
          <CheckBox></CheckBox>
        </div>
        <div class="item">
          <span>大小:</span>
          <ProgressBar :width="70"></ProgressBar>
        </div>
        <div class="item">
          <span>粗细:</span>
          <ProgressBar :width="70"></ProgressBar>
        </div>
        <div class="item">
          <span>上:</span>
          <ProgressBar :width="150"></ProgressBar>
        </div>
        <div class="item">
          <span>下:</span>
          <ProgressBar :width="150"></ProgressBar>
        </div>
      </div>
    </div>
    <div class="b">
      <div class="config-item">
        <span>质量:</span>
        <ProgressBar :width="50"></ProgressBar>
      </div>
    </div>
  </div>
</template>

<style scoped>
.global-config{
  background-color: var(--2-background-color);
  display: grid;
  gap: 10px;
  padding: 20px 4px;

}

.t{
  display: flex;
  gap: 20px;
  align-items: center;

}

.m{
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 1fr;
}

.font,.legend{
  display: flex;
  flex-direction: column;
  gap: 15px;
  >span{
    font-weight: bolder;
  }
  >div span{
    font-size: 15px;
  }
}

.color-point{
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #fff;
}


.item{
  display: flex;
  gap: 10px;
  align-items: center;
}

.config-item{
  display: flex;
  gap: 10px;
  align-items: center;

}

.t span{
  flex: 1;
  white-space: nowrap;
  font-weight: bolder;
}
.b span{
  font-weight: bolder;
}
</style>
