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

const confirm = useConfirm()

function handleImport() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = async (event: Event) => {
    if (!(event.target instanceof HTMLInputElement)) {
      return
    }

    const file = event.target?.files?.[0]
    const confirmed = await confirm.open({
      title: 'Import',
      message: 'Importing data will delete ALL existing data and it cannot be undone. Make sure you have a backup.',
    })
    if (!file || !confirmed) {
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
      }
      catch (error) {
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

const isMobile = useIsMobile()
</script>

<template>
  <header class="w-full bg-gradient-to-br from-cyan-100/50 to-pink-100/50 px-4 text-cyan-500 shadow">
    <div class="mx-auto flex h-16 w-full max-w-4xl flex-row items-center justify-between gap-4">
      <div class="flex h-full flex-row items-center px-2">
        <img src="/logo.svg"
             alt="Logo"
             class="h-10 w-10"
        >
        <h1 class="pl-2 text-lg font-bold">
          DyDaily
        </h1>
      </div>
      <div class="flex h-full flex-1 flex-row items-center justify-start">
        <NuxtLink v-for="item in navitems"
                  :key="item.name"
                  :to="item.to"
                  class="flex h-full items-center px-4 hover:bg-cyan-100/50"
                  active-class="bg-cyan-200/50"
        >
          <Icon :name="item.icon"
                class="h-5 w-5"
          />
          <span v-if="!isMobile"
                class="ml-1 font-semibold"
          >{{ item.name }}</span>
        </NuxtLink>
      </div>
      <div class="flex flex-row items-center">
        <button aria-label="Export tasks"
                class="flex items-center justify-center rounded-s bg-cyan-600 p-2 font-semibold text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                @click="handleExport"
        >
          <Icon name="mdi:content-save"
                class="h-5 w-5"
          />
        </button>
        <button aria-label="Import tasks"
                class="flex items-center justify-center rounded-e bg-cyan-500 p-2 font-semibold text-white hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                @click="handleImport"
        >
          <Icon name="mdi:upload"
                class="h-5 w-5"
          />
        </button>
      </div>
    </div>
  </header>
</template>
