import React, { useCallback, useMemo } from 'react'
import { Column, Text } from 'uikit'
import TokenInput from 'components/TokenInput'
import { getNativeTokenSymbol } from 'config/constants'
import { bnDisplay } from 'utils'
import MaxGasPriceSelector from './MaxGasPriceSelector'
import styled from 'styled-components'
import { useConfigurableFundingAmount, useNativeTokenFullData, usePositionMaxGasPrice, usePositionOuts } from 'state/hooks'
import { MaxGasPriceOptions } from 'state/types'

const baseGasPrice = 450000
const perSwapGasPrice = 195000

const IntroText = styled(Text)`
  max-width: 500px;
`

export const AddFunds: React.FC = () => {
  const { nativeTokenData, nativeTokenUserData } = useNativeTokenFullData()
  const { fundingAmount, fundingInvalidReason, setFundingAmount } = useConfigurableFundingAmount()
  const { outs } = usePositionOuts()
  
  const { maxGasPrice } = usePositionMaxGasPrice()
  const minGasPrice: MaxGasPriceOptions = '100'

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
    () => bnDisplay(nativeTokenUserData?.balance, nativeTokenData?.decimals),
    [nativeTokenData?.decimals, nativeTokenUserData?.balance],
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
    <>
      <IntroText small>
        Funds are only used to pay for the gas of each DCA transaction,
        and can be removed at any time.
        <br />
        <br />
        <i>
          Deposit <b>{getNativeTokenSymbol()}</b> below to fund your account.
          <br />
          (10 FTM should cover you for a while)
        </i>
      </IntroText>
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
    </>
  )
}