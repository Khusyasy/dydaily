<script setup lang="ts">
const now = ref(new Date())
const nowYear = computed(() => now.value.getUTCFullYear())
const nowMonth = computed(() => now.value.getUTCMonth() + 1)
const nowDate = computed(() => now.value.getUTCDate())
const curr = ref(new Date())
const year = computed(() => curr.value.getUTCFullYear())
const month = computed(() => curr.value.getUTCMonth() + 1)
const firstDayOfMonth = computed(() => new Date(year.value, month.value - 1, 1).getUTCDay())
const datesInMonth = computed(() => new Date(year.value, month.value, 0).getUTCDate())
const emptyDaysComplete = computed(() => {
  const total = firstDayOfMonth.value + datesInMonth.value
  return total % 7 === 0 ? 0 : 7 - (total % 7)
})

function prevMonth() {
  if (month.value <= 1) {
    curr.value = new Date(year.value - 1, 12, 1)
  }
  else {
    curr.value = new Date(year.value, month.value - 1, 1)
  }
}

function nextMonth() {
  if (month.value >= 12) {
    curr.value = new Date(year.value + 1, 1, 1)
  }
  else {
    curr.value = new Date(year.value, month.value + 1, 1)
  }
}

const { tasks, checkins } = useTaskStore()

const selected = ref<Record<string, boolean>>({})
const selectedAll = computed({
  get: () => {
    return tasks.value.length > 0 && tasks.value.every(t => selected.value[t.id])
  },
  set: (val: boolean) => {
    tasks.value.forEach((t) => {
      selected.value[t.id] = val
    })
  },
})
const selectedSome = computed(() => {
  return tasks.value.length > 0 && tasks.value.some(t => selected.value[t.id]) && !selectedAll.value
})

onMounted(() => {
  tasks.value.forEach((t) => {
    selected.value[t.id] = false
  })
})

type taskCItem = {
  task: TaskType
  color: string
}
const tasksMap = computed(() => {
  const map: Record<string, taskCItem> = {}
  tasks.value.forEach((t) => {
    map[t.id] = {
      task: t,
      color: stringToHexColor(t.task),
    }
  })
  return map
})

// map[date][taskId]
const checkinsInDate = computed(() => {
  const defaultTaskMap: Record<string, boolean> = {}
  tasks.value.forEach((t) => {
    if (selected.value[t.id]) {
      defaultTaskMap[t.id] = false
    }
  })

  const dateMap: Record<string, Record<string, boolean>> = {}
  for (let i = 1; i <= datesInMonth.value; i++) {
    dateMap[i] = { ...defaultTaskMap }
  }

  const checkinsInMonth = checkins.value.filter((c) => {
    const task = tasksMap.value[c.taskId]?.task
    if (!task) return false

    const time = getTZDate(c.createdAt, task.refreshTime)
    return time.year === year.value && time.month === month.value
  })
  checkinsInMonth.forEach((c) => {
    const task = tasksMap.value[c.taskId]?.task
    if (!task) return

    const { date } = getTZDate(c.createdAt, task.refreshTime)
    if (dateMap[date] && selected.value[c.taskId]) {
      dateMap[date][c.taskId] = true
    }
  })

  return dateMap
})

const onlyOneID = computed(() => {
  const ids = tasks.value.map((t) => {
    return selected.value[t.id] ? t.id : null
  }).filter(x => x !== null)
  if (ids.length !== 1) {
    return ''
  }
  return ids[0] ?? ''
})
</script>

