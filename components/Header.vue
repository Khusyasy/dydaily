<script setup lang="ts">
const { version, tasks, checkins } = useTaskStore()

function handleExport() {
  const now = new Date()
  const data = JSON.stringify({
    version: LATEST_SAVE_VERSION,
    exportedAt: now,
    tasks: tasks.value,
    checkins: checkins.value,
  })
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `dydaily_${now.getTime()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function handleImport() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (event: Event) => {
    if (!(event.target instanceof HTMLInputElement)) {
      return
    }

    const file = event.target?.files?.[0]

    // TODO: change confirm with better ui
    if (!file || !confirm('Importing data will delete ALL existing data and it cannot be undone. Make sure you have a backup. Continue?')) {
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        if (!e.target?.result || typeof e.target.result !== 'string') {
          alert('Invalid file content')
          return
        }
        const parsed = JSON.parse(e.target.result)
        const saveRes = SaveSchema.safeParse(parsed)

        if (!saveRes.success) {
          alert('Invalid file format')
          return
        }

        const saveData = handleMigration(saveRes.data)

        version.value = saveData.version
        if (saveData.tasks) {
          const res = TasksSchema.safeParse(saveData.tasks)
          if (res.success) {
            tasks.value = res.data
          }
        }
        if (saveData.checkins) {
          const res = CheckinsSchema.safeParse(saveData.checkins)
          if (res.success) {
            checkins.value = res.data
          }
        }
      } catch (error) {
        console.error('Invalid JSON file:', error)
      }
    }
    reader.readAsText(file)
  }
  input.click()
}

const navitems = ref([
  { name: 'Tasks', to: '/', icon: 'mdi:clipboard-check' },
  { name: 'Calendar', to: '/calendar', icon: 'mdi:calendar' },
])
</script>

<template>
  <header class="w-full px-4 text-cyan-500 bg-gradient-to-br from-cyan-100/50 to-pink-100/50 shadow">
    <div class="flex flex-row items-center justify-between h-16 w-full max-w-4xl mx-auto gap-4">
      <div class="flex flex-row items-center h-full px-2">
        <img src="/logo.svg" alt="Logo" class="h-10 w-10" />
        <h1 class="pl-2 text-lg font-bold">DyDaily</h1>
      </div>
      <div class="flex flex-row items-center justify-start flex-1 h-full">
        <!-- TODO: add page transition or no?? -->
        <NuxtLink v-for="item in navitems" :key="item.name" :to="item.to"
          class="h-full px-4 flex items-center hover:bg-cyan-100/50" active-class="bg-cyan-200/50">
          <Icon :name="item.icon" class="w-5 h-5" />
          <span v-if="!isMobile()" class="ml-1 font-semibold">{{ item.name }}</span>
        </NuxtLink>
      </div>
      <div class="flex flex-row items-center">
        <button @click="handleExport" aria-label="Export tasks"
          class="p-2 rounded-s font-semibold flex items-center justify-center text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <Icon name="mdi:content-save" class="w-5 h-5" />
        </button>
        <button @click="handleImport" aria-label="Import tasks"
          class="p-2 rounded-e font-semibold flex items-center justify-center text-white bg-cyan-500 hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <Icon name="mdi:upload" class="w-5 h-5" />
        </button>
      </div>
    </div>
  </header>
</template>
