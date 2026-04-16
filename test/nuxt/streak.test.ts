import { describe, expect, it } from 'vitest'

describe('streaks calculation', () => {
  const task: TaskType = {
    id: 'VITEST',
    task: 'Workout',
    url: '',
    refreshTime: 7,
    lastCheckin: null,
    createdAt: new Date('2026-04-16T12:00:00Z'),
  }

  it('no checkins', () => {
    const now = new Date('2026-04-16T12:00:00Z')
    const checkins: CheckinsType = []
    expect(calculateLastStreak(task, checkins, now)).toBe(0)
  })

  it('normal streaks', () => {
    const now = new Date('2026-04-16T12:00:00Z')
    const checkins: CheckinsType = [
      { id: '1', taskId: task.id, createdAt: new Date('2026-04-14T10:00:00Z'), late: false },
      { id: '2', taskId: task.id, createdAt: new Date('2026-04-15T10:00:00Z'), late: false },
      { id: '3', taskId: task.id, createdAt: new Date('2026-04-16T10:00:00Z'), late: false },
    ]
    expect(calculateLastStreak(task, checkins, now)).toBe(3)
  })

  it('normal streaks before today', () => {
    const now = new Date('2026-04-16T12:00:00Z')
    const checkins: CheckinsType = [
      { id: '1', taskId: task.id, createdAt: new Date('2026-04-14T10:00:00Z'), late: false },
      { id: '2', taskId: task.id, createdAt: new Date('2026-04-15T10:00:00Z'), late: false },
    ]
    expect(calculateLastStreak(task, checkins, now)).toBe(2)
  })

  it('streaks break', () => {
    const now = new Date('2026-04-16T12:00:00Z')
    const checkins: CheckinsType = [
      { id: '1', taskId: task.id, createdAt: new Date('2026-04-13T10:00:00Z'), late: false },
      { id: '2', taskId: task.id, createdAt: new Date('2026-04-14T10:00:00Z'), late: false },
    ]
    expect(calculateLastStreak(task, checkins, now)).toBe(0)
  })

  it('streaks mix with break', () => {
    const now = new Date('2026-04-16T12:00:00Z')
    const checkins: CheckinsType = [
      { id: '1', taskId: task.id, createdAt: new Date('2026-04-13T10:00:00Z'), late: false },
      { id: '2', taskId: task.id, createdAt: new Date('2026-04-14T10:00:00Z'), late: false },
      { id: '3', taskId: task.id, createdAt: new Date('2026-04-16T10:00:00Z'), late: false },
    ]
    expect(calculateLastStreak(task, checkins, now)).toBe(1)
  })
})