<template>
  <div>
    <!-- TODO: implement mobile responsive ui -->
    <div class="mx-auto my-2 max-w-4xl rounded bg-cyan-50/50 p-4 shadow">
      <div class="mb-1">
        <label for="selectAll"
               class="mb-1 flex items-center justify-start gap-2 px-2"
        >
          <input id="selectAll"
                 v-model="selectedAll"
                 type="checkbox"
                 name="selectAll"
                 :indeterminate="selectedSome"
                 class="h-4 w-4 rounded accent-cyan-500"
          >
          <span class="mb-1 font-semibold">
            Select Tasks
          </span>
        </label>
        <div class="flex flex-row flex-wrap gap-x-2 gap-y-1">
          <label v-for="task in tasks"
                 :key="task.id"
                 :for="'task-' + task.id"
                 class="flex items-center justify-start gap-2 rounded border bg-cyan-50 px-2 py-1"
                 :style="{
                   accentColor: tasksMap[task.id]?.color,
                   borderColor: selected[task.id] ? tasksMap[task.id]?.color : 'lightgray',
                 }"
          >
            <input :id="'task-' + task.id"
                   v-model="selected[task.id]"
                   type="checkbox"
                   name="selectedTasks"
                   class="h-4 w-4 rounded"
            >
            <span>{{ task.task }}</span>
          </label>
        </div>
      </div>
    </div>

    <div class="mx-auto my-2 max-w-4xl rounded bg-cyan-50/50 p-4 shadow">
      <div class="mb-1 flex flex-row items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-800">
          Calendar View
        </h2>
        <div class="flex flex-row items-center justify-center gap-2"
             :class="{
               'bg-green-100': year == nowYear && month == nowMonth,
             }"
        >
          <button
            class="flex items-center justify-center rounded-s bg-cyan-600 p-2 font-semibold text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @click="prevMonth"
          >
            <Icon name="mdi:chevron-left"
                  class="h-4 w-4"
            />
          </button>
          <h3 class="p-2 font-semibold">
            {{ year }}-{{ month }}
          </h3>
          <button
            class="flex items-center justify-center rounded-e bg-cyan-600 p-2 font-semibold text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @click="nextMonth"
          >
            <Icon name="mdi:chevron-right"
                  class="h-4 w-4"
            />
          </button>
        </div>
      </div>
      <div class="grid grid-cols-7 gap-1">
        <div class="text-center font-semibold text-cyan-900">
          Sun
        </div>
        <div class="text-center font-semibold text-cyan-900">
          Mon
        </div>
        <div class="text-center font-semibold text-cyan-900">
          Tue
        </div>
        <div class="text-center font-semibold text-cyan-900">
          Wed
        </div>
        <div class="text-center font-semibold text-cyan-900">
          Thu
        </div>
        <div class="text-center font-semibold text-cyan-900">
          Fri
        </div>
        <div class="text-center font-semibold text-cyan-900">
          Sat
        </div>
        <div v-for="n in firstDayOfMonth"
             :key="'empty-' + n"
             class="h-20 rounded border border-gray-200 p-2"
        />
        <div v-for="date in datesInMonth"
             :key="date"
             class="flex h-20 flex-col rounded border-2 border-cyan-200 p-2"
             :class="{
               'border-green-500': year == nowYear && month == nowMonth && date == nowDate,
             }"
             style="background-color: var(--bg-color)"
             :style="{
               '--bg-color': checkinsInDate[date]?.[onlyOneID] ? tasksMap[onlyOneID]?.color : 'transparent',
             }"
        >
          <div class="mb-1 text-sm font-semibold"
               :class="{
                 'text-black': checkinsInDate[date]?.[onlyOneID] && hexContrastBlack(tasksMap[onlyOneID]?.color),
                 'text-white': checkinsInDate[date]?.[onlyOneID] && !hexContrastBlack(tasksMap[onlyOneID]?.color),
               }"
          >
            {{ date }}
          </div>
          <div v-if="!onlyOneID"
               class="flex flex-row flex-wrap gap-1 overflow-y-auto"
          >
            <div v-for="(done, taskId) in checkinsInDate[date]"
                 :key="taskId"
                 class="h-4 w-4 rounded border-2 text-xs"
                 style="background-color: var(--bg-color); border-color: var(--color);"
                 :style="{
                   '--color': tasksMap[taskId]?.color,
                   '--bg-color': done ? tasksMap[taskId]?.color : 'transparent',
                 }"
            />
          </div>
        </div>
        <div v-for="n in emptyDaysComplete"
             :key="'empty-complete-' + n"
             class="h-20 rounded border border-gray-200 p-2"
        />
      </div>
    </div>
  </div>
</template>
