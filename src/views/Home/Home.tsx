import React from 'react'
import styled from 'styled-components'
import Page from 'components/layout/Page'
import { PositionCard } from './Components/PositionCard'
import { AllowanceCard } from './Components/AllowanceCard'
import { PositionStatusCard } from './Components/PositionStatusCard'
import { FundsCard } from './Components/FundsCard'
import { UpcomingExecutionsCard } from './Components/UpcomingExecutionsCard'
import { PastDcasTable } from 'components/PastDcasTable'
import { StoneHeader } from 'components/StoneHeader'



const CardsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 24px;
  width: 100%;
`



const Home: React.FC = () => {
  return (
    <Page>
      <StoneHeader/>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <CardsWrapper>
        <PositionStatusCard />
        <FundsCard />
        <PositionCard />
        <AllowanceCard />
        <UpcomingExecutionsCard />
        <PastDcasTable />
      </CardsWrapper>
    </Page>
  )
}

export default Home
