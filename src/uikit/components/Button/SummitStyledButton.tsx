import styled, { css } from 'styled-components'
import { SpinnerKeyframes } from '../Svg/Icons/Spinner'
import StyledButton from './StyledButton'

const SummitStyledButton = styled(StyledButton)<{
  height?: number
  padding?: number
  $summitPalette?: string
  $isLocked: boolean
  $freezeSummitButton?: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  position: relative;
  height: ${({ height }) => height || 28}px;
  min-height: ${({ height }) => height || 28}px;
  border-radius: 22px;
  border: 0px solid ${({ theme }) => theme.colors.text};
  
  padding: ${({ padding }) => padding || '0px 38px'};
  /* box-shadow: ${({ theme, disabled, $isLocked }) => disabled || $isLocked ? 'none' : `1px 1px 1px ${theme.colors.textShadow}, 1px 1px 1px inset ${theme.colors.textShadow}`}; */
  
  opacity: ${({ disabled, $isLocked }) => (disabled || $isLocked ? 0.5 : 1)};
  background: ${({ theme }) => theme.colors.button};
  color: ${({ theme }) => theme.colors.text};
  
  > * {
    text-align: center;
    font-family: Courier Prime, monospace;
    color: ${({ theme }) => theme.colors.text};
  }

  .spinner {
    fill: white;
    animation: ${SpinnerKeyframes} 1.4s infinite linear;
  }

  ${({ $freezeSummitButton }) => $freezeSummitButton && css`
    &::after {
        content: ' ';
        position: absolute;
        width: 215px;
        height: 100px;
        pointer-events: none;
        background-image: url("/images/summit/SummitFreezeOverlay.png");
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        transform: scaleY(0.95);
    }
  `}
`

export default SummitStyledButton
