import { orderBy } from 'lodash'
import { transparentize } from 'polished'
import React, { useCallback, useMemo } from 'react'
import { useUserLifetimeStats } from 'state/statsHooks'
import styled, { css } from 'styled-components'
import { Column, Text } from 'uikit'
import { pressableMixin } from 'uikit/util/styledMixins'
import { CellCol, CellRow } from 'views/Home/Components/styles'
import { ChartDataOption, useChartOptionsState } from 'views/Stats/components/chartOptionsState'
import { Card } from './Card'
import { DataRow } from './DataRow'
import { PerfIndicator } from './DataVis/PerfIndicator'
import { TokenPerfTable } from './DataVis/TokenPerfTable'

const ClickableCol = styled.div<{ highlighted?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;

  .row {
    height: 48px;
  }

  ${({ theme, highlighted }) =>
    highlighted &&
    css`
      outline: 1px solid ${theme.colors.text};
      outline-offset: -1px;
    `}

  ${({ theme }) =>
    pressableMixin({
      theme,
      hoverStyles: css`
        background-color: ${transparentize(0.85, theme.colors.text)} !important;
      `,
    })};
`

export const DerivedStatsTable: React.FC = () => {
  const lifetimeStats = useUserLifetimeStats()
  const { dataOption, setDataOption, focusedToken, setFocusedToken, dcasCountChart, setDcasCountChart } = useChartOptionsState()

  const sortedInTokens = useMemo(() => {
    return orderBy(Object.values(lifetimeStats?.inTokens ?? []), ['trade.usd'], ['desc'])
  }, [lifetimeStats?.inTokens])
  const sortedOutTokens = useMemo(() => {
    return orderBy(Object.values(lifetimeStats?.outTokens ?? []), ['trade.usd'], ['desc'])
  }, [lifetimeStats?.outTokens])

  const userTotalPerformanceSelected = useMemo(() => {
    return dataOption === ChartDataOption.User && focusedToken == null && dcasCountChart === false
  }, [dataOption, dcasCountChart, focusedToken])
  const handleShowUserTotalPerformance = useCallback(() => {
    setFocusedToken(null)
    setDcasCountChart(ChartDataOption.User, false)
  }, [setDcasCountChart, setFocusedToken])

  const userDcasCountChartSelected = useMemo(() => {
    return dcasCountChart && dataOption === ChartDataOption.User && focusedToken == null
  }, [dcasCountChart, dataOption, focusedToken])
  const handleToggleUserDcasChart = useCallback(() => {
    if (userDcasCountChartSelected) {
      setDcasCountChart(ChartDataOption.User, false)
    } else {
      setDcasCountChart(ChartDataOption.User, true)
    }
  }, [setDcasCountChart, userDcasCountChartSelected])

  const handleSetFocusedToken = useCallback((token: string) => {
    setDataOption(ChartDataOption.User)
    setFocusedToken(token)
  }, [setDataOption, setFocusedToken])

  return (
    <Card title="Portfolio Stats" padding="24px">
      <CellRow>
        <CellCol>
          <ClickableCol highlighted={userTotalPerformanceSelected} onClick={handleShowUserTotalPerformance}>
            <DataRow
              className="row"
              px="6px"
              t="Current Portfolio Value:"
              v={lifetimeStats?.totalOutFull?.current?.usdDisplay}
            />
            <DataRow className="row" px="6px" t="Total Buy In:" v={lifetimeStats?.totalOutFull?.trade?.usdDisplay} />
            <DataRow
              className="row"
              px="6px"
              t="Total PnL:"
              v={<PerfIndicator {...lifetimeStats?.totalValueChange} gap="6px" />}
            />
          </ClickableCol>
          <ClickableCol highlighted={userDcasCountChartSelected} onClick={handleToggleUserDcasChart}>
            <DataRow className="row" px="6px" t="Number of DCAs:" v={lifetimeStats?.dcasCount} />
          </ClickableCol>
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
              <br />
              <b>(Select a token to refine the chart above)</b>
            </Text>
            <TokenPerfTable
              tokensOut={sortedOutTokens}
              isAggregate
              highlightedTokens={[focusedToken]}
              onTokenOutClick={handleSetFocusedToken}
            />
          </Column>
        </CellCol>
      </CellRow>
    </Card>
  )
}
