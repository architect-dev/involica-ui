import React from 'react'
import styled from 'styled-components'

const LpSymbolWrapper = styled.div<{ size: number; mobileSize: number }>`
  position: relative;
  width: ${({ mobileSize }) => mobileSize}px;
  height: ${({ mobileSize }) => mobileSize}px;
  
  ${({ theme }) => theme.mediaQueries.nav} {
    width: ${({ size }) => size}px;
    height: ${({ size }) => size}px;
  }
`

const BaseSymbolIcon = styled.div<{ elevation: string; size: number; mobileSize: number }>`
  position: absolute;
  background-image: ${({ elevation }) => `url("/images/summit/elevationArtwork${elevation}.jpg")`};
  border-radius: 50%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  box-shadow: 1px 1px 2px ${({ theme }) => theme.colors.textShadow};
  width: ${({ mobileSize }) => mobileSize}px;
  height: ${({ mobileSize }) => mobileSize}px;

  ${({ theme }) => theme.mediaQueries.nav} {
    width: ${({ size }) => size}px;
    height: ${({ size }) => size}px;
  }
`

const SingleSymbolIcon = styled(BaseSymbolIcon)`
  width: ${({ mobileSize }) => mobileSize * 0.85}px;
  height: ${({ mobileSize }) => mobileSize * 0.85}px;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  
  
  ${({ theme }) => theme.mediaQueries.nav} {
    width: ${({ size }) => size * 0.85}px;
    height: ${({ size }) => size * 0.85}px;
  }
`

interface Props {
  elevation: string
  size: number
  mobileSize?: number
}

const ElevationImage: React.FC<Props> = ({ elevation, size, mobileSize }) => {
  return (
    <LpSymbolWrapper size={size} mobileSize={mobileSize || size}>
      <SingleSymbolIcon elevation={elevation} size={size} mobileSize={mobileSize || size} />
    </LpSymbolWrapper>
  )
}

export default ElevationImage
