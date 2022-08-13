import { StyledTextInput } from 'components/Input'
import TextInput from 'components/Input/TextInput'
import TokenInput from 'components/TokenInput'
import { getNativeTokenSymbol } from 'config/constants'
import React, { useState } from 'react'
import styled from 'styled-components'
import { SummitButton, Text } from 'uikit'
import { pressableMixin } from 'uikit/util/styledMixins'
import { AddFundsStep } from './AddFunds'
import { IntroStep } from './introStore'
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

const StepContentWrapper = styled.div<{
  expanded: boolean
  borderOnlyWhenExpanded?: boolean
}>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 18px;
  border-left: 1px dashed
    ${({ theme, expanded, borderOnlyWhenExpanded = false }) =>
      !borderOnlyWhenExpanded || expanded ? theme.colors.text : 'transparent'};
  padding: ${({ expanded }) => (expanded ? '24px 18px' : '12px 18px')};
  transition: padding 200ms;
  margin-left: 4px;
`

const StepContent: React.FC<{
  expanded: boolean
  expandedContent: JSX.Element[] | JSX.Element | null
  borderOnlyWhenExpanded?: boolean
}> = ({ expanded, expandedContent, borderOnlyWhenExpanded = false }) => {
  return (
    <StepContentWrapper
      expanded={expanded}
      borderOnlyWhenExpanded={borderOnlyWhenExpanded}
    >
      {expanded && expandedContent}
    </StepContentWrapper>
  )
}

const stepTitle: Record<IntroStep, string> = {
  [IntroStep.TokenIn]: 'Choose which token you want to DCA with.',
  [IntroStep.IntervalAndAmount]:
    'Select how much and how often you want to DCA.',
  [IntroStep.Outs]:
    'Select one or more tokens to DCA into to create a portfolio.',
  [IntroStep.Treasury]: 'Fund your account.',
  [IntroStep.Approve]: 'Approve your DCA token.',
  [IntroStep.Finalize]: 'Finalize.',
}

const stepContent: Record<IntroStep, JSX.Element | null> = {
  [IntroStep.TokenIn]: <SelectTokenIn />,
  [IntroStep.IntervalAndAmount]: null,
  [IntroStep.Outs]: null,
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
            IntroStep.IntervalAndAmount,
            IntroStep.Outs,
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
        IntroStep.IntervalAndAmount,
        IntroStep.Outs,
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
