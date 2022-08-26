import React, { useCallback, useMemo } from 'react'
import { useConfigurableIntervalDCA } from 'state/hooks'
import { RowStart, Text } from 'uikit'
import NumericInput from './Input/NumericInput'

export const IntervalSelector: React.FC = () => {
  const { intervalDCA, weeks, days, hours, setWeeks, setDays, setHours } = useConfigurableIntervalDCA()

  const handleSetWeeks = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setWeeks(e.currentTarget.value)
    },
    [setWeeks],
  )
  const handleSetDays = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setDays(e.currentTarget.value)
    },
    [setDays],
  )
  const handleSetHours = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setHours(e.currentTarget.value)
    },
    [setHours],
  )

  const intervalString = useMemo(() => {
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
  }, [intervalDCA])

  return (
    <>
      <RowStart gap="6px">
        <Text small>Every: </Text>
        <NumericInput value={weeks} onChange={handleSetWeeks} endText="weeks" placeholder="0" />
        <Text small>, </Text>
        <NumericInput value={days} onChange={handleSetDays} endText="days" placeholder="0" />
        <Text small> and </Text>
        <NumericInput value={hours} onChange={handleSetHours} endText="hours" placeholder="0" />
      </RowStart>
      <Text italic bold>
        <br />
        {intervalDCA === 0 ? '-' : `DCA will execute every ${intervalString}`}
      </Text>
    </>
  )
}
