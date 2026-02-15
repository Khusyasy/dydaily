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
  } else {
    curr.value = new Date(year.value, month.value - 1, 1)
  }
}

function nextMonth() {
  if (month.value >= 12) {
    curr.value = new Date(year.value + 1, 1, 1)
  } else {
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
    tasks.value.forEach(t => {
      selected.value[t.id] = val
    })
  }
})
onMounted(() => {
  tasks.value.forEach(t => {
    selected.value[t.id] = false
  })
})

type taskCItem = {
  task: TaskType,
  color: string,
}
const tasksMap = computed(() => {
  const map: Record<string, taskCItem> = {}
  tasks.value.forEach(t => {
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
  tasks.value.forEach(t => {
    if (selected.value[t.id]) {
      defaultTaskMap[t.id] = false
    }
  })

  const dateMap: Record<string, Record<string, boolean>> = {}
  for (let i = 1; i <= datesInMonth.value; i++) {
    dateMap[i] = { ...defaultTaskMap }
  }

  const checkinsInMonth = checkins.value.filter(c => {
    const task = tasksMap.value[c.taskId]?.task
    if (!task) return false

    const time = dayjs(c.createdAt).utc().utcOffset(task.refreshTime || 0)
    return time.year() === year.value && (time.month() + 1) === month.value
  })
  checkinsInMonth.forEach(c => {
    const task = tasksMap.value[c.taskId]?.task
    if (!task) return

    const time = dayjs(c.createdAt).utc().utcOffset(task.refreshTime || 0)
    const date = time.date()

    if (dateMap[date] && selected.value[c.taskId]) {
      dateMap[date][c.taskId] = true
    }
  })

  return dateMap
})

const onlyOneID = computed(()=>{
  const ids = tasks.value.map(t => {
    return selected.value[t.id] ? t.id : null
  }).filter(x => x !== null)
  if (ids.length !== 1) {
    return ''
  }
  return ids[0] ?? ''
})

</script>

<template>
  <!-- TODO: implement mobile responsive ui -->
  <div>
    <div class="max-w-4xl mx-auto my-2 bg-cyan-50/50 shadow rounded p-4">
      <div class="mb-1">
        <div class="mb-1 flex items-center justify-start gap-2 px-2">
          <input type="checkbox" name="selectAll" id="selectAll" v-model="selectedAll"
            class="h-4 w-4 rounded accent-cyan-500" />
          <label for="selectAll" class="mb-1 font-semibold">
            Select Tasks
          </label>
        </div>
        <div class="flex flex-row flex-wrap gap-x-2 gap-y-1">
          <!-- TODO: fix checkbox click hitbox to be full div -->
          <div v-for="task in tasks" :key="task.id"
            class="flex items-center justify-start gap-2 rounded bg-cyan-50 px-2 py-1 border" :style="{
              accentColor: tasksMap[task.id]?.color,
              borderColor: selected[task.id] ? tasksMap[task.id]?.color : 'transparent'
            }">
            <input type="checkbox" name="selectedTasks" :id="'task-' + task.id" v-model="selected[task.id]"
              class="h-4 w-4 rounded" />
            <label :for="'task-' + task.id">{{ task.task }}</label>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto my-2 bg-cyan-50/50 shadow rounded p-4">
      <div class="flex flex-row items-center justify-between mb-1">
        <h2 class="text-lg font-semibold text-gray-800">
          Calendar View
        </h2>
        <div class="flex flex-row items-center justify-center gap-2" :class="{
          'bg-green-100': year == nowYear && month == nowMonth
        }">
          <button @click="prevMonth"
            class="p-2 rounded-s font-semibold flex items-center justify-center text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <Icon name="mdi:chevron-left" class="w-4 h-4" />
          </button>
          <h3 class="font-semibold p-2">
            {{ year }}-{{ month }}
          </h3>
          <button @click="nextMonth"
            class="p-2 rounded-e font-semibold flex items-center justify-center text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <Icon name="mdi:chevron-right" class="w-4 h-4" />
          </button>
        </div>
      </div>
      <div class="grid grid-cols-7 gap-1">
        <div class="font-semibold text-center text-cyan-900">Sun</div>
        <div class="font-semibold text-center text-cyan-900">Mon</div>
        <div class="font-semibold text-center text-cyan-900">Tue</div>
        <div class="font-semibold text-center text-cyan-900">Wed</div>
        <div class="font-semibold text-center text-cyan-900">Thu</div>
        <div class="font-semibold text-center text-cyan-900">Fri</div>
        <div class="font-semibold text-center text-cyan-900">Sat</div>
        <div v-for="n in firstDayOfMonth" :key="'empty-' + n" class="border border-gray-200 p-2 h-20 rounded"></div>
        <div v-for="date in datesInMonth" :key="date" class="border-2 border-cyan-200 p-2 h-20 rounded flex flex-col"
          :class="{
            'border-green-500': year == nowYear && month == nowMonth && date == nowDate,
          }" style="background-color: var(--bg-color)" :style="{
                '--bg-color': checkinsInDate[date]?.[onlyOneID] ? tasksMap[onlyOneID]?.color : 'transparent',
              }">
          <div class="text-sm mb-1 font-semibold" :class="{
            'text-black': checkinsInDate[date]?.[onlyOneID] && hexContrastBlack(tasksMap[onlyOneID]?.color),
            'text-white': checkinsInDate[date]?.[onlyOneID] && !hexContrastBlack(tasksMap[onlyOneID]?.color),
          }">{{ date }}</div>
          <div v-if="!onlyOneID" class="flex flex-row gap-1 flex-wrap overflow-y-auto">
            <div v-for="(done, taskId) in checkinsInDate[date]" class="text-xs rounded h-4 w-4 border-2"
              style="background-color: var(--bg-color); border-color: var(--color);" :style="{
                '--color': tasksMap[taskId]?.color,
                '--bg-color': done ? tasksMap[taskId]?.color : 'transparent',
              }"></div>
          </div>
        </div>
        <div v-for="n in emptyDaysComplete" :key="'empty-complete-' + n"
          class="border border-gray-200 p-2 h-20 rounded">
        </div>
      </div>
    </div>
  </div>
</template>
