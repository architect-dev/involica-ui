import React, { useCallback, useEffect, useState } from 'react'
import { StepContentWrapper } from './styles'
import { Text, RowStart } from 'uikit'
import { usePositionConfigState } from './introStore'
import NumericInput from 'components/Input/NumericInput'

const sToI = (s: string): number => {
  return s == null || s === '' ? 0 : parseInt(s)
}
const dhmToSec = (d: string, h: string, m: string): number => {
  return sToI(d) * 86400 + sToI(h) * 3600 + sToI(m) * 60
}

export const SelectIntervalAndAmount: React.FC = () => {
  const expanded = true
  const intervalDCA = usePositionConfigState((state) => state.intervalDCA)
  const setIntervalDCA = usePositionConfigState((state) => state.setIntervalDCA)
  const [days, setDays] = useState<string>('')
  const [hours, setHours] = useState<string>('')
  const [minutes, setMinutes] = useState<string>('')

  const handleSetDays = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setDays(`${sToI(e.currentTarget.value)}`)
    },
    [setDays],
  )
  const handleSetHours = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setHours(`${sToI(e.currentTarget.value)}`)
    },
    [setHours],
  )
  const handleSetMinutes = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setMinutes(`${sToI(e.currentTarget.value)}`)
    },
    [setMinutes],
  )

  useEffect(() => setIntervalDCA(dhmToSec(days, hours, minutes)), [
    setIntervalDCA,
    days,
    hours,
    minutes,
  ])

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
          value={days}
          onChange={handleSetDays}
          endText="days"
          placeholder="0"
          min="0"
          step="1"
          type="number"
        />
        <Text small>-</Text>
        <NumericInput
          value={hours}
          onChange={handleSetHours}
          endText="hours"
          placeholder="0"
          min="0"
          max="23"
          step="1"
          type="number"
        />
        <Text small>-</Text>
        <NumericInput
          value={minutes}
          onChange={handleSetMinutes}
          endText="mins"
          placeholder="0"
          min="0"
          max="59"
          step="1"
          type="number"
        />
      </RowStart>
      <br />
      <br />
      <Text>Interval (seconds): {intervalDCA === 0 ? '-' : intervalDCA}</Text>
    </StepContentWrapper>
  )
}
