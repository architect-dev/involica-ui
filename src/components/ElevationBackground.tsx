import { Elevation } from 'config/constants/types'
import React from 'react'
import { useSelectedElevation } from 'state/hooks'
import styled from 'styled-components'

const BackgroundImage = styled.div<{ elevation: Elevation | null }>`
  background-image: ${({ theme, elevation }) => `url("/images/summit/background${elevation || 'BASE'}${theme.isDark ? '_DARK' : '_LIGHT'}.jpg")`};
  position: fixed;
  background-position: center right;
  background-attachment: fixed;
  background-size: cover;
  background-repeat: no-repeat;
  top: 0;
  right: 0;
  height: 100%;
  width: 100%;
  pointer-events: none;
`

const ElevationBackground: React.FC = () => {
  const elevation = useSelectedElevation()

  return (
    <BackgroundImage elevation={elevation} />
  )

}

export default React.memo(ElevationBackground)
