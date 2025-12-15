<script setup lang="ts">
defineProps<{
  task: TaskType,
  isDrag: boolean,
  isDragHover: boolean,
}>()
const { tasks, checkins } = useTaskStore()

const editMode = useState('editMode', () => false)
const clockTime = useState('clockTime', () => new Date())

const taskDetailDone = computed(() => {
  const temp: Record<string, boolean> = {}
  tasks.value.forEach(task => {
    if (!task.lastCheckin) {
      temp[task.id] = false
      return
    }

    const offset = task.refreshTime

    const now = dayjs(clockTime.value.getTime())
    const refreshUTC = now.utc().utcOffset(offset).hour(0).minute(0).second(0).millisecond(0)
    const lastCheckinUTC = dayjs(task.lastCheckin).utc().utcOffset(offset)

    const sameDay = lastCheckinUTC.isSame(refreshUTC, 'day')
    temp[task.id] = sameDay
  })
  return temp
})

const taskDetailStreaks = computed(() => {
  const counts: Record<string, number> = {}
  tasks.value.forEach(task => {
    const taskCheckins = checkins.value.filter(checkin => checkin.taskId === task.id)
    counts[task.id] = 0
    if (taskCheckins.length === 0) {
      return
    }
    let currCheckinTime = taskDetailDone.value[task.id] && task.lastCheckin ? new Date(task.lastCheckin) : new Date()
    // assumed sorted by time ascending
    for (let i = taskCheckins.length - 1; i >= 0; i--) {
      const checkin = taskCheckins[i]
      if (!checkin) break

      const nextCheckinTime = checkin.createdAt
      const daysDiff = dayjs(currCheckinTime).diff(dayjs(nextCheckinTime), 'day')
      // console.log(task.task, currCheckinTime, nextCheckinTime, daysDiff)

      if (daysDiff >= 0 && daysDiff < 2) {
        counts[task.id] = (counts[task.id] ?? 0) + 1;
        currCheckinTime = nextCheckinTime
      } else {
        break
      }
    }
  })
  return counts
})

function removeTask(id: string) {
  const index = tasks.value.findIndex(task => task.id === id)
  const task = tasks.value[index]
  if (!task) return
  // TODO: change confirm with better ui
  if (!confirm(`Are you sure you want to delete the task "${task.task}"? This action cannot be undone.`)) {
    return
  }

  if (index !== -1) {
    tasks.value.splice(index, 1)
  }
  checkins.value = checkins.value.filter(checkin => checkin.taskId !== id)
}

function checkinTask(id: string) {
  const task = tasks.value.find(task => task.id === id)
  if (task && task.url) {
    window.open(task.url, '_blank')
  }
  if (task && !taskDetailDone.value[id]) {
    const now = new Date()
    task.lastCheckin = now
    checkins.value.push({
      id: generateId(8),
      taskId: task.id,
      createdAt: now,
    })
  }
}

function uncheckinTask(id: string) {
  const task = tasks.value.find(task => task.id === id)
  if (!task) return
  // TODO: change confirm with better ui
  if (!confirm(`Are you sure you want to remove last checkin for the task "${task.task}"? This action cannot be undone.`)) {
    return
  }
  if (!taskDetailDone.value[id]) return

  const checkinIndex = checkins.value.findIndex(checkin => {
    return checkin.taskId === id && task.lastCheckin && checkin.createdAt.getTime() === task.lastCheckin.getTime()
  })
  checkins.value.splice(checkinIndex, 1)
  task.lastCheckin = null
}
</script>

<template>
  <li :draggable="!isMobile()"
    class="flex items-center justify-between rounded shadow cursor-auto sm:cursor-move text-sm sm:text-base" :class="{
      'ring': isDrag,
      'bg-blue-50': isDragHover,
      'bg-white hover:bg-gray-50': !isDrag && !isDragHover,
    }">
    <div class="flex items-center justify-center my-auto mx-1 h-full text-gray-200 sm:text-gray-600">
      <Icon name="mdi:drag-vertical" class="w-5 h-5" />
    </div>
    <div class="flex-1 flex items-center justify-between py-4 pr-4 gap-4">
      <div class="flex-1 flex flex-col items-start sm:flex-row sm:items-center justify-between ">
        <h3 class="text-base sm:text-lg font-medium text-gray-900">
          {{ task.task }}
        </h3>
        <div class="flex flex-row-reverse sm:flex-row gap-2 items-end">
          <p v-if="taskDetailDone[task.id]" class="text-md text-green-700 flex items-center justify-center">
            <Icon name="mdi:check" class="w-5 h-5 mr-1" />
            {{ dateFromNow(task.lastCheckin) }}
          </p>
          <p v-if="taskDetailStreaks[task.id] ?? 0 > 0"
            class="text-md text-yellow-600 flex items-center justify-center">
            <Icon name="mdi:fire" class="w-5 h-5 mr-1 text-yellow-500" />
            {{ taskDetailStreaks[task.id] }}
          </p>
          <p class="text-md text-gray-600 flex items-center justify-center">
            <Icon name="mdi:refresh" class="w-5 h-5 mr-1" />
            {{ offsetFormat(task.refreshTime) }}
          </p>
        </div>
      </div>
      <div v-if="!editMode">
        <button @click.stop.prevent="checkinTask(task.id)" :aria-label="task.url ? 'Open URL' : 'Check-in task'"
          class="flex items-center justify-center p-2 rounded text-cyan-600 hover:text-cyan-800 bg-cyan-100 hover:bg-cyan-200">
          <Icon v-if="taskDetailDone[task.id]" name="mdi:check-bold" class="w-5 h-5" />
          <Icon v-else-if="task.url" name="mdi:share-variant" class="w-5 h-5" />
          <Icon v-else name="mdi:send-outline" class="w-5 h-5" />
        </button>
      </div>
      <div v-if="editMode" class="flex flex-row items-center">
        <button @click.stop.prevent="taskDetailDone[task.id] ? uncheckinTask(task.id) : null"
          aria-label="Uncheck-in task" :disabled="!taskDetailDone[task.id]"
          class="flex items-center justify-center p-2 rounded-s text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200">
          <Icon name="mdi:close" class="w-5 h-5" />
        </button>
        <button @click.stop.prevent="removeTask(task.id)" aria-label="Delete task" :disabled="!editMode"
          class="flex items-center justify-center p-2 rounded-e text-red-600 hover:text-red-800 bg-red-100 hover:bg-red-200">
          <Icon name="mdi:delete" class="w-5 h-5" />
        </button>
      </div>
    </div>
  </li>
</template>
