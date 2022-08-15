import React, { useCallback, useMemo, useState } from 'react'
import { StepContentWrapper } from './StepContentWrapper'
import { Column, SummitButton, Text } from 'uikit'
import TokenInput from 'components/TokenInput'
import { getNativeTokenSymbol } from 'config/constants'
import { isNumber } from 'lodash'
import { useInvolicaStore } from 'state/zustand'
import { bn, bnDisplay } from 'utils'
import { useDepositTreasury } from 'hooks/useExecute'
import {
  IntroStep,
  useIntroActiveStep,
  usePositionConfigState,
} from './introStore'
import { useGasPrice } from 'utils/gasPrice'
import MaxGasPriceSelector from './MaxGasPriceSelector'

const baseGasPrice = 450000
const perSwapGasPrice = 195000

export const AddFundsStep: React.FC = () => {
  const introStep = useIntroActiveStep()
  const expanded = introStep >= IntroStep.Treasury
  const userTreasury = useInvolicaStore((state) => state.userData?.userTreasury)
  const userNativeToken = useInvolicaStore(
    (state) => state.userData?.userNativeTokenData,
  )
  const nativeToken = useInvolicaStore((state) => state.nativeToken)
  const outs = usePositionConfigState((state) => state.outs)
  const { onDepositTreasury, pending } = useDepositTreasury()
  const gas = useGasPrice()
  console.log({
    gas,
  })
  const txPrice = useMemo(() => {
    if (gas == null) return null
    return bnDisplay(
      (baseGasPrice + outs.length * perSwapGasPrice) * parseFloat(gas),
      9,
      4,
    )
  }, [gas, outs.length])
  const [maxGas, setMaxGas] = useState<'5' | '15' | '50'>('50')
  const maxTxPrice = useMemo(() => {
    if (maxGas == null) return null
    return bnDisplay(
      (baseGasPrice + outs.length * perSwapGasPrice) * parseFloat(maxGas),
      9,
      4,
    )
  }, [maxGas, outs.length])

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
      <Text>
        Funds:{' '}
        <b>
          {treasury} FTM (${treasuryUsd})
        </b>
      </Text>
      <Column alignItems='flex-start'>
        <Text small italic>
          Select max DCA gas price:
          <br/>
          (Will not execute DCA if gas price {'>'} max)
        </Text>
        <MaxGasPriceSelector maxGas={maxGas} setMaxGas={setMaxGas} />
        <br/>

        {txPrice != null && (
          <Text small italic>
            Estimated DCA gas price: {txPrice} FTM (@ {Number(gas).toFixed(1)}{' '}
            gwei)
          </Text>
        )}
        {maxTxPrice != null && (
          <Text small italic>
            Max DCA gas price: {maxTxPrice} FTM (@ {Number(maxGas).toFixed(1)}{' '}
            gwei)
          </Text>
        )}
      </Column>
    </StepContentWrapper>
  )
}
