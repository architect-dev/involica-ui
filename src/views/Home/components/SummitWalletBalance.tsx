import React from 'react'
import { Text } from 'uikit'
import { useWeb3React } from '@web3-react/core'
import useSummitTokenBalance from 'hooks/useTokenBalance'
import { getBalanceNumber } from 'utils/formatBalance'
import CardValue from './CardValue'
import { Elevation } from 'config/constants/types'

const SummitWalletBalance = () => {
  const summitBalance = useSummitTokenBalance()
  const { account } = useWeb3React()

  if (!account) {
    return (
      <Text color="textDisabled" style={{ lineHeight: '36px' }}>
        Locked
      </Text>
    )
  }

  return <CardValue value={getBalanceNumber(summitBalance)} fontSize="24" summitPalette={Elevation.OASIS} />
}

export default SummitWalletBalance
