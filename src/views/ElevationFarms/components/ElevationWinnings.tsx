import React from 'react'
import { Elevation } from 'config/constants/types'
import ContributionBreakdown from './ContributionBreakdown'
import { useElevationWinningsContributions, useFarmsUserDataLoaded } from 'state/hooksNew'
import styled from 'styled-components'
import { mix } from 'polished'

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

const ElevationWinnings: React.FC<{ elevation: string }> = ({ elevation: elevString }) => {
  const elevation = elevString as Elevation
  const { winningsContributions } = useElevationWinningsContributions(elevation)
  const userDataLoaded = useFarmsUserDataLoaded()

  return (
    <ElevBreakdownWrapper>
      <BackgroundColor elevation={elevation}/>
      <ContributionBreakdown
        loaded={userDataLoaded}
        contributions={winningsContributions}
      />
    </ElevBreakdownWrapper>
  )
}

export default React.memo(ElevationWinnings)
