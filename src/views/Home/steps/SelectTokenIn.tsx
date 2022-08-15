import React, { useMemo } from 'react'
import { StepContentWrapper } from './StepContentWrapper'
import { Text } from 'uikit'
import { IntroStep, useIntroActiveStep, usePositionConfigState } from './introStore'
import { TokenSelectButton } from 'components/TokenSelect/TokenSelectButton'

export const SelectTokenIn: React.FC = () => {
  const introStep = useIntroActiveStep()
  const expanded = introStep >= IntroStep.TokenIn
  const tokenIn = usePositionConfigState((state) => state.tokenIn)
  const setTokenIn = usePositionConfigState((state) => state.setTokenIn)
  const outs = usePositionConfigState((state) => state.outs)
  const disabledReasons = useMemo(
    () => {
      const reasons = {}
      outs.forEach((out) => {
        reasons[out.token] = 'Used as DCA out'
      })
      return reasons
    },
    [outs]
  )
  console.log({
    disabledReasons
  })

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
        noTokenString='Select'
        disabledTokens={disabledReasons}
        modalVariant='tokenIn'
      />
    </StepContentWrapper>
  )
}
