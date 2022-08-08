import { Elevation } from 'config/constants/types'
import React from 'react'
import { useSelectedElevation } from 'state/hooks'
import styled from 'styled-components'

const BackgroundImage = styled.div<{ elevation?: Elevation }>`
  position: fixed;
  background-image: url('/images/expedition/BACKGROUND.jpg');
  background-position: center bottom;
  background-attachment: fixed;
  background-size: cover;
  background-repeat: no-repeat;
  height: 120%;
  width: 100%;
  pointer-events: none;

  transform: translateY(-65px) scale(1.01);
  transform-origin: bottom center;
  opacity: ${({ elevation }) => (elevation === Elevation.EXPEDITION ? 1 : 0)};

  ${({ theme }) => theme.mediaQueries.nav} {
    background-position: center bottom;
  }
`

const ExpeditionBackground: React.FC = () => {
  const elevation = useSelectedElevation()
  return <BackgroundImage elevation={elevation} />
}

export default React.memo(ExpeditionBackground)
