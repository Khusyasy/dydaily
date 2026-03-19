export const useTaskStore = () => {
  const version = useState<number>('version', () => 1)
  const tasks = useState<TasksType>('tasks', () => [])
  const checkins = useState<CheckinsType>('checkins', () => [])

  watch(version, (val) => {
    localStorage.setItem('version', JSON.stringify(val))
  })

  watch(tasks, (val) => {
    localStorage.setItem('tasks', JSON.stringify(val))
  }, { deep: true })

  watch(checkins, (val) => {
    localStorage.setItem('checkins', JSON.stringify(val))
  }, { deep: true })

  return { version, tasks, checkins }
}

export function loadTaskStore() {
  const { version, tasks, checkins } = useTaskStore()

  const rawVersion = localStorage.getItem('version')
  const resVersion = rawVersion ? parseInt(rawVersion) : 1

  const rawTasks = localStorage.getItem('tasks')
  const parsedTasks = rawTasks ? JSON.parse(rawTasks) : []

  const rawCheckins = localStorage.getItem('checkins')
  const parsedCheckins = rawCheckins ? JSON.parse(rawCheckins) : []

  if (resVersion < LATEST_SAVE_VERSION) {
    // do migrations
    let saveData = {
      version: resVersion,
      exportedAt: new Date(),
      tasks: parsedTasks,
      checkins: parsedCheckins,
    }

    saveData = handleMigration(saveData)

    version.value = saveData.version
    tasks.value = saveData.tasks
    checkins.value = saveData.checkins
  }
  else {
    // just load
    const resTasks = TasksSchema.safeParse(parsedTasks)
    tasks.value = resTasks.success ? resTasks.data : []

    const resCheckins = CheckinsSchema.safeParse(parsedCheckins)
    checkins.value = resCheckins.success ? resCheckins.data : []
  }
}
