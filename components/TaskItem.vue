<script setup lang="ts">
const props = defineProps<{
  task: TaskType
  isDrag: boolean
  isDragHover: boolean
  handleDragStart: () => void
  handleDragOver: () => void
  handleDrop: () => void
}>()
const { tasks, checkins } = useTaskStore()

const editMode = useState('editMode', () => false)

const form = ref<{
  task: string
  url: string
  refreshTime: '' | number
}>({
  task: props.task.task,
  url: props.task.url,
  refreshTime: props.task.refreshTime,
})

const isEdited = computed(() => {
  return form.value.task !== props.task.task || form.value.url !== props.task.url || form.value.refreshTime !== props.task.refreshTime
})

const confirm = useConfirm()

async function handleSubmit() {
  if (!form.value.task || form.value.refreshTime === '') {
    return
  }

  if (props.task.refreshTime !== form.value.refreshTime) {
    const confirmed = await confirm.open({
      title: 'Update Task',
      message: 'If you change the refresh time it might effect the checkins and streaks you have... are you okay with this?',
    })
    if (!confirmed) return
  }

  props.task.task = form.value.task
  props.task.url = form.value.url
  props.task.refreshTime = form.value.refreshTime
}

const clockTime = useClock()

// TODO: optimize this? isnt this run loop for all but for each item, i forgor this from refactoring index page
const taskDetailDone = computed(() => {
  const doneMap: Record<string, boolean> = {}
  tasks.value.forEach((task) => {
    if (!task.lastCheckin) {
      doneMap[task.id] = false
      return
    }

    doneMap[task.id] = isSameTZDay(task.lastCheckin, clockTime.value, task.refreshTime)
  })
  return doneMap
})

// TODO: optimize this? isnt this run loop for all but for each item, i forgor this from refactoring index page
const taskDetailStreaks = computed(() => {
  const counts: Record<string, number> = {}
  tasks.value.forEach((task) => {
    const taskCheckins = checkins.value.filter(checkin => checkin.taskId === task.id)
    counts[task.id] = 0

    if (taskCheckins.length === 0) {
      return
    }

    let currentStreak = 1

    // assumed sorted by time ascending
    for (let i = taskCheckins.length - 1; i > 0; i--) {
      const currCheckin = taskCheckins[i]
      const prevCheckin = taskCheckins[i - 1]
      if (!currCheckin || !prevCheckin) break

      const daysDiff = diffTZDays(currCheckin.createdAt, prevCheckin.createdAt, task.refreshTime)

      if (daysDiff === 0) {
        continue
      }
      else if (daysDiff === 1) {
        currentStreak++
      }
      else {
        break
      }
    }

    const lastCheckin = taskCheckins[taskCheckins.length - 1]
    if (lastCheckin) {
      const daysSinceLast = diffTZDays(clockTime.value, lastCheckin.createdAt, task.refreshTime)

      if (daysSinceLast <= 1) counts[task.id] = currentStreak
    }
  })
  return counts
})

async function removeTask(id: string) {
  const index = tasks.value.findIndex(task => task.id === id)
  const task = tasks.value[index]
  if (!task) return

  const confirmed = await confirm.open({
    title: 'Delete',
    message: `Delete the task "${task.task}"? This action cannot be undone.`,
  })
  if (!confirmed) {
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
      late: false,
    })
  }
  // sorted by time ascending
  checkins.value.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
}

async function uncheckinTask(id: string) {
  const task = tasks.value.find(task => task.id === id)
  if (!task) return

  const confirmed = await confirm.open({
    title: 'Uncheckin',
    message: `Remove last checkin for the task "${task.task}"? This action cannot be undone.`,
  })
  if (!confirmed) {
    return
  }
  if (!taskDetailDone.value[id]) return

  const checkinIndex = checkins.value.findIndex((checkin) => {
    return checkin.taskId === id && task.lastCheckin && checkin.createdAt.getTime() === task.lastCheckin.getTime()
  })
  checkins.value.splice(checkinIndex, 1)
  for (let i = checkins.value.length - 1; i >= 0; i--) {
    const checkin = checkins.value[i]!
    if (checkin.taskId === id) {
      task.lastCheckin = checkin.createdAt
      break
    }
  }
}

const isMobile = useIsMobile()
</script>

