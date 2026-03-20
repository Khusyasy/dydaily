export const useClock = () => {
  const clockTime = useState('clockTime', () => new Date())

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

  return clockTime
}
