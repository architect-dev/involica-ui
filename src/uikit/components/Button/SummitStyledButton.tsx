import styled, { css } from 'styled-components'
import { SpinnerKeyframes } from '../Svg/Icons/Spinner'
import StyledButton from './StyledButton'

const SummitStyledButton = styled(StyledButton)<{
  height?: number
  padding?: number
  $isLocked: boolean
  changed?: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  position: relative;
  height: ${({ height }) => height || 28}px;
  min-height: ${({ height }) => height || 28}px;
  border-radius: 22px;
  gap: 4px;
  
  padding: ${({ padding }) => padding || '0px 38px'};
  opacity: ${({ disabled, $isLocked }) => (disabled || $isLocked ? 0.5 : 1)};
  
  > * {
    text-align: center;
    color: ${({ theme }) => theme.colors.text};
  }

  .spinner {
    fill: white;
    animation: ${SpinnerKeyframes} 1.4s infinite linear;
  }
  
  ${({ changed, theme }) => changed && css`
    :after {
      content: '*';
      color: ${theme.colors.warning};
      font-size: 14px;
      font-weight: bold;
      position: absolute;
      top: -4px;
      right: -8px;
    }
  `}
`

export default SummitStyledButton
