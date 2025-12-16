import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'

export const MS_SEC = 1000;
export const MS_MIN = 60 * MS_SEC;
export const MS_HOUR = 60 * MS_MIN;
export const MS_DAY = 24 * MS_HOUR;

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

// export const getMSDiff = (date1: Date, date2: Date) => {
//   if (!date1 || !date2) return 0
//   return Math.abs(dayjs(date1).diff(dayjs(date2)))
// }

export { dayjs };
