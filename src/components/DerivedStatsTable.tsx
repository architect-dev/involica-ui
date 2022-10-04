import { orderBy } from 'lodash'
import React, { useMemo } from 'react'
import { useUserLifetimeStats } from 'state/statsHooks'
import { Column, Text } from 'uikit'
import { CellCol, CellRow } from 'views/Home/Components/styles'
import { DataRow } from './DataRow'
import { PerfIndicator } from './DataVis/PerfIndicator'
import { TokenPerfTable } from './DataVis/TokenPerfTable'

export const DerivedStatsTable: React.FC = () => {
  const lifetimeStats = useUserLifetimeStats()

  const sortedInTokens = useMemo(() => {
    return orderBy(Object.values(lifetimeStats?.inTokens ?? []), ['tradeAmountUsd'], ['desc'])
  }, [lifetimeStats?.inTokens])
  const sortedOutTokens = useMemo(() => {
    return orderBy(Object.values(lifetimeStats?.outTokens ?? []), ['tradeAmountUsd'], ['desc'])
  }, [lifetimeStats?.outTokens])

  return (
    <CellRow>
      <CellCol>
        <Column width="100%">
          <DataRow px="6px" t="Total Buy In:" v={lifetimeStats?.totalInTrade?.usdDisplay} />
        </Column>
        <Column width="100%">
          <DataRow px="6px" t="Current Portfolio Value:" v={lifetimeStats?.totalOutFull?.current?.usdDisplay} />
        </Column>
        <DataRow
          px="6px"
          t="Total PnL:"
          v={
            <PerfIndicator
              status={lifetimeStats?.totalValueChange?.status}
              usdDisplay={lifetimeStats?.totalValueChange?.usdDisplay}
              percDisplay={lifetimeStats?.totalValueChange?.percDisplay}
              gap='6px'
            />
          }
        />
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
