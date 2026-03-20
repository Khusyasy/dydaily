<script setup lang="ts">
const clockTime = useClock()
</script>

<template>
  <p class="text-lg font-bold text-gray-800">
    {{ timeFormat(clockTime) }}
  </p>
</template>
