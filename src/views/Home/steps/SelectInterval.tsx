import React, { useCallback, useMemo } from 'react'
import { StepContentWrapper } from './StepContentWrapper'
import { Text, RowStart } from 'uikit'
import {
  IntroStep,
  useIntroActiveStep,
  usePositionConfigState,
} from './introStore'
import NumericInput from 'components/Input/NumericInput'

export const SelectInterval: React.FC = () => {
  const introStep = useIntroActiveStep()
  const expanded = introStep >= IntroStep.Interval
  const {
    intervalDCA,
    weeks,
    setWeeks,
    days,
    setDays,
    hours,
    setHours,
  } = usePositionConfigState((state) => ({
    intervalDCA: state.intervalDCA,
    weeks: state.weeks,
    setWeeks: state.setWeeks,
    days: state.days,
    setDays: state.setDays,
    hours: state.hours,
    setHours: state.setHours,
  }))

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
    if (intervalDCA % (3600 * 24 * 7) === 0)
      return `${intervalDCA / (3600 * 24 * 7)} weeks`
    if (intervalDCA % (3600 * 24) === 0)
      return `${intervalDCA / (3600 * 24)} days`
    if (intervalDCA % 3600 === 0) return `${intervalDCA / 3600} hours`
    return '-'
  }, [intervalDCA])

  return (
    <StepContentWrapper expanded={expanded}>
      <Text small>
        Choose how often you want your DCA to execute.
        <br />
        Less time between DCAs reduces your exposure to volitility,
        <br />
        but costs more gas (still only pennies per transaction).
        <br />
      </Text>
      <RowStart gap="12px">
        <NumericInput
          value={weeks}
          onChange={handleSetWeeks}
          endText="weeks"
          placeholder="0"
        />
        <Text small>-</Text>
        <NumericInput
          value={days}
          onChange={handleSetDays}
          endText="days"
          placeholder="0"
        />
        <Text small>-</Text>
        <NumericInput
          value={hours}
          onChange={handleSetHours}
          endText="hours"
          placeholder="0"
        />
      </RowStart>
      <Text italic>
        Interval:{' '}
        {intervalDCA === 0 ? '-' : `DCA executes every ${intervalString}`}
      </Text>
    </StepContentWrapper>
  )
}
