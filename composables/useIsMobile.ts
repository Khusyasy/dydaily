export const useIsMobile = () => {
  const isMobile = ref(false)

  const onResize = () => {
    isMobile.value = window.innerWidth < 640
  }

  onMounted(() => {
    onResize()
    window.addEventListener('resize', onResize)
  })
  onUnmounted(() => window.removeEventListener('resize', onResize))

  return isMobile
}