<template>
  <li class="z-40 flex items-center justify-between rounded text-sm shadow sm:text-base"
      :class="{
        'ring': isDrag,
        'bg-blue-50': isDragHover,
        'bg-white hover:bg-gray-50': !isDrag && !isDragHover,
      }"
      @dragover.prevent="handleDragOver()"
      @drop="handleDrop()"
  >
    <div v-if="editMode"
         :draggable="!isMobile && editMode"
         class="mx-0.5 flex h-full items-center justify-center px-0.5 py-4 text-gray-200 sm:text-gray-600"
         :class="{
           'cursor-auto sm:cursor-move': editMode,
         }"
         @dragstart="handleDragStart()"
    >
      <Icon name="mdi:drag-vertical"
            class="h-5 w-5"
      />
    </div>
    <form class="flex flex-1 items-center justify-between gap-4 py-4 pr-4"
          :class="{
            'pl-9': !editMode,
          }"
          @submit.prevent="handleSubmit"
    >
      <div class="flex flex-1 flex-col items-start justify-between sm:flex-row sm:items-center ">
        <h3 v-if="!editMode"
            class="text-base font-medium text-gray-900 sm:text-lg"
        >
          {{ task.task }}
        </h3>
        <div v-else
             class="flex w-full flex-row items-start justify-start gap-2 pr-2"
        >
          <input v-model="form.task"
                 type="text"
                 class="z-40 block w-1/2 rounded-md border border-gray-300 px-2 py-0.5 text-base font-medium text-gray-900 focus:border-cyan-500 focus:outline-none focus:ring-blue-500 sm:text-lg"
          >
          <input v-model="form.url"
                 type="url"
                 class="z-40 block w-1/2 rounded-md border border-gray-300 px-2 py-0.5 text-base font-medium text-gray-900 focus:border-cyan-500 focus:outline-none focus:ring-blue-500 sm:text-lg"
          >
        </div>
        <div class="flex flex-row-reverse items-end gap-2 sm:flex-row">
          <!-- TODO: make the icons to be copyable? -->
          <span v-if="taskDetailDone[task.id] && !editMode"
                class="flex items-center justify-center text-base text-green-700"
          >
            <Icon name="mdi:check"
                  class="mr-1 h-5 w-5"
            />
            {{ dateFromNow(task.lastCheckin) }}
          </span>
          <span v-if="((taskDetailStreaks[task.id] ?? 0) > 0) && !editMode"
                class="flex items-center justify-center text-base"
                :class="{ 'text-yellow-600': taskDetailDone[task.id], 'text-gray-600': !taskDetailDone[task.id] }"
          >
            <Icon name="mdi:fire"
                  class="mr-1 h-5 w-5"
                  :class="{ 'text-yellow-500': taskDetailDone[task.id], 'text-gray-500': !taskDetailDone[task.id] }"
            />
            {{ taskDetailStreaks[task.id] }}
          </span>
          <span class="flex items-center justify-center text-base text-gray-600">
            <Icon name="mdi:refresh"
                  class="mr-1 h-5 w-5"
            />
            {{ editMode ? '' : offsetFormat(task.refreshTime) }}
            <select v-if="editMode"
                    id="refresh-time"
                    v-model="form.refreshTime"
                    name="refresh-time"
                    required
                    class="block w-min rounded-md border border-gray-300 px-2 py-0.5 text-base font-medium text-gray-900 focus:border-cyan-500 focus:outline-none focus:ring-blue-500 sm:text-base"
            >
              <option v-for="offset in UTC_OFFSETS"
                      :key="offset"
                      :value="offset"
              >
                {{ offsetFormat(offset) }}
              </option>
            </select>
          </span>
        </div>
      </div>
      <div v-if="!editMode">
        <button :aria-label="task.url ? 'Open URL' : 'Check-in task'"
                class="flex items-center justify-center rounded bg-cyan-100 p-2 text-cyan-600 hover:bg-cyan-200 hover:text-cyan-800"
                @click.stop.prevent="checkinTask(task.id)"
        >
          <Icon v-if="taskDetailDone[task.id]"
                name="mdi:check-bold"
                class="h-5 w-5"
          />
          <Icon v-else-if="task.url"
                name="mdi:share-variant"
                class="h-5 w-5"
          />
          <Icon v-else
                name="mdi:send-outline"
                class="h-5 w-5"
          />
        </button>
      </div>
      <div v-if="editMode"
           class="flex flex-row items-center"
      >
        <button aria-label="Save task"
                :disabled="!isEdited"
                class="flex items-center justify-center rounded-s p-2"
                :class="{
                  'bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-800': isEdited,
                  'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-500': !isEdited,
                }"
        >
          <Icon v-if="isEdited"
                name="mdi:content-save-alert"
                class="h-5 w-5"
          />
          <Icon v-else
                name="mdi:content-save"
                class="h-5 w-5"
          />
        </button>
        <button aria-label="Uncheck-in task"
                :disabled="!taskDetailDone[task.id]"
                class="flex items-center justify-center rounded-none p-2 "
                :class="{
                  'bg-orange-100  text-orange-600 hover:bg-orange-200 hover:text-orange-800': taskDetailDone[task.id],
                  'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-500': !taskDetailDone[task.id],
                }"
                @click.stop.prevent="taskDetailDone[task.id] ? uncheckinTask(task.id) : null"
        >
          <Icon v-if="taskDetailDone[task.id]"
                name="mdi:fire-off"
                class="h-5 w-5"
          />
          <Icon v-else
                name="mdi:minus"
                class="h-5 w-5"
          />
        </button>
        <button aria-label="Delete task"
                :disabled="!editMode"
                class="flex items-center justify-center rounded-e bg-red-100 p-2 text-red-600 hover:bg-red-200 hover:text-red-800"
                @click.stop.prevent="removeTask(task.id)"
        >
          <Icon name="mdi:delete"
                class="h-5 w-5"
          />
        </button>
      </div>
    </form>
  </li>
</template>
