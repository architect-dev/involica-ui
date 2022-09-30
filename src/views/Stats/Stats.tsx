import React from 'react'
import styled from 'styled-components'
import { HighlightedText } from 'uikit'
import Page from 'components/layout/Page'
import 'chartjs-adapter-date-fns'
import PortfolioChart from './components/PortfolioChart'

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
        <PortfolioChart />
      </Hero>
    </Page>
  )
}

export default Stats
