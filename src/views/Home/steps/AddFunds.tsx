import React, { useCallback, useMemo, useState } from 'react'
import { StepContentWrapper } from './StepContentWrapper'
import { SummitButton, Text } from 'uikit'
import TokenInput from 'components/TokenInput'
import { getNativeTokenSymbol } from 'config/constants'
import { isNumber } from 'lodash'
import { useInvolicaStore } from 'state/zustand'
import { bn, bnDisplay } from 'utils'
import { useDepositTreasury } from 'hooks/useExecute'
import { IntroStep, useIntroActiveStep } from './introStore'

export const AddFundsStep: React.FC = () => {
  const introStep = useIntroActiveStep()
  const expanded = introStep >= IntroStep.Treasury
  const userTreasury = useInvolicaStore((state) => state.userData?.userTreasury)
  const userNativeToken = useInvolicaStore(
    (state) => state.userData?.userNativeTokenData,
  )
  const nativeToken = useInvolicaStore((state) => state.nativeToken)
  const { onDepositTreasury, pending } = useDepositTreasury()

  const [val, setVal] = useState<string>('10')
  const treasury = useMemo(
    () => bnDisplay(userTreasury, nativeToken?.decimals),
    [nativeToken?.decimals, userTreasury],
  )
  const fullBalance = useMemo(
    () => bnDisplay(userNativeToken?.balance, nativeToken?.decimals),
    [nativeToken?.decimals, userNativeToken?.balance],
  )

  const treasuryUsd = useMemo(() => {
    if (treasury == null || nativeToken?.price == null) return null
    return bn(treasury).times(nativeToken.price).toFixed(2)
  }, [nativeToken?.price, treasury])

  const validVal = useMemo(
    () =>
      isNumber(parseFloat(val)) &&
      parseFloat(val) > 0 &&
      parseFloat(val) <= parseFloat(fullBalance),
    [fullBalance, val],
  )

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
    },
    [setVal],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [setVal, fullBalance])

  const handleDepositTreasury = useCallback(
    () => onDepositTreasury(val, nativeToken?.decimals),
    [nativeToken?.decimals, onDepositTreasury, val],
  )

  const collapsedContent = useMemo(
    () => (
      <Text>
        Funds:{' '}
        <b>
          {treasury} FTM (${treasuryUsd})
        </b>
      </Text>
    ),
    [treasury, treasuryUsd],
  )

  return (
    <StepContentWrapper expanded={expanded}>
      <Text small>
        Funds are only used to pay for the gas of each DCA transaction,
        <br />
        and can be removed at any time.
        <br />
        <br />
        <i>
          Deposit <b>{getNativeTokenSymbol()}</b> below to fund your account.
          <br />
          (10 FTM should cover you for a while)
        </i>
      </Text>
      <TokenInput
        symbol={getNativeTokenSymbol()}
        balanceText="Wallet Balance"
        onChange={handleChange}
        onSelectMax={handleSelectMax}
        value={val}
        max={fullBalance}
        invalid={!validVal && val !== ''}
      />
      <SummitButton
        disabled={!validVal}
        isLoading={pending}
        onClick={handleDepositTreasury}
        activeText="Add Funds"
        loadingText="Adding"
      />
      <br />
      {collapsedContent}
    </StepContentWrapper>
  )
}
