<script setup lang="ts">
const clockTime = ref(new Date())

let clockTimeout: ReturnType<typeof setTimeout>
const clockSync = () => {
  const now = new Date()
  now.setMilliseconds(0)
  clockTime.value = now

  const msToNextSecond = 1000 - new Date().getMilliseconds()
  clockTimeout = setTimeout(clockSync, msToNextSecond)
}
onMounted(() => {
  const now = new Date()
  now.setMilliseconds(0)
  clockTime.value = now
  const msToNextSecond = 1000 - new Date().getMilliseconds()
  clockTimeout = setTimeout(clockSync, msToNextSecond)
})
onUnmounted(() => clearTimeout(clockTimeout))
</script>

<template>
  <p class="text-lg font-bold text-gray-800">
    {{ timeFormat(clockTime) }}
  </p>
</template>
