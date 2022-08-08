import React from 'react'
import styled from 'styled-components'
import { useFarmType } from 'hooks/useFarmType'
import { Flex } from 'uikit'
import SummitButton from 'uikit/components/Button/SummitButton'
import { FarmType } from 'state/types'
import { pressableMixin } from 'uikit/util/styledMixins'
import { SelectorWrapperBase } from 'uikit/widgets/Selector/styles'

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
  background-color: ${({ theme }) => theme.colors.background};
  width: 225px;
  border-radius: 22px;
  position: relative;
`

const getFarmTypeWidth = (farmType: FarmType): number => {
  switch (farmType) {
    case FarmType.Token:
      return 85
    case FarmType.LP:
      return 70
    default:
    case FarmType.All:
      return 70
  }
}

const getFarmTypeOffset = (farmType: FarmType): number => {
  switch (farmType) {
    case FarmType.Token:
      return 72
    case FarmType.LP:
      return 153
    default:
    case FarmType.All:
      return 2
  }
}

const SelectedSummitButton = styled(SummitButton)<{ selectedFarmType: FarmType }>`
  pointer-events: none;
  position: absolute;
  top: 2px;
  height: ${buttonHeight - 4}px;
  width: ${({ selectedFarmType }) => getFarmTypeWidth(selectedFarmType)}px;
  left: ${({ selectedFarmType }) => getFarmTypeOffset(selectedFarmType)}px;
  z-index: 3;
  font-size: 14px;
`

const TextButton = styled.div<{ width: number }>`
  width: ${({ width }) => width}px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  font-family: Courier Prime, monospace;
  font-size: 14px;
  height: ${buttonHeight}px;
  line-height: ${buttonHeight}px;
  text-align: center;

  ${pressableMixin}
`

const FarmTypeSelector: React.FC = () => {
  const { farmType, onSetFarmType } = useFarmType()
  return (
    <SelectorFlex>
      <SelectorWrapper>
        <SelectedSummitButton
          selectedFarmType={farmType}
          padding="0px"
          onClick={() => onSetFarmType(FarmType.All)}
        >
          {farmType}
        </SelectedSummitButton>
        <TextButton width={getFarmTypeWidth(FarmType.All)} onClick={() => onSetFarmType(FarmType.All)}>
          {FarmType.All}
        </TextButton>
        <TextButton width={getFarmTypeWidth(FarmType.Token)} onClick={() => onSetFarmType(FarmType.Token)}>
          {FarmType.Token}
        </TextButton>
        <TextButton width={getFarmTypeWidth(FarmType.LP)} onClick={() => onSetFarmType(FarmType.LP)}>
          {FarmType.LP}
        </TextButton>
      </SelectorWrapper>
    </SelectorFlex>
  )
}

export default React.memo(FarmTypeSelector)
