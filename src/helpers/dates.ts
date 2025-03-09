import {
  formatDistanceToNow,
  format,
  parseISO,
  type DateArg as _DateArg,
} from 'date-fns'

type DateArg = _DateArg<Date>

export const defaultDateFormat = 'd LLL yyyy'
export const defaultTimeFormat = 'hh:mm bbb'
export const defaultDateTimeFormat = `${defaultDateFormat} ${defaultTimeFormat}`

export function formatDateDistance(date: DateArg) {
  return formatDistanceToNow(date, { addSuffix: true })
}

export function formatDateTime(date: DateArg) {
  return format(date, defaultDateTimeFormat)
}

export function parseDateISO(date: string) {
  return parseISO(date)
}
