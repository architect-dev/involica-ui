import React from 'react'
import styled from 'styled-components'
import { HighlightedText } from 'uikit'
import Page from 'components/layout/Page'
import { PositionCard } from './Components/PositionCard'
import { AllowanceCard } from './Components/AllowanceCard'
import { PositionStatusCard } from './Components/PositionStatusCard'
import { FundsCard } from './Components/FundsCard'
import { UpcomingExecutionsCard } from './Components/UpcomingExecutionsCard'
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

const CardsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 24px;
  width: 100%;
`

const StyledHighlightedText = styled(HighlightedText)<{
  fontSize: string
  letterSpacing: string
}>`
  letter-spacing: ${({ letterSpacing }) => letterSpacing};
  font-weight: 200;
  font-size: ${({ fontSize }) => fontSize};
  text-shadow: none;
`

const Home: React.FC = () => {
  return (
    <Page>
      <Hero>
        <StyledHighlightedText className="sticky" fontSize="34px" letterSpacing="16px">
          INVOLICA
        </StyledHighlightedText>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <CardsWrapper>
          <PositionStatusCard />
          <FundsCard />
          <PositionCard />
          <AllowanceCard />
          <UpcomingExecutionsCard />
          <PastDcasTable />
        </CardsWrapper>
      </Hero>
    </Page>
  )
}

export default Home
