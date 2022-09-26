import { orderBy } from 'lodash'
import React, { useMemo } from 'react'
import { InvValueChangeStatusColor, ValueChangeStatus, ValueChangeStatusColor } from 'state/status'
import { DerivedTxsStats } from 'state/uiHooks'
import { Column, Text } from 'uikit'
import { CellCol, CellRow } from 'views/Home/Components/styles'
import { DataRow } from './DataRow'
import { PerfIndicator } from './DataVis/PerfIndicator'
import { TokenPerfTable } from './DataVis/TokenPerfTable'

interface Props {
  derived: DerivedTxsStats
}

export const DerivedStatsTable: React.FC<Props> = ({ derived }) => {
  const {
    totalTradeInAmountUsdDisplay,
    totalCurrentInAmountUsdDisplay,
    totalTradeOutAmountUsdDisplay,
    totalCurrentOutAmountUsdDisplay,
    totalValueChangeStatus,
    totalValueChangeUsdDisplay,
    totalValueChangePercDisplay,

    inTokens,
    outTokens,
  } = derived

  const sortedInTokens = useMemo(() => {
    return orderBy(Object.values(inTokens), ['tradeAmountUsd'], ['desc'])
  }, [inTokens])
  const sortedOutTokens = useMemo(() => {
    return orderBy(Object.values(outTokens), ['tradeAmountUsd'], ['desc'])
  }, [outTokens])

  const tradeInStatus = useMemo(() => {
    if (totalTradeInAmountUsdDisplay === totalCurrentInAmountUsdDisplay) return ValueChangeStatus.Neutral
    if (parseFloat(totalTradeInAmountUsdDisplay) < parseFloat(totalCurrentInAmountUsdDisplay))
      return ValueChangeStatus.Positive
    return ValueChangeStatus.Negative
  }, [totalTradeInAmountUsdDisplay, totalCurrentInAmountUsdDisplay])
  const tradeOutStatus = useMemo(() => {
    if (totalTradeOutAmountUsdDisplay === totalCurrentOutAmountUsdDisplay) return ValueChangeStatus.Neutral
    if (parseFloat(totalTradeOutAmountUsdDisplay) < parseFloat(totalCurrentOutAmountUsdDisplay))
      return ValueChangeStatus.Positive
    return ValueChangeStatus.Negative
  }, [totalTradeOutAmountUsdDisplay, totalCurrentOutAmountUsdDisplay])

  return (
    <CellRow>
      <CellCol>
        <DataRow
          px="6px"
          t="Total PnL:"
          v={
            <PerfIndicator
              status={totalValueChangeStatus}
              usdDisplay={totalValueChangeUsdDisplay}
              percDisplay={totalValueChangePercDisplay}
              gap='6px'
            />
          }
        />
        <Column width="100%">
          <DataRow px="6px" t="Combined DCAs Sell:" v={totalTradeInAmountUsdDisplay} />
          <DataRow
            px="6px"
            t={
              <Text small italic color={InvValueChangeStatusColor[tradeInStatus]}>
                Current Value:
              </Text>
            }
            v={
              <Text small color={InvValueChangeStatusColor[tradeInStatus]}>
                {totalCurrentInAmountUsdDisplay}
              </Text>
            }
          />
        </Column>
        <Column width="100%">
          <DataRow px="6px" t="Combined DCAs Buy:" v={totalTradeOutAmountUsdDisplay} />
          <DataRow
            px="6px"
            t={
              <Text small italic color={ValueChangeStatusColor[tradeOutStatus]}>
                Current Value:
              </Text>
            }
            v={
              <Text small color={ValueChangeStatusColor[tradeOutStatus]}>
                {totalCurrentOutAmountUsdDisplay}
              </Text>
            }
          />
        </Column>
        <Column width="100%" gap="4px">
          <Text small italic pl="6px">
            Combined DCAs Sell Token Data:
          </Text>
          <TokenPerfTable tokensIn={sortedInTokens} isAggregate />
        </Column>
      </CellCol>
      <CellCol>
        <Column width="100%" gap="4px">
          <Text small italic pl="6px">
            Combined DCAs Buy Token Data:
          </Text>
          <TokenPerfTable tokensOut={sortedOutTokens} isAggregate />
        </Column>
      </CellCol>
    </CellRow>
  )
}
