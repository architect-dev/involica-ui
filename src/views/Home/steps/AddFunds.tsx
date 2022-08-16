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
import { useGasPrice } from 'utils/gasPrice'
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
  const fundingInvalidReason = usePositionConfigState((state) => state.fundingInvalidReason)
  const setFundingAmount = usePositionConfigState((state) => state.setFundingAmount)
  const outs = usePositionConfigState((state) => state.outs)
  const maxGasPrice = usePositionConfigState((state) => state.maxGasPrice)
  const gas = useGasPrice()

  const txPrice = useMemo(() => {
    if (gas == null) return null
    return bnDisplay(
      (baseGasPrice + outs.length * perSwapGasPrice) * parseFloat(gas),
      9,
      4,
    )
  }, [gas, outs.length])

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
    [fullBalance, setFundingAmount]
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
          Set how much <b>{getNativeTokenSymbol()}</b> to fund below.
          <br />
          (10 FTM should cover you for a while)
        </i>
      </Text>
      <TokenInput
        symbol={getNativeTokenSymbol()}
        balanceText="Wallet Balance"
        onChange={handleChange}
        onSelectPreset={handleSelectPreset}
        presetValue='10'
        onSelectMax={handleSelectMax}
        value={fundingAmount}
        max={fullBalance}
        invalid={fundingInvalidReason != null && fundingAmount !== ''}
      />
      { fundingInvalidReason != null && <Text red italic mt='-12px'>{fundingInvalidReason}</Text>}
      <br />
      <Column alignItems='flex-start'>
        <Text small italic mb='4px'>
          Select max DCA gas price:
          <br/>
          (Will wait to execute DCA until gas price {'<'} max)
        </Text>
        <MaxGasPriceSelector />
        <br/>

        {txPrice != null && (
          <Text small italic>
            Estimated DCA gas price: {txPrice} FTM (@ {Number(gas).toFixed(1)}{' '}
            gwei)
          </Text>
        )}
        {maxTxPrice != null && (
          <Text small italic>
            Max DCA gas price: {maxTxPrice} FTM (@ {Number(maxGasPrice).toFixed(1)}{' '}
            gwei)
          </Text>
        )}
      </Column>
    </StepContentWrapper>
  )
}
