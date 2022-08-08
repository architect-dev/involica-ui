import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Flex, SummitButton } from 'uikit'
import { pressableMixin } from 'uikit/util/styledMixins'
import { SelectorWrapperBase } from 'uikit/widgets/Selector/styles'

const buttonWidth = 180

const SelectorFlex = styled(Flex)`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 32px;
  width: ${buttonWidth * 2}px;
  justify-content: center;
`

const SelectorWrapper = styled(SelectorWrapperBase)`
  display: flex;
  justify-content: center;
  margin: 4px 0px;
  border-radius: 22px;
  position: relative;
`

const SelectedSummitButton = styled(SummitButton)<{ selected: FarmingTab }>`
  pointer-events: none;
  position: absolute;
  padding: 0px;
  top: 2px;
  height: 28px;
  width: ${buttonWidth - 4}px;
  left: ${({ selected }) => (selected === FarmingTab.Farm ? 0 : 1) * buttonWidth + 2}px;
  z-index: 3;
`

const TextButton = styled.div`
  width: ${buttonWidth}px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  font-family: Courier Prime, monospace;
  font-size: 14px;
  height: 32px;
  line-height: 32px;
  text-align: center;

  ${pressableMixin}
`

interface Props {
  selected: FarmingTab
  onSelect: (card: FarmingTab) => void
}

export enum FarmingTab {
  Farm = 'FARMING OVERVIEW',
  YieldWars = 'YIELD WARS',
}

export const FarmHeaderTabSelector: React.FC<Props> = ({ selected, onSelect }) => {
  const selectElevationCard = useCallback(() => {
    onSelect(FarmingTab.Farm)
  }, [onSelect])

  const selectYieldWarsCard = useCallback(() => {
    onSelect(FarmingTab.YieldWars)
  }, [onSelect])

  return (
    <SelectorFlex>
      <SelectorWrapper>
        <SelectedSummitButton selected={selected}>
          {selected}
        </SelectedSummitButton>
        <TextButton onClick={selectElevationCard}>
          {FarmingTab.Farm}
        </TextButton>
        <TextButton onClick={selectYieldWarsCard}>
          {FarmingTab.YieldWars}
        </TextButton>
      </SelectorWrapper>
    </SelectorFlex>
  )
}
