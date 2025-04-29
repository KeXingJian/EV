<template>
  <div class="form" :style="{
    width: `${width}px`
  }">
    <input
        class="input"
        :placeholder="text"
        required=""
        type="text"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
    >
    <span class="input-border"></span>
  </div>
</template>

<script setup>
defineProps({
  text:{
    type: String,
    required:true
  },
  width:{
    type: Number,
    required:true
  },
  // v-model 绑定的值
  modelValue: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.form {
  --border-height: 1px;
  --border-before-color: rgba(221, 221, 221, 0.39);
  --border-after-color: #5891ff;
  --input-hovered-color: #4985e01f;
  position: relative;
  width: 0;
}
/* styling of Input */
.input {
  color: var(--font-color);
  font-size: 0.9rem;
  background-color: transparent;
  width: 100%;
  box-sizing: border-box;
  padding-inline: 0.5em;
  padding-block: 0.7em;
  border: none;
  border-bottom: var(--border-height) solid var(--border-before-color);
}
/* styling of animated border */
.input-border {
  position: absolute;
  background: var(--border-after-color);
  width: 0%;
  height: 2px;
  bottom: 0;
  left: 0;
  transition: 0.3s;
}
/* Hover on Input */
input:hover {
  background: var(--input-hovered-color);
}

input:focus {
  outline: none;
}
/* here is code of animated border */
input:focus ~ .input-border {
  width: 100%;
}
/* === if you want to do animated border on typing === */
/* remove input:focus code and uncomment below code */
/* input:valid ~ .input-border{
  width: 100%;
} */

</style>
