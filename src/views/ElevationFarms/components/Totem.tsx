import React from 'react'
import styled from 'styled-components'
import { Elevation, elevationUtils } from 'config/constants/types'

const ActiveRing = styled.div<{ color?: string; elevation: Elevation }>`
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border: ${({ color, theme, elevation }) => `3px solid ${color || theme.colors[elevation]}`};
  border-radius: 50px;
  box-shadow: 1px 1px 3px ${({ theme }) => theme.colors.textShadow};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`

const TotemBackground = styled.div<{ elevation; color?: string; pressable; size; navSize; margins }>`
  cursor: ${({ pressable }) => (pressable ? 'pointer' : 'inherit')};
  position: relative;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  margin: ${({ margins }) => margins || '4'}px;
  border-radius: 50px;
  background-color: ${({ color, theme, elevation }) => color || theme.colors[elevation]};
  box-shadow: ${({ theme }) => `1px 1px 3px ${theme.colors.textShadow}`};

  &:hover {
    transform: ${({ pressable }) => (pressable ? 'scale(1.1)' : 'none')};
  }

  ${({ theme }) => theme.mediaQueries.nav} {
    width: ${({ size }) => size}px;
    height: ${({ size }) => size}px;
    margin: ${({ margins }) => margins || '6'}px;
  }
`

const TotemIcon = styled.div<{ totemName: string }>`
  position: absolute;
  top: -6px;
  left: -6px;
  right: -6px;
  bottom: -6px;
  background-image: ${({ totemName }) => `url("/images/totemIcons/${totemName}.png")`};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`
const TotemCrown = styled.div`
  position: absolute;
  top: -31px;
  right: -8px;
  width: 52px;
  height: 52px;
  transform: rotate(10deg);
  background-image: url('/images/totemIcons/ICONCROWN.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 2;
  pointer-events: none !important;
`

interface TotemProps {
  elevation: Elevation
  totem: number
  color?: string
  selected?: boolean
  pressable?: boolean
  size?: string
  navSize?: string
  margins?: string
  crowned?: boolean
}

const Totem: React.FC<TotemProps> = ({
  elevation,
  totem,
  color,
  selected = false,
  pressable = true,
  size = '52',
  navSize = '64',
  margins,
  crowned = false,
}) => {
  return (
    <TotemBackground
      elevation={elevation}
      color={color}
      pressable={pressable}
      size={size}
      navSize={navSize}
      margins={margins}
    >
      {selected && <ActiveRing color={color} elevation={elevation} />}
      <TotemIcon totemName={elevationUtils.getElevationTotemName(elevation, totem)} />
      {crowned && <TotemCrown />}
    </TotemBackground>
  )
}

export default React.memo(Totem, (prev, next) => prev.totem === next.totem && prev.crowned === next.crowned && prev.elevation === next.elevation && prev.selected === next.selected)
