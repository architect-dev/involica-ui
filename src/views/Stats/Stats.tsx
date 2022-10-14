import React from 'react'
import { Column } from 'uikit'
import Page from 'components/layout/Page'
import 'chartjs-adapter-date-fns'
import PortfolioChart from './components/PortfolioChart'
import { ChartOptionsRow } from './components/ChartOptionsRow'
import { DerivedStatsTable } from 'components/DerivedStatsTable'
import { PastDcasTable } from 'components/PastDcasTable'
import { InvolicaStatsTable } from 'components/InvolicaStatsTable'
import { StoneHeader } from 'components/StoneHeader'

const Stats: React.FC = () => {
  return (
    <Page>
      <StoneHeader />
      <Column width="100%" gap="24px">
        <ChartOptionsRow />
        <PortfolioChart />
        <InvolicaStatsTable />
        <DerivedStatsTable />
        <PastDcasTable />
      </Column>
    </Page>
  )
}

export default Stats
