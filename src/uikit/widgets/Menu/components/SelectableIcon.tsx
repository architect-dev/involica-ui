import React from 'react'
import { MENU_ENTRY_HEIGHT } from '../config'
import styled from 'styled-components'

interface Props {
  isActive: boolean
  elevation?: string
  backgroundIcon?: string
  icon: string
  crowned?: boolean
  elevationLocked: boolean
}

const Wrapper = styled.div`
  width: ${MENU_ENTRY_HEIGHT + 4}px;
  height: ${MENU_ENTRY_HEIGHT + 4}px;
  align-items: center;
  justify-content: center;
  position: relative;
`

const ActiveRing = styled.div<{ isActive: boolean; elevation?: string; backgroundIcon?: string }>`
  position: absolute;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  border: ${({ theme, elevation }) => `3px solid ${theme.colors[elevation]}`};
  border-radius: 50px;
  opacity: ${({ isActive }) => (isActive ? 1 : 0)};
  transform: ${({ isActive }) => `scale(${isActive ? 1 : 0.8})`};
  box-shadow: 1px 1px 3px ${({ theme }) => theme.colors.textShadow};
  background-image: ${({ backgroundIcon }) => (backgroundIcon != null ? `url("/images/${backgroundIcon}")` : null)};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`

const Background = styled.div<{ elevation: string; backgroundIcon?: string }>`
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  bottom: 12px;
  background-color: ${({ theme, elevation }) => theme.colors[elevation]};
  transform: all 300ms;
  border-radius: 50px;
  box-shadow: 1px 1px 3px ${({ theme }) => theme.colors.textShadow};
  background-image: ${({ backgroundIcon }) => (backgroundIcon != null ? `url("/images/${backgroundIcon}")` : null)};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`

const Icon = styled.div<{ iconName: string }>`
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  bottom: 8px;
  background-image: ${({ iconName }) => `url("/images/${iconName}")`};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`

const IconCrown = styled.div`
  position: absolute;
  top: -20px;
  left: 10px;
  width: 52px;
  height: 52px;
  transform: rotate(10deg);
  background-image: url('/images/totemIcons/ICONCROWN.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 2;
  pointer-events: none;
`

const IconLock = styled.div`
  position: absolute;
  top: -2px;
  right: 3px;
  width: 36px;
  height: 36px;
  background-image: url('/images/totemIcons/LOCK.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`

const SelectableIcon: React.FC<Props> = ({
  isActive,
  elevation,
  backgroundIcon,
  icon,
  crowned = false,
  elevationLocked,
}) => (
  <Wrapper className="selectableIcon">
    <ActiveRing isActive={isActive} elevation={elevation} backgroundIcon={backgroundIcon} />
    <Background elevation={elevation} backgroundIcon={backgroundIcon} />
    {icon != null && <Icon iconName={icon} />}
    {crowned && <IconCrown />}
    {elevationLocked && <IconLock />}
  </Wrapper>
)

export default React.memo(
  SelectableIcon,
  (prev, next) =>
    prev.isActive === next.isActive &&
    prev.icon === next.icon &&
    prev.crowned === next.crowned &&
    prev.elevationLocked === next.elevationLocked,
)
