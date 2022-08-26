import { Card } from 'components/Card'
import React from 'react'
import { useConfigurableGetStarted } from 'state/hooks'
import { useIntroActiveStep } from 'state/introHooks'
import { IntroStep } from 'state/types'
import styled from 'styled-components'
import { SummitButton, Text } from 'uikit'
import { AddFunds } from './AddFunds'
import { AmountIn } from './AmountIn'
import { ApproveIn } from './ApproveIn'
import { ConfigPreview } from './ConfigPreview'
import { Finalize } from './Finalize'
import { SelectInterval } from './SelectInterval'
import { SelectOuts } from './SelectOuts'
import { SelectTokenIn } from './SelectTokenIn'

const IntroText = styled(Text)`
  max-width: 500px;
`

const StepsRowWrap = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 24px;
`

const stepTitle: Record<IntroStep, string> = {
  [IntroStep.NotStarted]: '',
  [IntroStep.TokenIn]: '1a. Choose which token to spend.',
  [IntroStep.Amount]: '1b. Choose how much to DCA.',
  [IntroStep.Outs]: '2. Choose which tokens to buy.',
  [IntroStep.Interval]: '3. Select how often to DCA.',
  [IntroStep.Approve]: '4a. Approve your DCA token spend.',
  [IntroStep.Treasury]: '4b. Fund your account.',
  [IntroStep.Finalize]: '5. Finalize.',
}
const stepHalfWidth: Record<IntroStep, boolean> = {
  [IntroStep.NotStarted]: true,
  [IntroStep.TokenIn]: true,
  [IntroStep.Amount]: true,
  [IntroStep.Outs]: false,
  [IntroStep.Interval]: false,
  [IntroStep.Approve]: true,
  [IntroStep.Treasury]: true,
  [IntroStep.Finalize]: false,
}

const stepContent: Record<IntroStep, JSX.Element | null> = {
  [IntroStep.NotStarted]: null,
  [IntroStep.TokenIn]: <SelectTokenIn />,
  [IntroStep.Outs]: <SelectOuts />,
  [IntroStep.Interval]: <SelectInterval />,
  [IntroStep.Amount]: <AmountIn />,
  [IntroStep.Approve]: <ApproveIn />,
  [IntroStep.Treasury]: <AddFunds />,
  [IntroStep.Finalize]: <Finalize />,
}

export const IntroSteps: React.FC = () => {
  const introStep = useIntroActiveStep()
  const { getStarted } = useConfigurableGetStarted()
  console.log({
    getStarted
  })
  return (
    <>
      <Text>
        <b>What is Involica?</b>
      </Text>
      <IntroText small italic>
        <br />
        <b>In short, the bear market is rough, Involica is the solution.</b>
        <br />
        <br />
        Involica is dead simple insulation against market volitility. You create
        a DCA Position, one input token and multiple out tokens, set how often,
        and how much to DCA each time.
        <br />
        <br />
        Then for each DCA, Involica pulls the funds from your wallet, performs
        the necessary swaps (0.1% swap fee), and sends your new portfolio back
        in a single transaction. Your funds always remain in your wallet, safe
        and secure.
        <br />
        <br />
        <b>In</b>sulate from market <b>voli</b>tility with D<b>CA</b>
      </IntroText>
      <br />
      <br />
      <br />
      <SummitButton
        onClick={getStarted}
        activeText="I Understand, Get Started"
      />
      <ConfigPreview key="" />
      <br />
      <br />
      <br />
      <StepsRowWrap>
        {[
          IntroStep.TokenIn,
          IntroStep.Amount,
          IntroStep.Outs,
          IntroStep.Interval,
          IntroStep.Approve,
          IntroStep.Treasury,
          IntroStep.Finalize,
        ].map((step) => (
          <Card
            halfWidth={stepHalfWidth[step]}
            key={step}
            expanded={introStep >= step}
            title={stepTitle[step]}
          >
            {introStep >= step && stepContent[step]}
          </Card>
        ))}
      </StepsRowWrap>
    </>
  )
}
