import React, { useCallback, useMemo } from 'react'
import { StepContentWrapper } from './StepContentWrapper'
import { Column, Text } from 'uikit'
import TokenInput from 'components/TokenInput'
import { getNativeTokenSymbol } from 'config/constants'
import { useInvolicaStore } from 'state/zustand'
import { bnDisplay } from 'utils'
import {
  IntroStep,
  useIntroActiveStep,
  usePositionConfigState,
} from './introStore'
import MaxGasPriceSelector from './MaxGasPriceSelector'

const baseGasPrice = 450000
const perSwapGasPrice = 195000

export const AddFunds: React.FC = () => {
  const introStep = useIntroActiveStep()
  const expanded = introStep >= IntroStep.Treasury
  const nativeToken = useInvolicaStore((state) => state.nativeToken)
  const userNativeToken = useInvolicaStore(
    (state) => state.userData?.userNativeTokenData,
  )
  const fundingAmount = usePositionConfigState((state) => state.fundingAmount)
  const fundingInvalidReason = usePositionConfigState(
    (state) => state.fundingInvalidReason,
  )
  const setFundingAmount = usePositionConfigState(
    (state) => state.setFundingAmount,
  )
  const outs = usePositionConfigState((state) => state.outs)
  const minGasPrice = '100'
  const maxGasPrice = usePositionConfigState((state) => state.maxGasPrice)

  const minTxPrice = useMemo(() => {
    return bnDisplay(
      (baseGasPrice + outs.length * perSwapGasPrice) * parseFloat(minGasPrice),
      9,
      4,
    )
  }, [minGasPrice, outs.length])

  const maxTxPrice = useMemo(() => {
    if (maxGasPrice == null) return null
    return bnDisplay(
      (baseGasPrice + outs.length * perSwapGasPrice) * parseFloat(maxGasPrice),
      9,
      4,
    )
  }, [maxGasPrice, outs.length])

  const fullBalance = useMemo(
    () => bnDisplay(userNativeToken?.balance, nativeToken?.decimals),
    [nativeToken?.decimals, userNativeToken?.balance],
  )

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setFundingAmount(e.currentTarget.value, fullBalance)
    },
    [fullBalance, setFundingAmount],
  )

  const handleSelectPreset = useCallback(
    () => setFundingAmount('10', fullBalance),
    [fullBalance, setFundingAmount],
  )

  const handleSelectMax = useCallback(() => {
    setFundingAmount(fullBalance, fullBalance)
  }, [setFundingAmount, fullBalance])

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
        onSelectPreset={handleSelectPreset}
        presetValue="10"
        onSelectMax={handleSelectMax}
        value={fundingAmount}
        max={fullBalance}
        invalid={fundingInvalidReason != null && fundingAmount !== ''}
      />
      {fundingInvalidReason != null && (
        <Text red italic mt="-12px">
          {fundingInvalidReason}
        </Text>
      )}
      <br />
      <Column alignItems="flex-start">
        <Text small italic mb="4px">
          Minimum Gas Price is hard coded by Gelato to be 100 gwei
          <br />
          <Text small italic bold>
            Min DCA execution price: {minTxPrice ?? '-'} FTM (@{' '}
            {minGasPrice !== null ? Number(minGasPrice).toFixed(0) : '-'} gwei)
          </Text>
          <br />
          <br />
          OPTIONAL: Select max DCA gas price:
          <br />
          (Will wait to execute DCA until gas price {'<='} max)
        </Text>
        <MaxGasPriceSelector />
        <br />

        {maxGasPrice !== '100' && (
          <Text small italic bold>
            Max DCA execution price: {maxTxPrice ?? '-'} FTM (@{' '}
            {maxGasPrice !== null ? Number(maxGasPrice).toFixed(0) : '-'} gwei)
          </Text>
        )}
      </Column>
    </StepContentWrapper>
  )
}
