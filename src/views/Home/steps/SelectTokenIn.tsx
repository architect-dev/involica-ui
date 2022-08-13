import React, {  } from 'react'
import { StepContentWrapper } from './styles'
import { Text } from 'uikit'
import { usePositionConfigState } from './introStore'
import { TokenSelectButton } from 'components/TokenSelect/TokenSelectButton'

export const SelectTokenIn: React.FC = () => {
  const expanded = true
  const tokenIn = usePositionConfigState((state) => state.tokenIn)
  const setTokenIn = usePositionConfigState((state) => state.setTokenIn)

  return (
    <StepContentWrapper expanded={expanded}>
      <Text small>
        Involica swaps one input token for multiple output tokens.
        <br />
        Each DCA executes all of these swaps together.
        <br />
        <br />
        <i>Select your input token:</i>
      </Text>
      <TokenSelectButton
        token={tokenIn}
        setToken={setTokenIn}
      />
    </StepContentWrapper>
  )
}
