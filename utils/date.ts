import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'

export const UTC_OFFSETS = ref([
  -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1,
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
])

dayjs.extend(relativeTime)
dayjs.extend(utc)

export const dateFromNow = (date: Date | null) => {
  if (!date) return '-'
  return dayjs(date).fromNow()
}

export const dateToNow = (date: Date | null) => {
  if (!date) return '-'
  return dayjs(date).toNow()
}

export const timeFormat = (date: Date | null) => {
  if (!date) return '-'
  return dayjs(date).format('HH:mm:ss')
}

export const offsetFormat = (offset: number) => {
  return dayjs().utc().utcOffset(offset).hour(0).local().format('HH:00');
}

// TODO: probably need to refactor so it doesnt return dayjs directly
export const dateToTZDay = (date: Date | number, refreshTime: number): dayjs.Dayjs => {
  return dayjs(date).utc().utcOffset(refreshTime).startOf('day')
}

export { dayjs };
