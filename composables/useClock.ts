export const useClock = () => {
  const clockTime = useState('clockTime', () => new Date())
  // clock sync setup is on 'app.vue'
  return clockTime
}
