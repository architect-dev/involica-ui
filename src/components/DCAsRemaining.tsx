import React from 'react'
import { useDcasRemaining } from 'state/hooks'
import { Text } from 'uikit'

export const DCAsRemaining: React.FC = () => {
  const dcasRemaining = useDcasRemaining()
  return (
    <Text bold italic textAlign='right'>
      { dcasRemaining }
    </Text>
  )
}