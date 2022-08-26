import React from 'react'
import { Text } from 'uikit'
import { TokenInSelector } from 'components/TokenSelect/TokenInSelector'

export const SelectTokenIn: React.FC = () => {
  return (
    <>
      <Text small>
        Involica swaps one input token for multiple output tokens.
        <br />
        Each DCA executes all of these swaps together.
        <br />
        <br />
        <i>Select your input token:</i>
      </Text>
      <TokenInSelector intro />
    </>
  )
}
