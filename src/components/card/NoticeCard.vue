<template>
  <div class="notifications-container">
    <div class="alert">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 alert-svg">
            <path clip-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" fill-rule="evenodd"></path>
          </svg>
        </div>
        <div class="alert-prompt-wrap">
          <p class="text-sm text-yellow-700"
             :style="{
                color: `${color}`
             }"
          >
            {{msg}}

            <a class="alert-prompt-link"
               @click.prevent="active"
               :style="{
                  color: `${activeColor}`
               }"
            >{{ link }}</a>
          </p>
        </div>
        <div class="flex-shrink-0">
         <CloseButton @click="toSign"></CloseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import CloseButton from "../svg/CloseButton.vue";

const props = defineProps({
  color:{
    type: String,
    required: true,
  },
  activeColor: {
    type: String,
    required: true,
  },
  msg:{
    type: String,
    required: true,
  },
  link:{
    type: String,
    required: false,
  },
  signFor:{
    type: Function,
    required: false,
  },
  active:{
    type: Function,
    required: false,
  }
})
const toSign = ()=>{
  props.signFor()
}
</script>


<style scoped>
.notifications-container {
  height: auto;
  font-size: 0.875rem;
  line-height: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.flex {
  display: flex;
  gap: 10px;
  justify-content: space-between;
}

.flex-shrink-0 {
  flex-shrink: 0;
}

.alert {
  background-color: var(--2-background-color);
  border-left-width: 4px;
  border-color: rgb(250 204 21);
  border-radius: 0.375rem;
  padding: 1rem;
}

svg {
  height: 1.25rem;
  width: 1.25rem;
  color: rgb(250 204 21) !important;
}

.alert-prompt-wrap p{
  margin-left: 0.75rem;

}

.alert-prompt-link {
  font-weight: 500;
  text-decoration: underline;
  cursor: pointer;
}

</style>
