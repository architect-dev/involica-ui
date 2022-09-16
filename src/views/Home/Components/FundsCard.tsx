import React, { useMemo } from 'react'
import { Card } from 'components/Card'
import { Column, ColumnStart, RowBetween, RowCenter, RowEnd, Text } from 'uikit'
import { CellCol } from './styles'
import { useDcaTxPriceRange, useUserTreasury } from 'state/hooks'
import { getNativeTokenSymbol } from 'config/constants'
import { bn, bnDisplay } from 'utils'
import { TopUpFundsButton } from 'components/TopUpFundsModal'
import { WithdrawFundsButton } from 'components/WithdrawFundsModal'

export const FundsCard: React.FC = () => {
  const userTreasury = useUserTreasury()
  const userTreasuryDisplay = useMemo(() => (userTreasury == null ? '-' : bnDisplay(userTreasury, 18, 4)), [
    userTreasury,
  ])
  const minGasPrice = '100'
  const { maxGasPrice, minTxPrice, maxTxPrice } = useDcaTxPriceRange(true)
  const dcasAtMinGas = useMemo(() => {
    if (minTxPrice == null || userTreasury == null) return '-'
    return Math.floor(bn(userTreasury).div(minTxPrice).toNumber())
  }, [minTxPrice, userTreasury])
  const dcasAtMaxGas = useMemo(() => {
    if (maxTxPrice == null || userTreasury == null) return '-'
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
          <RowBetween>
            <Text small italic>
              Current Funding:
            </Text>
            <Text bold color={errorColor}>
              {userTreasuryDisplay} {getNativeTokenSymbol()}
            </Text>
          </RowBetween>
          <Column width="100%">
            <RowBetween>
              <Text small italic>
                DCAs covered (est):
              </Text>
              <Text bold color={errorColor}>
                {dcasAtMinGas} DCAs ({minGasPrice} gwei)
              </Text>
            </RowBetween>
            {maxGasPrice !== minGasPrice && (
              <RowEnd>
                <Text bold textAlign="right" color={errorColor}>
                  {dcasAtMaxGas} DCAs ({maxGasPrice} gwei)
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
