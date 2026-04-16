export function calculateLastStreak(task: TaskType, checkins: CheckinsType, now: Date) {
  const taskCheckins = checkins.filter(checkin => checkin.taskId === task.id)

  if (taskCheckins.length === 0) {
    return 0
  }

  let counts = 0
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
    const daysSinceLast = diffTZDays(now, lastCheckin.createdAt, task.refreshTime)

    if (daysSinceLast <= 1) counts = currentStreak
  }

  return counts
}
