import React from 'react'
import styled from 'styled-components'
import SummitButton from 'uikit/components/Button/SummitButton'
import { pressableMixin } from 'uikit/util/styledMixins'
import { SelectorWrapperBase } from 'uikit/widgets/Selector/styles'

const buttonWidth = 100
const buttonHeight = 28

const SelectorWrapper = styled(SelectorWrapperBase)`
  display: flex;
  justify-content: center;
  height: ${buttonHeight}px;
  width: ${buttonWidth * 3};
  border-radius: 22px;
  background-color: ${({ theme }) => theme.colors.background};
  position: relative;
`

const SelectedSummitButton = styled(SummitButton)<{ selectedIndex: number }>`
  pointer-events: none;
  position: absolute;
  top: 3px;
  height: ${buttonHeight - 6}px;
  max-height: ${buttonHeight - 6}px;
  min-height: ${buttonHeight - 6}px;
  width: ${buttonWidth - 6}px;
  left: ${({ selectedIndex }) => selectedIndex * buttonWidth + 3}px;
  z-index: 3;
  font-size: 14px;
`

const TextButton = styled.div<{ selected: boolean }>`
  width: ${buttonWidth}px;
  cursor: pointer;
  color: ${({ theme, selected }) =>
    selected ? 'transparent' : theme.colors.text};
  font-family: Courier Prime, monospace;
  font-size: 14px;
  height: ${buttonHeight}px;
  line-height: ${buttonHeight}px;
  text-align: center;

  ${pressableMixin}
`

const MaxGasPriceSelector: React.FC<{
  maxGas: '5' | '15' | '50'
  setMaxGas: (string) => void
}> = ({ maxGas, setMaxGas }) => {
  const selectedIndex = maxGas === '5' ? 0 : maxGas === '15' ? 1 : 2
  return (
    <SelectorWrapper>
      <SelectedSummitButton selectedIndex={selectedIndex} padding="0px">
        {maxGas} gwei
      </SelectedSummitButton>
      <TextButton onClick={() => setMaxGas('5')} selected={selectedIndex === 0}>
        5 gwei
      </TextButton>
      <TextButton
        onClick={() => setMaxGas('15')}
        selected={selectedIndex === 1}
      >
        15 gwei
      </TextButton>
      <TextButton
        onClick={() => setMaxGas('50')}
        selected={selectedIndex === 2}
      >
        50 gwei
      </TextButton>
    </SelectorWrapper>
  )
}

export default React.memo(MaxGasPriceSelector)
