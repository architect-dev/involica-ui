import React from 'react'
import { useIsRoadmap } from 'state/hooks'
import styled, { keyframes } from 'styled-components'

const SummitCloudsMovement = keyframes`
  0% {
    transform: translate(0, 0) scale(1.25);
    opacity: 0;
  }
  1% {
  }
  10% {
    opacity: 0.3;
  }
  90% {
    opacity: 0.3;
  }
  100% {
    transform: translate(10%, -40%) scale(1.25);
    opacity: 0;
  }
`

const SummitCloudsImage = styled.div`
  position: fixed;
  background-image: ${({ theme }) => `url("/images/summit/cloudOverlay${theme.isDark ? '_DARK' : ''}.png")`};
  background-size: auto 100%;
  animation: ${SummitCloudsMovement} 90s linear infinite;
  top: 0;
  right: 0;
  height: 100%;
  width: 100%;
  pointer-events: none;
`

const OnlyRoadmap = styled.div<{ isRoadmap: boolean }>`
  opacity: ${({ isRoadmap }) => isRoadmap ? 1 : 0};
`

const ElevationBackground: React.FC = () => {
  const isRoadmap = useIsRoadmap()

  return (
    <OnlyRoadmap isRoadmap={isRoadmap}>
      <SummitCloudsImage />
    </OnlyRoadmap>
  )

}

export default React.memo(ElevationBackground)
