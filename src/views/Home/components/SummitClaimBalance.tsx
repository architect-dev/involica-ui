import React from 'react'
import { Text } from 'uikit'
import CardValue from './CardValue'
import { Elevation } from 'config/constants/types'

interface Props {
  account: string | null
  earned: number
}

const SummitClaimBalance: React.FC<Props> = ({ account, earned }) => {
  if (!account) {
    return (
      <Text color="textDisabled" style={{ lineHeight: '60px' }}>
        Locked
      </Text>
    )
  }

  return <CardValue value={earned} summitPalette={Elevation.OASIS} />
}

export default SummitClaimBalance
