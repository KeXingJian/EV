<template>
  <div class="button-top" @click.stop>
    <div class="box">
      <span>
        <slot></slot>
      </span>
      <span class="option-value">
         {{ currentValue }}
      </span>
    </div>
  </div>

</template>

<script setup>
defineProps({
  currentValue:{
    type: String,
    default: "未定义"
  }
})
</script>
<style scoped>
.button-top{
  position: relative;
}
.box{
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  .option-value{
    color: var(--active-color);
  }
}

span{
  font-weight: bolder;
}
</style>
