import React from 'react'
import styled from 'styled-components'
import { SummitButton, Text } from 'uikit'
import { AddFundsStep } from './AddFunds'
import { AmountIn } from './AmountIn'
import { ApproveIn } from './ApproveIn'
import { IntroStep, usePositionConfigState } from './introStore'
import { SelectInterval } from './SelectInterval'
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
  [IntroStep.NotStarted]: '',
  [IntroStep.TokenIn]: 'Choose which token you want to DCA with.',
  [IntroStep.Outs]: 'Select multiple tokens to DCA into to create a portfolio.',
  [IntroStep.Interval]: 'Select how often to execute the DCA.',
  [IntroStep.Amount]: 'Select the amount to use for each DCA.',
  [IntroStep.Approve]: 'Approve your DCA token.',
  [IntroStep.Treasury]: 'Fund your account.',
  [IntroStep.Finalize]: 'Finalize.',
}

const stepContent: Record<IntroStep, JSX.Element | null> = {
  [IntroStep.NotStarted]: null,
  [IntroStep.TokenIn]: <SelectTokenIn />,
  [IntroStep.Outs]: <SelectOuts />,
  [IntroStep.Interval]: <SelectInterval />,
  [IntroStep.Amount]: <AmountIn />,
  [IntroStep.Approve]: <ApproveIn />,
  [IntroStep.Treasury]: <AddFundsStep />,
  [IntroStep.Finalize]: null,
}

export const IntroSteps: React.FC = () => {
  const getStarted = usePositionConfigState((state) => state.getStarted)
  return (
    <>
      <Text>
        <b>What is Involica?</b>
      </Text>
      <Text small italic>
        <br />
        <b>In short, the bear market is rough, Involica is the solution.</b>
        <br/>
        <br/>
        Involica is dead simple insulation against market volitility.
        <br />
        You create a DCA Portfolio, one token in and multiple tokens out,
        <br />
        set how often, and how much to DCA each time.
        <br />
        <br />
        Then for each DCA, Involica pulls the funds from your wallet,
        <br />
        performs the necessary swaps, and sends your new portfolio
        <br />
        back in a single transaction. Your funds always remain in your
        <br />
        wallet, safe and secure.
        <br />
        <br />
        <b>In</b>sulate from the bear market <b>voli</b>tility with D<b>CA</b>
      </Text>
      <br />
      <br />
      <br />
      <SummitButton onClick={getStarted} activeText="Get started with Involica" />
      <br />
      <br />
      <br />
      {[
        IntroStep.TokenIn,
        IntroStep.Outs,
        IntroStep.Interval,
        IntroStep.Amount,
        IntroStep.Approve,
        IntroStep.Treasury,
        IntroStep.Finalize,
      ].map((step, stepIndex) => (
        <div key={step}>
          <StepHeader index={stepIndex} text={stepTitle[step]} active />
          {stepContent[step]}
        </div>
      ))}
    </>
  )
}
