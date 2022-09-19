import React, { useCallback, useMemo, useState } from 'react'
import { useNativeTokenFullData, useUserTreasury } from 'state/hooks'
import { SummitButton, Text, RowBetween, RowCenter, SummitPopUp } from 'uikit'
import { bnDisplay, useShowHideModal } from 'utils'
import TokenAndAmountSelector from './TokenAndAmountSelector'
import { ModalContentContainer } from 'uikit/widgets/Popup/SummitPopUp'
import { getNativeTokenSymbol } from 'config/constants'
import { useDepositTreasury } from 'hooks/useExecute'

export const TopUpFundsModal: React.FC<{
  onDismiss?: () => void
}> = ({ onDismiss }) => {
  const userTreasury = useUserTreasury()
  const userTreasuryDisplay = useMemo(() => (userTreasury == null ? '-' : bnDisplay(userTreasury, 18, 4)), [
    userTreasury,
  ])
  const { nativeTokenData } = useNativeTokenFullData()
  const { onDepositTreasury, pending } = useDepositTreasury()

  const [fundingAmount, setFundingAmount] = useState<string>('')
  const [fundingInvalidReason, setFundingInvalidReason] = useState<string | null>(null)

  const handleSetFundingAmount = useCallback((val: string, max: string) => {
    setFundingAmount(val)

    // Test validity
    let invalidReason = null
    if (val === '' || val == null) invalidReason = null
    else if (isNaN(parseFloat(val))) invalidReason = 'Not a number'
    else if (parseFloat(val) <= 0) invalidReason = 'Must be greater than 0'
    else if (parseFloat(val) > parseFloat(max)) invalidReason = 'Insufficient balance'
    setFundingInvalidReason(invalidReason)
  }, [])

  const handleDepositTreasury = useCallback(() => {
    onDepositTreasury(fundingAmount, nativeTokenData?.decimals)
  }, [fundingAmount, nativeTokenData?.decimals, onDepositTreasury])

  return (
    <ModalContentContainer alignItems="flex-start" minWidth="300px" maxWidth="400px" gap="12px">
      <RowBetween>
        <Text small italic>
          Current Funding:
        </Text>
        <Text bold>
          {userTreasuryDisplay} {getNativeTokenSymbol()}
        </Text>
      </RowBetween>

      <br />
      <Text small italic>
        Add Funds:
      </Text>
      <TokenAndAmountSelector
        token={nativeTokenData?.address}
        value={fundingAmount}
        setValue={handleSetFundingAmount}
        invalid={fundingInvalidReason != null}
        tokenSelectDisabled
        isNativeDeposit
      />
      {fundingInvalidReason != null && (
        <Text red italic mt="-12px">
          {fundingInvalidReason}
        </Text>
      )}

      <br />
      <RowCenter gap='18px'>
        <SummitButton onClick={onDismiss} activeText="Close" />
        <SummitButton
          isLoading={pending}
          onClick={handleDepositTreasury}
          activeText="Add Funds"
          loadingText="Adding"
          disabled={fundingInvalidReason != null || fundingAmount === ''}
        />
      </RowCenter>
    </ModalContentContainer>
  )
}

export const TopUpFundsButton: React.FC<{ buttonText?: string }> = ({ buttonText = 'Top Up Funds' }) => {
  const [open, show, hide] = useShowHideModal()
  return (
    <SummitPopUp
      open={open}
      callOnDismiss={hide}
      modal
      button={<SummitButton onClick={show}>{buttonText}</SummitButton>}
      popUpTitle="Top Up Funds"
      popUpContent={<TopUpFundsModal />}
    />
  )
}
