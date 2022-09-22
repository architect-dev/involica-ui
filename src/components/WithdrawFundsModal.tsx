import React, { useCallback, useMemo, useState } from 'react'
import { useNativeTokenFullData, useUserTreasury } from 'state/hooks'
import { SummitButton, Text, RowBetween, RowCenter, SummitPopUp } from 'uikit'
import { bnDisplay, useShowHideModal } from 'utils'
import TokenAndAmountSelector from './TokenAndAmountSelector'
import { ModalContentContainer } from 'uikit/widgets/Popup/SummitPopUp'
import { getNativeTokenSymbol } from 'config/constants'
import { useWithdrawTreasury } from 'hooks/useExecute'

export const WithdrawFundsModal: React.FC<{
  onDismiss?: () => void
}> = ({ onDismiss }) => {
  const userTreasury = useUserTreasury()
  const userTreasuryDisplay = useMemo(() => (userTreasury == null ? '-' : bnDisplay(userTreasury, 18, 4)), [
    userTreasury,
  ])
  const { nativeTokenData } = useNativeTokenFullData()
  const { onWithdrawTreasury, pending } = useWithdrawTreasury()

  const [withdrawAmount, setWithdrawAmount] = useState<string>('')
  const [withdrawInvalidReason, setWithdrawInvalidReason] = useState<string | null>(null)

  const handleSetFundingAmount = useCallback((val: string, max: string) => {
    setWithdrawAmount(val)

    // Test validity
    let invalidReason = null
    if (val === '' || val == null) invalidReason = null
    else if (isNaN(parseFloat(val))) invalidReason = 'Not a number'
    else if (parseFloat(val) <= 0) invalidReason = 'Must be greater than 0'
    else if (parseFloat(val) > parseFloat(max)) invalidReason = 'Insufficient funding'
    setWithdrawInvalidReason(invalidReason)
  }, [])

  const handleWithdrawTreasury = useCallback(() => {
    onWithdrawTreasury(withdrawAmount, nativeTokenData?.decimals)
  }, [withdrawAmount, nativeTokenData?.decimals, onWithdrawTreasury])

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
        Withdraw Funds:
      </Text>
      <TokenAndAmountSelector
        token={nativeTokenData?.address}
        value={withdrawAmount}
        setValue={handleSetFundingAmount}
        invalidReason={withdrawInvalidReason}
        max={userTreasuryDisplay}
        balanceText='Current Funding'
        tokenSelectDisabled
      />

      <SummitButton
        isLoading={pending}
        onClick={handleWithdrawTreasury}
        activeText="Withdraw Funds"
        loadingText="Withdrawing"
        disabled={withdrawInvalidReason != null || withdrawAmount === ''}
      />

      <br />
      <br />
      <RowCenter>
        <SummitButton onClick={onDismiss} activeText="Close" />
      </RowCenter>
    </ModalContentContainer>
  )
}

export const WithdrawFundsButton: React.FC<{ buttonText?: string }> = ({ buttonText = 'Withdraw Funds'}) => {
  const [open, show, hide] = useShowHideModal()
  return (
    <SummitPopUp
      open={open}
      callOnDismiss={hide}
      modal
      button={<SummitButton onClick={show}>{buttonText}</SummitButton>}
      popUpTitle="Withdraw Funds"
      popUpContent={<WithdrawFundsModal />}
    />
  )
}
