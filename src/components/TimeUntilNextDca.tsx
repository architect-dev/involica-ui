import React from 'react'
import { useTimeUntilNextDCA } from 'state/hooks'
import { Text } from 'uikit'
import { getTimeRemainingText } from 'utils/timestamp'

export const TimeUntilNextDca: React.FC = () => {
  const timeUntilNextDca = useTimeUntilNextDCA()
  return (
    <Text bold italic textAlign='right'>
      { timeUntilNextDca === 0 ? 'Ready' : timeUntilNextDca != null ? getTimeRemainingText(timeUntilNextDca) : '-'}
    </Text>
  )
}