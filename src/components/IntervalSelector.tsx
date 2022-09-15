import React, { useCallback } from 'react'
import { useConfigurableIntervalDCA } from 'state/hooks'
import { useIntervalStrings } from 'state/uiHooks'
import { Column, ColumnStart, RowStart, Text } from 'uikit'
import NumericInput from './Input/NumericInput'

export const IntervalSelector: React.FC<{ intro?: boolean }> = ({ intro = false }) => {
  const {
    intervalDCA,
    weeks,
    weeksInvalidReason,
    days,
    daysInvalidReason,
    hours,
    hoursInvalidReason,
    setWeeks,
    setDays,
    setHours,
  } = useConfigurableIntervalDCA()
  const { intervalString, intervalStringly } = useIntervalStrings()

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

  return (
    <ColumnStart gap={intro ? 'inherit' : '4px'}>
      <RowStart>
        { intro && <Text small mr='6px'>Every: </Text> }
        <NumericInput
          value={weeks}
          onChange={handleSetWeeks}
          endText="wk"
          placeholder="0"
          invalid={weeksInvalidReason != null}
          rightBlend
          changed
        />
        <NumericInput
          value={days}
          onChange={handleSetDays}
          endText="d"
          placeholder="0"
          invalid={daysInvalidReason != null}
          leftBlend
          rightBlend
        />
        <NumericInput
          value={hours}
          onChange={handleSetHours}
          endText="h"
          placeholder="0"
          invalid={hoursInvalidReason != null}
          leftBlend
        />
      </RowStart>
      <Column mt={intro ? '-12px' : '0'}>
        {weeksInvalidReason != null && (
          <Text red italic>
            Weeks: {weeksInvalidReason}
          </Text>
        )}
        {daysInvalidReason != null && (
          <Text red italic>
            Days: {daysInvalidReason}
          </Text>
        )}
        {hoursInvalidReason != null && (
          <Text red italic>
            Hours: {hoursInvalidReason}
          </Text>
        )}
        {intervalDCA === 0 && (
          <Text red italic>
            DCA interval cannot be 0
          </Text>
        )}
      </Column>
      <Text italic bold={intro}>
        {intro && <br />}
        {intervalDCA === 0 ? '-' : intro ? intervalString : intervalStringly}
      </Text>
    </ColumnStart>
  )
}
