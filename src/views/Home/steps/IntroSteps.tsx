import React from 'react'
import styled from 'styled-components'
import { Text } from 'uikit'
import { AddFundsStep } from './AddFunds'
import { IntroStep } from './introStore'
import { SelectIntervalAndAmount } from './SelectIntervalAndAmount'
import { SelectOuts } from './SelectOuts'
import { SelectTokenIn } from './SelectTokenIn'

const HoverableText = styled(Text)<{ active: boolean }>`
  text-decoration: ${({ active }) => active && 'underline'};
`

const StepHeader: React.FC<{
  text: string
  index: number
  active: boolean
}> = ({ text, index, active }) => {
  return (
    <HoverableText bold={active} active={active}>
      {index + 1}. {text}
    </HoverableText>
  )
}

const stepTitle: Record<IntroStep, string> = {
  [IntroStep.TokenIn]: 'Choose which token you want to DCA with.',
  [IntroStep.Outs]:
    'Select one or more tokens to DCA into to create a portfolio.',
  [IntroStep.IntervalAndAmount]:
    'Select how often and how much you want to DCA',
  [IntroStep.Treasury]: 'Fund your account.',
  [IntroStep.Approve]: 'Approve your DCA token.',
  [IntroStep.Finalize]: 'Finalize.',
}

const stepContent: Record<IntroStep, JSX.Element | null> = {
  [IntroStep.TokenIn]: <SelectTokenIn />,
  [IntroStep.IntervalAndAmount]: <SelectIntervalAndAmount />,
  [IntroStep.Outs]: <SelectOuts />,
  [IntroStep.Treasury]: <AddFundsStep />,
  [IntroStep.Approve]: null,
  [IntroStep.Finalize]: null,
}

export const IntroSteps: React.FC = () => {
  return (
    <>
      <Text>
        To get started with Involica:
        <br />
        <br />
        <Text small italic>
          {[
            IntroStep.TokenIn,
            IntroStep.Outs,
            IntroStep.IntervalAndAmount,
            IntroStep.Treasury,
            IntroStep.Approve,
          ].map((step, stepIndex) => (
            <span key={step}>
              {stepIndex + 1}. {stepTitle[step]}
              <br />
            </span>
          ))}
        </Text>
      </Text>
      <br />
      <br />
      {[
        IntroStep.TokenIn,
        IntroStep.Outs,
        IntroStep.IntervalAndAmount,
        IntroStep.Treasury,
        IntroStep.Approve,
        IntroStep.Finalize
      ].map((step, stepIndex) => (
        <div key={step}>
          <StepHeader
            index={stepIndex}
            text={stepTitle[step]}
            active
          />
          {stepContent[step]}
        </div>
      ))}
    </>
  )
}
