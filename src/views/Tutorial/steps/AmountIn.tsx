import React, {  } from 'react'
import { Text } from 'uikit'
import { AmountInSelector } from 'components/AmountInSelector'
import { usePositionTokenInWithData } from 'state/hooks'

export const AmountIn: React.FC = () => {
  const { tokenInData } = usePositionTokenInWithData()
  
  return (
    <>
      <Text small italic>
        Set the amount of <b>{tokenInData?.symbol}</b> to use for DCA.
      </Text>
      <AmountInSelector/>
    </>
  )
}
