<script setup>
useHead({
  title: 'DyDaily',
  meta: [
    { name: 'description', content: 'Simple App to Track Your Dailies' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
})

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
    <Header />
    <NuxtPage
      :transition="{
        name: 'page',
        mode: 'out-in',
      }"
    />
  </div>
  <ConfirmModal />
</template>
