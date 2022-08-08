import React, { useCallback } from 'react'
import { Flex } from 'uikit'
import { Elevation } from 'config/constants/types'
import styled, { css } from 'styled-components'
import SummitButton from 'uikit/components/Button/SummitButton'
import { pressableMixin } from 'uikit/util/styledMixins'
import { SelectorWrapperBase } from 'uikit/widgets/Selector/styles'

const buttonWidth = 110

const SelectorFlex = styled(Flex)`
  display: flex;
  margin: 0px auto 0px auto;
  flex-direction: row;
  align-items: center;
  height: 32px;
  width: ${buttonWidth * 3}px;
  justify-content: center;
`

const SelectorWrapper = styled(SelectorWrapperBase)`
  display: flex;
  justify-content: center;
  margin: 4px 0px;
  border-radius: 22px;
  position: relative;
`

const SelectedSummitButton = styled(SummitButton)<{ selectedIndex: number }>`
  pointer-events: none;
  position: absolute;
  top: 2px;
  height: 28px;
  width: ${buttonWidth - 4}px;
  left: ${({ selectedIndex }) => selectedIndex * buttonWidth + 2}px;
  z-index: 3;
`

const TextButton = styled.div<{ disabled: boolean }>`
  width: ${buttonWidth}px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  font-family: Courier Prime, monospace;
  font-size: 14px;
  height: 32px;
  line-height: 32px;
  text-align: center;

  ${({ theme, disabled }) =>
    pressableMixin({
      theme,
      disabled,
      disabledStyles: css`
        text-decoration: line-through;
      `,
    })}
`



export enum FarmInteractionType {
  Deposit = 'DEPOSIT',
  Withdraw = 'WITHDRAW',
  Elevate = 'ELEVATE',
}

interface Props {
  isApproved: boolean
  elevation: Elevation
  farmInteractionType: FarmInteractionType
  setFarmInteractionType: (FarmInteractionType) => void
}

const FarmInteractionTypeSelector: React.FC<Props> = ({
  isApproved,
  elevation,
  farmInteractionType,
  setFarmInteractionType,
}) => {
  const approveOrDeposit = isApproved ? 'DEPOSIT' : 'APPROVE'
  const selectedIndex = farmInteractionType === FarmInteractionType.Deposit ? 0 :
    farmInteractionType === FarmInteractionType.Elevate ? 1 : 2

  const summitButtonText = () => {
    if (farmInteractionType === FarmInteractionType.Deposit) return approveOrDeposit
    return farmInteractionType
  }

  const handleDepositClick = useCallback(
    () => {
      setFarmInteractionType(FarmInteractionType.Deposit)
    }, 
    [setFarmInteractionType]
  )
  const handleWithdrawClick = useCallback(
    () => {
      if (!isApproved) return
      setFarmInteractionType(FarmInteractionType.Withdraw)
    }, 
    [setFarmInteractionType, isApproved]
  )
  const handleElevateClick = useCallback(
    () => {
      if (!isApproved) return
      setFarmInteractionType(FarmInteractionType.Elevate)
    }, 
    [setFarmInteractionType, isApproved]
  )

  return (
    <SelectorFlex>
      <SelectorWrapper>
        <SelectedSummitButton summitPalette={elevation} selectedIndex={selectedIndex}>
          {summitButtonText()}
        </SelectedSummitButton>
        <TextButton onClick={handleDepositClick} disabled={false}>
          {approveOrDeposit}
        </TextButton>
        <TextButton onClick={handleElevateClick} disabled={!isApproved}>
          {FarmInteractionType.Elevate}
        </TextButton>
        <TextButton onClick={handleWithdrawClick} disabled={!isApproved}>
          {FarmInteractionType.Withdraw}
        </TextButton>
      </SelectorWrapper>
    </SelectorFlex>
  )
}

export default FarmInteractionTypeSelector
