import React from 'react'
import ContributionBreakdown from './ContributionBreakdown'
import { useElevationYieldBetContributions, useFarmsUserDataLoaded } from 'state/hooksNew'
import { Elevation } from 'config/constants'
import { mix } from 'polished'
import styled from 'styled-components'

const ElevBreakdownWrapper = styled.div`
  width: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: row; 
  margin-top: 17px;
  position: relative;
  padding: 12px 0px;
  z-index: 12;
`

const BackgroundColor = styled.div<{ elevation: Elevation }>`
  position: absolute;
  top: 0px;
  height: 50px;
  right: -1px;
  left: 0px;
  background-color: ${({ theme, elevation }) => mix(0.85, theme.colors.background, theme.colors[elevation])};
  border-radius: 20px 20px 0 0;
`

const ElevationYieldBet: React.FC<{ elevation: string }> = ({ elevation: elevString }) => {
  const elevation = elevString as Elevation
  const userDataLoaded = useFarmsUserDataLoaded()
  const yieldBetContributions = useElevationYieldBetContributions(elevation)

  return (
    <ElevBreakdownWrapper>
      <BackgroundColor elevation={elevation}/>
      <ContributionBreakdown
        loaded={userDataLoaded}
        contributions={yieldBetContributions}
      />
    </ElevBreakdownWrapper>
  )
}

export default React.memo(ElevationYieldBet)
