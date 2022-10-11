import React from 'react'
import { useTimeUntilNextDCA } from 'state/hooks'
import { Text } from 'uikit'
import { Dots } from 'uikit/components/Dots'
import { getTimeRemainingText } from 'utils/timestamp'

export const TimeUntilNextDca: React.FC = () => {
  const timeUntilNextDca = useTimeUntilNextDCA()
  return (
    <Text bold textAlign='right'>
      { timeUntilNextDca === 0 ? <Dots>Executing</Dots> : timeUntilNextDca != null ? getTimeRemainingText(timeUntilNextDca) : '-'}
    </Text>
  )
}