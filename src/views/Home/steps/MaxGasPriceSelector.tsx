import React from 'react'
import styled from 'styled-components'
import SummitButton from 'uikit/components/Button/SummitButton'
import { pressableMixin } from 'uikit/util/styledMixins'
import { SelectorWrapperBase } from 'uikit/widgets/Selector/styles'
import { usePositionConfigState } from './introStore'

const buttonWidth = 100
const buttonHeight = 28

const SelectorWrapper = styled(SelectorWrapperBase)`
  display: flex;
  justify-content: center;
  height: ${buttonHeight}px;
  width: ${buttonWidth * 3};
  border-radius: 22px;
  position: relative;
`

const SelectedSummitButton = styled(SummitButton)<{ selectedIndex: number }>`
  pointer-events: none;
  position: absolute;
  top: 0px;
  height: ${buttonHeight - 0}px;
  max-height: ${buttonHeight - 0}px;
  min-height: ${buttonHeight - 0}px;
  width: ${buttonWidth - 0}px;
  left: ${({ selectedIndex }) => selectedIndex * buttonWidth + 0}px;
  z-index: 3;
  font-size: 14px;
  cursor: default;
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
  
  ${pressableMixin};
  
  cursor: ${({ selected }) => selected ? 'default' : 'pointer'};
`

const MaxGasPriceSelector = () => {
  const maxGasPrice = usePositionConfigState((state) => state.maxGasPrice)
  const setMaxGasPrice = usePositionConfigState((state) => state.setMaxGasPrice)
  const selectedIndex = maxGasPrice === '100' ? 0 : maxGasPrice === '200' ? 1 : 2
  return (
    <SelectorWrapper>
      <SelectedSummitButton selectedIndex={selectedIndex} padding="0px">
        {maxGasPrice} gwei
      </SelectedSummitButton>
      <TextButton
        onClick={() => setMaxGasPrice('100')}
        selected={selectedIndex === 0}
      >
        100 gwei
      </TextButton>
      <TextButton
        onClick={() => setMaxGasPrice('200')}
        selected={selectedIndex === 1}
      >
        200 gwei
      </TextButton>
      <TextButton
        onClick={() => setMaxGasPrice('500')}
        selected={selectedIndex === 2}
      >
        500 gwei
      </TextButton>
    </SelectorWrapper>
  )
}

export default React.memo(MaxGasPriceSelector)
