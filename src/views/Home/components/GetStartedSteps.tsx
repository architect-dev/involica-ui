import { StyledTextInput } from 'components/Input'
import TextInput from 'components/Input/TextInput'
import TokenInput from 'components/TokenInput'
import { getNativeTokenSymbol } from 'config/constants'
import React, { useState } from 'react'
import styled from 'styled-components'
import { SummitButton, Text } from 'uikit'
import { pressableMixin } from 'uikit/util/styledMixins'

const HoverableText = styled(Text)<{ active: boolean }>`
  ${pressableMixin}
  text-decoration: ${({ active }) => active && 'underline'};
`

const TextButton: React.FC<{ text: string; index: number; setExpanded: (number) => void; expanded: boolean }> = ({
  text,
  index,
  setExpanded,
  expanded,
}) => {
  return (
    <HoverableText onClick={() => setExpanded(index)} bold={expanded} active={expanded}>
      {index}. {text}
    </HoverableText>
  )
}

const StepContentWrapper = styled.div<{ expanded: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 18px;
  border-left: 1px dashed ${({ theme }) => theme.colors.text};
  padding: ${({ expanded }) => (expanded ? '24px 18px' : '12px 18px')};
  transition: padding 200ms;
  margin-left: 4px;
`

const StepContent: React.FC<{
  expanded: boolean
  expandedContent: JSX.Element[] | JSX.Element | null
  collapsedContent: JSX.Element[] | JSX.Element | null
}> = ({ expanded, expandedContent, collapsedContent }) => {
  return <StepContentWrapper expanded={expanded}>{expanded ? expandedContent : collapsedContent}</StepContentWrapper>
}

export const GetStartedSteps: React.FC = () => {
  const [expanded, setExpanded] = useState<number>(0)
  return (
    <>
      <TextButton index={1} text="Add Funds" setExpanded={setExpanded} expanded={expanded === 1} />
      <StepContent
        expanded={expanded === 1}
        collapsedContent={<Text>Funds: <b>20.0 FTM ($6.32)</b></Text>}
        expandedContent={[
          <Text>
            Deposit <b>{getNativeTokenSymbol()}</b> to cover the cost of your DCA transactions.
            <br />
            You can remove these funds at any point.
            <br />
            (20 FTM should be more than enough)
          </Text>,
          <TokenInput
            symbol={getNativeTokenSymbol()}
            onChange={console.log}
            value='20'
            max='365.6754'
          />,
          <SummitButton>
            ADD FUNDS
          </SummitButton>
        ]}
      />
      <TextButton index={2} text="Build your Portfolio" setExpanded={setExpanded} expanded={expanded === 2} />
      <StepContent
        expanded={expanded === 2}
        collapsedContent={<Text>Collapsed</Text>}
        expandedContent={<Text>Expanded</Text>}
      />
      <TextButton index={3} text="Approve your Spends" setExpanded={setExpanded} expanded={expanded === 3} />
      <StepContent
        expanded={expanded === 3}
        collapsedContent={<Text>Collapsed</Text>}
        expandedContent={<Text>Expanded</Text>}
      />
      <TextButton index={4} text="Confirm" setExpanded={setExpanded} expanded={expanded === 4} />
      <StepContent
        expanded={expanded === 4}
        collapsedContent={<Text>Collapsed</Text>}
        expandedContent={<Text>Expanded</Text>}
      />
    </>
  )
}
