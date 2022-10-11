import React, { useMemo } from 'react'
import { Card } from 'components/Card'
import { Column, ColumnStart, RowCenter, RowEnd, Text } from 'uikit'
import { CellCol } from './styles'
import { useDcaTxPriceRange, useNativeTokenPublicData, useUserTreasury } from 'state/hooks'
import { getNativeTokenSymbol } from 'config/constants'
import { bn, bnDisplay } from 'utils'
import { TopUpFundsButton } from 'components/TopUpFundsModal'
import { WithdrawFundsButton } from 'components/WithdrawFundsModal'
import { DataRow } from 'components/DataRow'

export const FundsCard: React.FC = () => {
  const { nativeTokenData } = useNativeTokenPublicData()
  const userTreasury = useUserTreasury()
  const userTreasuryDisplay = useMemo(() => (userTreasury == null ? '-' : bnDisplay(userTreasury, 18, 4)), [
    userTreasury,
  ])
  const userTreasuryUsdDisplay = useMemo(() => {
    if (userTreasury == null || nativeTokenData?.price == null) return '-'
    return `$${bnDisplay(bn(userTreasury).times(nativeTokenData.price), 18, 2)}`
  }, [nativeTokenData?.price, userTreasury])
  const minGasPrice = '100'
  const { maxGasPrice, minTxPrice, maxTxPrice } = useDcaTxPriceRange(true)
  const dcasAtMinGas = useMemo(() => {
    if (minTxPrice == null || userTreasury == null) return '-'
    return Math.floor(bn(userTreasury).div(minTxPrice).toNumber())
  }, [minTxPrice, userTreasury])
  const dcasAtMaxGas = useMemo(() => {
    if (maxTxPrice == null || userTreasury == null) return '-'
    if (bn(userTreasury).eq(0)) return 0
    return Math.floor(bn(userTreasury).div(maxTxPrice).toNumber())
  }, [maxTxPrice, userTreasury])

  const gasPriceWarning = useMemo(() => dcasAtMaxGas === 0, [dcasAtMaxGas])
  const gasPriceError = useMemo(() => dcasAtMinGas === 0, [dcasAtMinGas])
  const errorColor = useMemo(() => (gasPriceError ? 'failure' : gasPriceWarning ? 'warning' : 'text'), [
    gasPriceError,
    gasPriceWarning,
  ])

  return (
    <Card title="Funds" padding="24px" halfWidth>
      <CellCol>
        <ColumnStart gap="inherit" width="100%">
          <DataRow
            t="Current Funding:"
            i="Test test test test"
            v={
              <Text color={errorColor} textAlign='right'>
                <b>{userTreasuryDisplay} {getNativeTokenSymbol()}</b>
                <br/>
                <i>{userTreasuryUsdDisplay}</i>
              </Text>
            }
          />
          <Column width="100%">
            <DataRow
              t="DCAs covered (est):"
              v={
                <Text bold color={errorColor}>
                  {dcasAtMinGas} DCAs (@ {minGasPrice} gwei)
                </Text>
              }
            />
            {maxGasPrice !== minGasPrice && (
              <RowEnd>
                <Text bold textAlign="right" color={errorColor}>
                  {dcasAtMaxGas} DCAs (@ {maxGasPrice} gwei)
                </Text>
              </RowEnd>
            )}
          </Column>
        </ColumnStart>
        <RowCenter gap="18px">
          <WithdrawFundsButton buttonText="Withdraw" />
          <TopUpFundsButton buttonText="Top Up" />
        </RowCenter>
      </CellCol>
    </Card>
  )
}
