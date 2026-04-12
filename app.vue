<script setup lang="ts">
useHead({
  title: 'DyDaily',
  meta: [
    { name: 'description', content: 'Simple App to Track Your Dailies' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
})

const clockTime = useClock()

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

// const { $pwa } = useNuxtApp()

// onMounted(() => {
//   console.log($pwa.isPWAInstalled)
//   if ($pwa.offlineReady)
//     alert('App ready to work offline')
// })
</script>

<template>
  <NuxtPwaManifest />
  <div class="min-h-screen bg-white">
    <AppHeader />
    <NuxtPage
      :transition="{
        name: 'page',
        mode: 'out-in',
      }"
    />
  </div>
  <ConfirmModal />
</template>
