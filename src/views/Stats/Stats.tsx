import React from 'react'
import styled from 'styled-components'
import { Column, HighlightedText } from 'uikit'
import Page from 'components/layout/Page'
import 'chartjs-adapter-date-fns'
import PortfolioChart from './components/PortfolioChart'
import { ChartOptionsRow } from './components/ChartOptionsRow'
import { DerivedStatsTable } from 'components/DerivedStatsTable'
import { Card } from 'components/Card'
import { PastDcasTable } from 'components/PastDcasTable'

const Hero = styled.div`
  align-items: flex-start;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto;
  margin-bottom: 32px;
  text-align: center;
`

const StyledHighlightedText = styled(HighlightedText)`
  font-weight: 200;
  text-shadow: none;
`

const Stats: React.FC = () => {
  return (
    <Page>
      <Hero>
        <StyledHighlightedText className="hero" letterSpacing="16px" fontSize="34px">
          INVOLICA
        </StyledHighlightedText>
      </Hero>
      <Column width="100%" gap="24px">
        <ChartOptionsRow />
        <PortfolioChart />
        <Card title="Portfolio Stats" padding="24px">
          <DerivedStatsTable />
        </Card>
        <Card title="Executed DCAs" padding="24px">
          <PastDcasTable />
        </Card>
      </Column>
    </Page>
  )
}

export default Stats
