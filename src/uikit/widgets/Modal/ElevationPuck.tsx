import React from 'react'
import { elevationUtils } from 'config/constants/types'
import styled from 'styled-components'
import { HighlightedText } from 'uikit/components/Text'

interface Props {
  elevation?: string
  top?: number
  inline?: boolean
}

const PuckSize = 180

const HeaderCircleWrapper = styled.div<{ top?: number, inline: boolean }>`
  z-index: 3;
  height: ${PuckSize + 12}px;
  position: ${({ inline }) => inline ? 'relative' : 'absolute'};
  width: ${PuckSize + 12}px;
  top: ${({ top }) => top != null ? top : -(PuckSize + 12) / 2}px;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
`

const HeaderCircleBackground = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${PuckSize}px;
  box-shadow: ${({ theme }) => `1px 1px 3px ${theme.colors.textShadow}`};
  position: absolute;
  width: ${PuckSize + 12}px;
  height: ${PuckSize + 12}px;
`

export const HeaderArtwork = styled.div<{ elevation: string }>`
  position: relative;
  background-image: ${({ elevation }) =>
    `url("/images/summit/elevationArtwork${elevation || 'BASE'}.jpg")`};
  box-shadow: 1px 1px 2px ${({ theme }) => theme.colors.textShadow};
  border-radius: ${PuckSize}px;
  background-size: cover;
  width: ${PuckSize}px;
  height: ${PuckSize}px;
`

export const IceCube = styled.div`
  position: absolute;
  opacity: 0.8;
  background-image: url("/images/summit/IceCube.png");
  background-size: cover;
  width: ${PuckSize + 36}px;
  height: ${PuckSize + 36}px;
`

const PuckWhiteText = (name: string) => {
  return elevationUtils.isElevation(name) || name === 'BLUE' || name === 'EVEREST' || name === 'GLACIER'
}

export const HeaderElevationName = styled(HighlightedText)<{ elevationName: string }>`
  position: absolute;
  color: ${({ elevationName, theme }) => (PuckWhiteText(elevationName) ? 'white' : theme.colors.text)};
  text-shadow: 1px 1px 2px ${({ theme }) => theme.colors.textShadow};
  text-transform: uppercase;
  margin: auto;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  flex-direction: column;
`

export const ElevationPuck: React.FC<Props> = ({ elevation, children, top, inline = false }) =>
  !elevation ? null : (
    <HeaderCircleWrapper top={top} inline={inline}>
      <HeaderCircleBackground />
      <HeaderArtwork elevation={elevation} />
      <HeaderElevationName header elevationName={elevation}>
        {children}
      </HeaderElevationName>
    </HeaderCircleWrapper>
  )
