import { SummitPalette } from 'config/constants'
import React from 'react'
import styled from 'styled-components'
import { Flex } from 'uikit'
import SummitButton from 'uikit/components/Button/SummitButton'
import { pressableMixin } from 'uikit/util/styledMixins'
import { SelectorWrapperBase } from 'uikit/widgets/Selector/styles'

const buttonWidth = 180
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
  text-shadow: ${({ theme }) => `1px 1px 2px ${theme.colors.textShadow}`};
  font-family: Courier Prime, monospace;
  font-size: 14px;
  height: ${buttonHeight}px;
  line-height: ${buttonHeight}px;
  text-align: center;

  ${pressableMixin}
`

interface Props {
  lockForEverest: boolean
  selectLockForEverest: (boolean) => void
}

const HarvestLockForEverestSelector: React.FC<Props> = ({ lockForEverest, selectLockForEverest }) => {
  return (
    <SelectorFlex>
      <SelectorWrapper>
        <SelectedSummitButton
          summitPalette={lockForEverest ? SummitPalette.EVEREST : SummitPalette.BASE}
          selectedIndex={lockForEverest ? 0 : 1}
          padding="0px"
        >
          {lockForEverest ? 'LOCK FOR EVEREST' : 'HARVEST'}
        </SelectedSummitButton>
        <TextButton onClick={() => selectLockForEverest(true)}>
          LOCK FOR EVEREST
        </TextButton>
        <TextButton onClick={() => selectLockForEverest(false)}>
          HARVEST
        </TextButton>
      </SelectorWrapper>
    </SelectorFlex>
  )
}

export default React.memo(HarvestLockForEverestSelector)
