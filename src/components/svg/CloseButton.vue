<script setup>

</script>

<template>
  <div class="svg-box">
    <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#e8eaed"
    >
      <path
          d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
      />
    </svg>
  </div>

</template>

<style scoped>
svg {
  border: 2px solid var(--border-color);
  border-radius: 5px;
  transition: 300ms ease-in-out;
  flex: 1;
}
svg:hover {
  background-color: var(--delete-color);
  transform: scale(0.9);
}

.svg-box{
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 4px;
  padding: 4px;
  transition: 300ms ease-in-out;
}

</style>