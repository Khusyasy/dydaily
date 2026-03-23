<script setup lang="ts">
const { tasks } = useTaskStore()
const form = ref<{
  task: string
  url: string
  refreshTime: '' | number
}>({
  task: '',
  url: '',
  refreshTime: '',
})

const editMode = useState('editMode', () => false)

function handleSubmit() {
  if (!form.value.task || form.value.refreshTime === '') {
    return
  }

  tasks.value.push({
    id: generateId(4),
    task: form.value.task,
    url: form.value.url,
    refreshTime: form.value.refreshTime,
    lastCheckin: null,
    createdAt: new Date(),
  })

  form.value = {
    task: '',
    url: '',
    refreshTime: '',
  }
}
</script>

<template>
  <div>
    <form
      class="mx-auto my-2 flex w-full max-w-4xl flex-col items-center justify-center gap-2 rounded bg-cyan-50/50 p-4 shadow sm:flex-row sm:items-end"
      @submit.prevent="handleSubmit"
    >
      <div class="w-full flex-1 sm:w-auto">
        <label for="task"
               class="block text-sm font-medium text-gray-700"
        >
          Task<span class="text-red-600">*</span>
        </label>
        <input id="task"
               v-model="form.task"
               type="text"
               name="task"
               required
               class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        >
      </div>

      <div class="w-full flex-1 sm:w-auto">
        <label for="url"
               class="block text-sm font-medium text-gray-700"
        >
          URL
        </label>
        <input id="url"
               v-model="form.url"
               type="url"
               name="url"
               class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        >
      </div>

      <div class="w-full flex-[0.75] sm:w-auto">
        <label for="refresh-time"
               class="block text-sm font-medium text-gray-700"
        >
          Refresh Time (Local)<span class="text-red-600">*</span>
        </label>
        <select id="refresh-time"
                v-model="form.refreshTime"
                name="refresh-time"
                required
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        >
          <option value="">
            Select Offset
          </option>
          <option v-for="offset in UTC_OFFSETS"
                  :key="offset"
                  :value="offset"
          >
            {{ offsetFormat(offset) }} | UTC{{ offset >= 0 ? '+' : '' }}{{ offset }}
          </option>
        </select>
      </div>

      <div class=" w-full sm:w-auto">
        <button type="submit"
                aria-label="Add task"
                class="flex items-center justify-center rounded bg-cyan-600 p-2 text-sm font-semibold text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Icon name="mdi:plus"
                class="h-5 w-5"
          />
        </button>
      </div>
    </form>

    <div class="relative mx-auto my-2 max-w-4xl rounded bg-cyan-50/50 shadow">
      <div class="sticky top-0 z-40 flex items-center justify-between bg-cyan-50/50 px-4 py-2 backdrop-blur">
        <h2 class="text-lg font-semibold text-gray-800">
          Tasks
        </h2>
        <ClockDisplay />
        <button aria-label="Toggle edit mode"
                class="ml-2 flex items-center justify-center rounded p-2 text-sm font-medium"
                :class="{
                  'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700': !editMode,
                  'bg-red-600 text-red-50 hover:bg-red-700 hover:text-red-100': editMode,
                }"
                @click="editMode = !editMode"
        >
          <Icon name="mdi:note-edit"
                class="h-5 w-5"
          />
        </button>
      </div>

      <TaskList />
    </div>
  </div>
</template>
