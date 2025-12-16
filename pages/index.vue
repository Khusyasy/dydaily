<script setup lang="ts">
const { tasks } = useTaskStore()
const form = ref<{
  task: string,
  url: string,
  refreshTime: '' | number,
}>({
  task: '',
  url: '',
  refreshTime: '',
})

const editMode = useState('editMode', () => false)
const clockTime = useState('clockTime', () => new Date())
onMounted(() => {
  const clockInterval = setInterval(() => {
    clockTime.value = new Date()
  }, 100)
  // TODO: handle interval or just nah?
})

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
    <form @submit.prevent="handleSubmit"
      class="flex flex-col sm:flex-row items-center sm:items-end justify-center w-full max-w-4xl my-2 mx-auto p-4 gap-2 bg-cyan-50/50 shadow rounded">
      <div class="flex-1 w-full sm:w-auto">
        <label for="task" class="block text-sm font-medium text-gray-700">
          Task
        </label>
        <input v-model="form.task" type="text" id="task" name="task" required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-cyan-500 sm:text-sm" />
      </div>

      <div class="flex-1 w-full sm:w-auto">
        <label for="url" class="block text-sm font-medium text-gray-700">
          URL (optional)
        </label>
        <input v-model="form.url" type="url" id="url" name="url"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-cyan-500 sm:text-sm" />
      </div>

      <div class="flex-[0.75] w-full sm:w-auto">
        <label for="refresh-time" class="block text-sm font-medium text-gray-700">
          Refresh Time (UTC)
        </label>
        <select v-model="form.refreshTime" id="refresh-time" name="refresh-time" required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-cyan-500 sm:text-sm">
          <option value="">Select Offset</option>
          <option v-for="offset in UTC_OFFSETS" :key="offset" :value="offset">
            {{ offsetFormat(offset) }} | UTC{{ offset >= 0 ? '+' : '' }}{{ offset }}
          </option>
        </select>
      </div>

      <div class=" w-full sm:w-auto">
        <button type="submit" aria-label="Add task"
          class="flex items-center justify-center p-2 text-sm font-semibold text-white bg-cyan-600 rounded hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <Icon name="mdi:plus" class="w-5 h-5" />
        </button>
      </div>
    </form>

    <div class="max-w-4xl mx-auto my-2 bg-cyan-50/50 shadow rounded relative">
      <div class="flex items-center justify-between sticky top-0 px-4 py-2 bg-cyan-50/50 backdrop-blur z-50">
        <h2 class="text-lg font-semibold text-gray-800">
          Tasks
        </h2>
        <p class="text-lg font-bold text-gray-800">
          {{ timeFormat(clockTime) }}
        </p>
        <button @click="editMode = !editMode" aria-label="Toggle edit mode"
          class="ml-2 p-2 flex items-center justify-center text-sm font-medium rounded" :class="{
            'text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100': !editMode,
            'text-red-50 hover:text-red-100 bg-red-600 hover:bg-red-700': editMode
          }">
          <Icon name="mdi:note-edit" class="w-5 h-5" />
        </button>
      </div>

      <TaskList />
    </div>
  </div>
</template>
