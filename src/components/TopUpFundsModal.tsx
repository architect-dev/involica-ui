import React, { useCallback, useMemo, useState } from 'react'
import { useDcaTxPriceRange, useNativeTokenFullData, useUserTreasury } from 'state/hooks'
import { SummitButton, Text, RowCenter, SummitPopUp } from 'uikit'
import { bn, bnDisplay, useShowHideModal } from 'utils'
import TokenAndAmountSelector from './TokenAndAmountSelector'
import { ModalContentContainer } from 'uikit/widgets/Popup/SummitPopUp'
import { getNativeTokenSymbol } from 'config/constants'
import { useDepositTreasury } from 'hooks/useExecute'
import { DataRow } from './DataRow'
import { validateFundingAmount } from 'state/utils'

export const TopUpFundsModal: React.FC<{
  onDismiss?: () => void
}> = ({ onDismiss }) => {
  const userTreasury = useUserTreasury()
  const userTreasuryDisplay = useMemo(() => (userTreasury == null ? '-' : bnDisplay(userTreasury, 18, 4)), [
    userTreasury,
  ])
  const { nativeTokenData } = useNativeTokenFullData()
  const minGasPrice = '100'
  const { maxGasPrice, minTxPrice, maxTxPrice } = useDcaTxPriceRange(true)

  const maxTxPriceDisplay = useMemo(() => {
    if (maxTxPrice == null || maxTxPrice === '' || maxTxPrice === '0') return '-'
    return bnDisplay(maxTxPrice, 18, 4)
  }, [maxTxPrice])
  const minTxPriceDisplay = useMemo(() => {
    if (minTxPrice == null || minTxPrice === '' || minTxPrice === '0') return '-'
    return bnDisplay(minTxPrice, 18, 4)
  }, [minTxPrice])
  const maxTxPriceDisplayUsd = useMemo(() => {
    if (maxTxPrice == null || maxTxPrice === '' || maxTxPrice === '0' || nativeTokenData?.price == null) return '-'
    return `$${bnDisplay(bn(maxTxPrice).times(nativeTokenData.price), 18, 2)}`
  }, [maxTxPrice, nativeTokenData?.price])
  const minTxPriceDisplayUsd = useMemo(() => {
    if (minTxPrice == null || minTxPrice === '' || minTxPrice === '0' || nativeTokenData?.price == null) return '-'
    return `$${bnDisplay(bn(minTxPrice).times(nativeTokenData.price), 18, 2)}`
  }, [minTxPrice, nativeTokenData?.price])

  const { onDepositTreasury, pending } = useDepositTreasury()

  const [fundingAmount, setFundingAmount] = useState<string>('')
  const [fundingInvalidReason, setFundingInvalidReason] = useState<string | null>(null)

  const handleSetFundingAmount = useCallback((val: string, max: string) => {
    setFundingAmount(val)
    setFundingInvalidReason(validateFundingAmount(val, max, nativeTokenData))
  }, [nativeTokenData])

  const handleDepositTreasury = useCallback(() => {
    onDepositTreasury(fundingAmount, nativeTokenData?.decimals)
  }, [fundingAmount, nativeTokenData?.decimals, onDepositTreasury])

  const topUpCoveredDcasCount = useMemo(() => {
    if (fundingAmount == null || fundingAmount === '' || fundingAmount === '0' || isNaN(parseFloat(fundingAmount)))
      return '-'
    if (maxTxPrice == null || maxTxPrice === '' || maxTxPrice === '0') return '-'
    return Math.floor(parseFloat(fundingAmount) / parseFloat(bnDisplay(maxTxPrice, 18)))
  }, [fundingAmount, maxTxPrice])

  return (
    <ModalContentContainer alignItems="flex-start" minWidth="300px" maxWidth="400px" gap="12px">
      <DataRow t="Current Funding:" v={`${userTreasuryDisplay} ${getNativeTokenSymbol()}`} />
      <br />
      <DataRow
        t={`DCA gas @ ${minGasPrice} gwei${maxGasPrice !== minGasPrice ? ' (min)' : ''}:`}
        v={
          <Text textAlign="right">
            <b>
              {minTxPriceDisplay} {getNativeTokenSymbol()}
            </b>
            <br />
            <i>{minTxPriceDisplayUsd}</i>
          </Text>
        }
      />
      {maxGasPrice !== minGasPrice && (
        <DataRow
          t={`DCA gas @ ${maxGasPrice} gwei (max):`}
          v={
            <Text textAlign="right">
              <b>
                {maxTxPriceDisplay} {getNativeTokenSymbol()}
              </b>
              <br />
              <i>{maxTxPriceDisplayUsd}</i>
            </Text>
          }
        />
      )}

      <br />
      <Text small italic>
        Add Funds:
      </Text>
      <TokenAndAmountSelector
        token={nativeTokenData?.address}
        value={fundingAmount}
        setValue={handleSetFundingAmount}
        invalidReason={fundingInvalidReason}
        tokenSelectDisabled
        isNativeDeposit
      />

      {fundingAmount != null && fundingAmount !== '0' && (
        <DataRow t="DCAs covered by Top Up:" v={topUpCoveredDcasCount} />
      )}

      <br />
      <RowCenter gap="18px">
        <SummitButton onClick={onDismiss} activeText="Close" variant="secondary" />
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
