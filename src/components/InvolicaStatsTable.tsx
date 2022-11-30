import { transparentize } from 'polished'
import React, { useCallback, useMemo } from 'react'
import { useInvolicaLifetimeStats } from 'state/statsHooks'
import styled, { css } from 'styled-components'
import { Text } from 'uikit'
import { pressableMixin } from 'uikit/util/styledMixins'
import { CellCol, CellRow } from 'views/Home/Components/styles'
import { ChartDataOption, useChartOptionsState } from 'views/Stats/components/chartOptionsState'
import { Card } from './Card'
import { DataRow } from '../uikit/components/DataRow'
import { PerfIndicator } from './DataVis/PerfIndicator'

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

export const InvolicaStatsTable: React.FC = () => {
  const involicaStats = useInvolicaLifetimeStats()
  const { dataOption, dcasCountChart, setDcasCountChart } = useChartOptionsState()

  const userTotalPerformanceSelected = useMemo(() => {
    return dataOption === ChartDataOption.Involica && dcasCountChart === false
  }, [dataOption, dcasCountChart])
  const handleShowUserTotalPerformance = useCallback(() => {
    setDcasCountChart(ChartDataOption.Involica, false)
  }, [setDcasCountChart])

  const involicaDcasCountChartSelected = useMemo(() => {
    return dcasCountChart && dataOption === ChartDataOption.Involica
  }, [dcasCountChart, dataOption])
  const handleToggleInvolicaDcasChart = useCallback(() => {
    if (involicaDcasCountChartSelected) {
      setDcasCountChart(ChartDataOption.Involica, false)
    } else {
      setDcasCountChart(ChartDataOption.Involica, true)
    }
  }, [setDcasCountChart, involicaDcasCountChartSelected])

  if (dataOption !== ChartDataOption.Involica) return null

  return (
    <Card title="Involica Stats" padding="24px">
      <CellRow>
        <CellCol>
          <Text small italic>Involica and all her combined users' stats:</Text>
          <ClickableCol highlighted={involicaDcasCountChartSelected} onClick={handleToggleInvolicaDcasChart}>
            <DataRow className="row" px="6px" t="Number of DCAs:" v={involicaStats?.dcasCount} />
            <DataRow className="row" px="6px" t="Number of Users:" v={involicaStats?.userCount} />
          </ClickableCol>
        </CellCol>
        <CellCol>
          <ClickableCol highlighted={userTotalPerformanceSelected} onClick={handleShowUserTotalPerformance}>
            <DataRow className="row" px="6px" t="Total Involica Buy In:" v={involicaStats?.totalOutFull?.trade?.usdDisplay} />
            <DataRow
              className="row"
              px="6px"
              t="Current Users Value:"
              v={involicaStats?.totalOutFull?.current?.usdDisplay}
            />
            <DataRow
              className="row"
              px="6px"
              t="Total PnL of Involica:"
              v={<PerfIndicator {...involicaStats?.totalValueChange} gap="6px" />}
            />
          </ClickableCol>
        </CellCol>
      </CellRow>
    </Card>
  )
}
