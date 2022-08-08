import React from 'react'
import styled from 'styled-components'
import { useFarmType } from 'hooks/useFarmType'
import { Flex } from 'uikit'
import SummitButton from 'uikit/components/Button/SummitButton'
import { pressableMixin } from 'uikit/util/styledMixins'
import { SelectorWrapperBase } from 'uikit/widgets/Selector/styles'

const buttonWidth = 120
const buttonHeight = 28

const SelectorFlex = styled(Flex)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-left: 6px;
  margin-right: 6px;
`

const SelectorWrapper = styled(SelectorWrapperBase)`
  display: flex;
  justify-content: center;
  margin: 4px 0px;
  height: ${buttonHeight}px;
  width: ${buttonWidth * 2};
  border-radius: 22px;
  background-color: ${({ theme }) => theme.colors.background};
  position: relative;
`

const SelectedSummitButton = styled(SummitButton)<{ selectedIndex: number }>`
  pointer-events: none;
  position: absolute;
  top: 2px;
  height: ${buttonHeight - 4}px;
  width: ${buttonWidth - 4}px;
  left: ${({ selectedIndex }) => selectedIndex * buttonWidth + 2}px;
  z-index: 3;
  font-size: 14px;
`

const TextButton = styled.div`
  width: ${buttonWidth}px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  font-family: Courier Prime, monospace;
  font-size: 14px;
  height: ${buttonHeight}px;
  line-height: ${buttonHeight}px;
  text-align: center;

  ${pressableMixin}
`

const FarmActiveSelector: React.FC = () => {
  const { liveFarms, onSetLive } = useFarmType()
  return (
    <SelectorFlex>
      <SelectorWrapper>
        <SelectedSummitButton
          selectedIndex={liveFarms ? 0 : 1}
          padding="0px"
        >
          {liveFarms ? 'Active' : 'Inactive'}
        </SelectedSummitButton>
        <TextButton onClick={() => onSetLive(true)}>
          Active
        </TextButton>
        <TextButton onClick={() => onSetLive(false)}>
          Inactive
        </TextButton>
      </SelectorWrapper>
    </SelectorFlex>
  )
}

export default React.memo(FarmActiveSelector)
