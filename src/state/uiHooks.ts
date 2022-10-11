/* eslint-disable no-loop-func */
import { useMemo } from 'react'
import { useConfigurableIntervalDCA } from './hooks'

export const suffix = (intervalDCA: number | null) => {
  if (intervalDCA == null) return '-'
  if (intervalDCA === 3600 * 24 * 28) return 'month'
  if (intervalDCA === 3600 * 24 * 14) return 'other week'
  if (intervalDCA === 3600 * 24 * 7) return 'week'
  if (intervalDCA === 3600 * 24 * 2) return 'other day'
  if (intervalDCA === 3600 * 24) return 'day'
  if (intervalDCA === 3600 * 2) return 'other hour'
  if (intervalDCA === 3600) return 'hour'
  if (intervalDCA % (3600 * 24 * 7) === 0) return `${intervalDCA / (3600 * 24 * 7)} weeks`
  if (intervalDCA % (3600 * 24) === 0) return `${intervalDCA / (3600 * 24)} days`
  if (intervalDCA % 3600 === 0) return `${intervalDCA / 3600} hours`
  return '-'
}

const suffixly = (intervalDCA: number | null) => {
  if (intervalDCA == null) return '-'
  if (intervalDCA === 3600 * 24 * 28) return 'monthly'
  if (intervalDCA === 3600 * 24 * 14) return 'every other week'
  if (intervalDCA === 3600 * 24 * 7) return 'weekly'
  if (intervalDCA === 3600 * 24 * 2) return 'every other day'
  if (intervalDCA === 3600 * 24) return 'daily'
  if (intervalDCA === 3600 * 2) return 'every other hour'
  if (intervalDCA === 3600) return 'hourly'
  if (intervalDCA % (3600 * 24 * 7) === 0) return `every ${intervalDCA / (3600 * 24 * 7)} weeks`
  if (intervalDCA % (3600 * 24) === 0) return `every ${intervalDCA / (3600 * 24)} days`
  if (intervalDCA % 3600 === 0) return `every ${intervalDCA / 3600} hours`
  return '-'
}

export const useIntervalStrings = () => {
  const { intervalDCA, weeksInvalidReason, daysInvalidReason, hoursInvalidReason } = useConfigurableIntervalDCA()
  const anyError = useMemo(() => {
    return intervalDCA === 0 || weeksInvalidReason != null || daysInvalidReason != null || hoursInvalidReason != null
  }, [intervalDCA, weeksInvalidReason, daysInvalidReason, hoursInvalidReason])
  return useMemo(
    () => ({
      anyError,
      intervalString: `DCA will execute every ${anyError ? '-' : suffix(intervalDCA)}`,
      intervalStringly: `Executes ${anyError ? '-' : suffixly(intervalDCA)}`,
    }),
    [anyError, intervalDCA],
  )
}
