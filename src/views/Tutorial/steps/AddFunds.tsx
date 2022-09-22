import React, { useMemo } from 'react'
import { Column, Text } from 'uikit'
import { getNativeTokenSymbol } from 'config/constants'
import { bnDisplay } from 'utils'
import MaxGasPriceSelector from './MaxGasPriceSelector'
import styled from 'styled-components'
import { useConfigurableFundingAmount, useDcaTxPriceRange, useNativeTokenFullData } from 'state/hooks'
import { MaxGasPriceOptions } from 'state/types'
import TokenAndAmountSelector from 'components/TokenAndAmountSelector'

const IntroText = styled(Text)`
  max-width: 500px;
`

export const AddFunds: React.FC = () => {
  const { nativeTokenData } = useNativeTokenFullData()
  const { fundingAmount, fundingInvalidReason, setFundingAmount } = useConfigurableFundingAmount()
  const { minTxPrice, maxTxPrice, maxGasPrice } = useDcaTxPriceRange()
  const minGasPrice: MaxGasPriceOptions = '100'

  const maxTxPriceDisplay = useMemo(() => {
    if (maxTxPrice == null || maxTxPrice === '' || maxTxPrice === '0') return '-'
    return bnDisplay(maxTxPrice, 18, 4)
  }, [maxTxPrice])
  const minTxPriceDisplay = useMemo(() => {
    if (minTxPrice == null || minTxPrice === '' || minTxPrice === '0') return '-'
    return bnDisplay(minTxPrice, 18, 4)
  }, [minTxPrice])

  return (
    <>
      <IntroText small>
        Funds are only used to pay for the gas of each DCA transaction, and can be removed at any time.
        <br />
        <br />
        <i>
          Deposit <b>{getNativeTokenSymbol()}</b> below to fund your account.
          <br />
          (10 FTM should cover you for a while)
        </i>
      </IntroText>
      <TokenAndAmountSelector
        token={nativeTokenData?.address}
        value={fundingAmount}
        setValue={setFundingAmount}
        invalidReason={fundingAmount === '' ? null : fundingInvalidReason}
        tokenSelectDisabled
        isNativeDeposit
      />
      <br />
      <Column alignItems="flex-start">
        <Text small italic mb="4px">
          Minimum Gas Price is hard coded by Gelato to be 100 gwei
          <br />
          <Text small italic bold>
            Min DCA execution price: {minTxPriceDisplay ?? '-'} FTM (@{' '}
            {minGasPrice !== null ? Number(minGasPrice).toFixed(0) : '-'} gwei)
          </Text>
          <br />
          <br />
          OPTIONAL: Select max DCA gas price:
          <br />
          (DCA execution will wait until gas price {'<='} max)
        </Text>
        <MaxGasPriceSelector />
        <br />

        {maxGasPrice !== '100' && (
          <Text small italic bold>
            Max DCA execution price: {maxTxPriceDisplay ?? '-'} FTM (@{' '}
            {maxGasPrice !== null ? Number(maxGasPrice).toFixed(0) : '-'} gwei)
          </Text>
        )}
      </Column>
    </>
  )
}
