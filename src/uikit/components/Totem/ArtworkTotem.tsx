import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Elevation, elevationUtils } from 'config/constants/types'
import { BaseDeity } from './BaseDeity'
import { HighlightedText } from 'uikit/components/Text'

const TotemBackground = styled.div<{
  elevation
  desktopSize?: string
  mobileSize?: string
  crowned: boolean
  greyed?: boolean
  withName?: boolean
}>`
  position: relative;
  overflow: visible;
  width: ${({ mobileSize }) => mobileSize || 100}px;
  height: ${({ mobileSize }) => mobileSize || 100}px;
  margin: 6px;
  margin-bottom: ${({ withName }) => (withName ? '48px' : '6px')};
  border-radius: 200px;
  background: ${({ theme, elevation, crowned }) =>
    crowned ? 'linear-gradient(180deg, #FFD891 0%, #CF5278 100%)' : theme.colors[elevation]};
  box-shadow: ${({ theme }) => `1px 1px 3px ${theme.colors.textShadow}`};
  filter: ${({ greyed }) => (greyed ? 'grayscale(1)' : 'none')};

  ${({ theme }) => theme.mediaQueries.nav} {
    width: ${({ desktopSize }) => desktopSize || 154}px;
    height: ${({ desktopSize }) => desktopSize || 154}px;
  }
`

const TotemIcon = styled.div<{ totemName: string; crowned: boolean }>`
  position: absolute;
  top: ${({ crowned }) => crowned ? -20 : -10}px;
  left: -10px;
  right: -10px;
  bottom: ${({ crowned }) => crowned ? 0 : -10}px;
  background-image: ${({ totemName }) => `url("/images/totemArtwork/${totemName}_FULL.png")`};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  filter: drop-shadow(2px 0px 1px black);
`

const ElevationForeground = styled.div<{ elevation: Elevation; crowned: boolean }>`
  position: absolute;
  top: -11px;
  left: -11px;
  right: -11px;
  bottom: -11px;
  background-image: ${({ elevation, crowned }) => `url("/images/totemArtwork/${crowned ? 'GOLD' : elevation}_FG.png")`};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  filter: drop-shadow(2px 0px 2px black);
`

const ArtworkCrown = styled.div<{ desktopSize?: string; mobileSize?: string }>`
  position: absolute;
  background-image: url('/images/totemArtwork/CROWN.png');
  background-size: cover;

  width: ${({ mobileSize }) => `calc(${mobileSize || 100}px / 1.5)`};
  height: ${({ mobileSize }) => `calc(${mobileSize || 100}px / 1.5)`};
  top: ${({ mobileSize }) => `calc(${mobileSize || 100}px * -0.425)`};
  right: ${({ mobileSize }) => `calc(${mobileSize || 100}px * -0.125)`};

  ${({ theme }) => theme.mediaQueries.nav} {
    width: ${({ desktopSize }) => `calc(${desktopSize || 154}px / 1.5)`};
    height: ${({ desktopSize }) => `calc(${desktopSize || 154}px / 1.5)`};
    top: ${({ desktopSize }) => `calc(${desktopSize || 154}px * -0.425)`};
    right: ${({ desktopSize }) => `calc(${desktopSize || 154}px * -0.125)`};
  }

  animation: pulse 3s ease-in-out infinite;
  @keyframes pulse {
    0% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
    }
    50% {
      -webkit-transform: translateY(15px) rotate(5deg);
      transform: translateY(15px) rotate(5deg);
    }
    to {
      -webkit-transform: translateY(0);
      transform: translateY(0);
    }
  }
`

const Deity = styled(BaseDeity)`
  height: calc(300px / 1.358);
  width: 300px;
  margin-bottom: 26px;
`

const ArtworkName = styled(HighlightedText)`
  position: absolute;
  bottom: -32px;
  left: 0px;
  right: 0px;
  text-align: center;
`

interface DeityTotemProps {
  totem: number
}

const DeityTotem: React.FC<DeityTotemProps> = ({ totem }) => {
  const [totemSelected, setTotemSelected] = useState(false)
  useEffect(() => {
    setTimeout(() => {
      setTotemSelected(true)
    }, 200)
  }, [])
  return <Deity deity={totem} selected={totemSelected} />
}

interface TotemProps {
  elevation: Elevation
  totem: number | null
  crowned?: boolean
  crownedGlowOnly?: boolean
  desktopSize?: string
  mobileSize?: string
  greyed?: boolean
  withName?: boolean
  noCrown?: boolean
}

const ArtworkTotem: React.FC<TotemProps> = ({
  elevation,
  totem,
  crowned,
  crownedGlowOnly,
  desktopSize,
  mobileSize,
  greyed,
  withName,
  noCrown
}) => {
  if (elevation === Elevation.EXPEDITION) {
    return <DeityTotem totem={totem} />
  }
  return (
    <TotemBackground
      elevation={elevation}
      crowned={crowned}
      desktopSize={desktopSize}
      mobileSize={mobileSize}
      greyed={greyed}
      withName={withName}
    >
      <TotemIcon
        crowned={crowned || crownedGlowOnly}
        totemName={elevationUtils.getElevationTotemName(elevation, totem)}
      />
      <ElevationForeground elevation={elevation} crowned={crowned} />
      {crowned && !noCrown && <ArtworkCrown desktopSize={desktopSize} mobileSize={mobileSize} />}
      {withName && totem != null && (
        <ArtworkName fontSize="16px" gold={crowned} header summitPalette={elevation}>
          {elevationUtils.getElevationTotemName(elevation, totem, false)}
        </ArtworkName>
      )}
    </TotemBackground>
  )
}

export default React.memo(ArtworkTotem)
