import React from 'react'
import { HelpCircle } from 'react-feather'
import Popup from 'reactjs-popup'
import styled from 'styled-components'
import { Text } from '../../components/Text/Text'

interface Props {
  content: React.ReactNode
}

const HelpWrapper = styled.span`
  height: 100%;
  margin-top: auto;
  margin-bottom: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  > * {
    stroke: ${({ theme }) => theme.colors.text};
  }
  :hover {
    > * {
      stroke-width: 3;
    }
  }
`

const PopUpCard = styled.div<{ padding?: string }>`
  flex-direction: column;
  justify-content: flex-start;
  flex: 1;
  position: relative;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 4px;
  padding: 6px 12px;
  max-width: 240px;
`

export const SummitTooltip: React.FC<Props> = React.memo(({ content }) => {
  return (
    <Popup
      trigger={
        <HelpWrapper>
          <HelpCircle size={14} />
        </HelpWrapper>
      }
      position="top center"
      closeOnDocumentClick
      closeOnEscape
      offsetX={0}
      offsetY={5}
      on={['hover', 'focus']}
      arrow
      className="tooltip"
    >
      <PopUpCard>
        <Text small italic>
          {content}
        </Text>
      </PopUpCard>
    </Popup>
  )
})
