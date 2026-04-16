import { ref } from 'vue'

export const useRegisterSW = () => ({
  needRefresh: ref(false),
  offlineReady: ref(false),
  updateServiceWorker: async () => {},
})

export const display = 'standalone'
export const installPrompt = false
export const periodicSyncForUpdates = 0

export default {}
