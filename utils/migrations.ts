const MIGRATIONS = new Map<number, (data: SaveType) => SaveType>()

// 1 -> 2: change refreshTime HH:mm to be UTC offset -12 to +14
MIGRATIONS.set(1, (data) => {
  const localOffset = new Date().getTimezoneOffset() / 60
  data.tasks = data.tasks.map((task) => {
    // minute is ignored
    const [hoursStr, _] = task.refreshTime.split(':')
    if (!hoursStr) return task

    const hours = parseInt(hoursStr, 10)
    let offset = 0
    if (hours >= 0 && hours <= 12) {
      offset = hours
    }
    else if (hours >= 13 && hours <= 23) {
      offset = hours - 24
    }

    offset += localOffset

    if (offset < -12) {
      offset = offset + 24
    }
    else if (offset > 12) {
      offset = offset - 24
    }

    return { ...task, refreshTime: -offset }
  })
  data.version = 2
  return data
})

// 2 -> 3: tasks add 'createdAt', checkins rename 'time' to 'createdAt' to be consistent
MIGRATIONS.set(2, (data) => {
  data.checkins = data.checkins.map((checkin) => {
    checkin.createdAt = checkin.time
    delete checkin.time
    return checkin
  })

  // karena createdAt ga mungkin didapetin, asumsi pakai waktu checkin yang paling lama
  data.tasks = data.tasks.map((task) => {
    // assumsi sorted ascending
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let firstCheckin: any = null
    for (let i = 0; i < data.checkins.length; i++) {
      const checkin = data.checkins[i]
      if (!checkin) continue
      if (task.id === checkin.taskId) {
        firstCheckin = checkin
        break
      }
    }

    if (!firstCheckin) return task
    return { ...task, createdAt: firstCheckin.createdAt }
  })

  data.version = 3
  return data
})

// 3 -> 4: checkins add 'late' mark buat fitur late checkin
MIGRATIONS.set(3, (data) => {
  data.checkins = data.checkins.map((checkin) => {
    // asumsi semuanya bukan late karena fiturnya baru ada di versi ini
    checkin.late = false
    return checkin
  })

  data.version = 4
  return data
})

export function handleMigration(data: SaveType): SaveType {
  let currData = data
  while (currData.version < LATEST_SAVE_VERSION) {
    const migrate = MIGRATIONS.get(currData.version)
    if (!migrate) {
      console.error('Migration not found for version ' + currData.version)
      throw new Error('Migration not found for version ' + currData.version)
    }
    currData = migrate(currData)
  }
  return currData
}
