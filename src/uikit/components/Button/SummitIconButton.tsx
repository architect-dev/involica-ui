import styled, { css } from 'styled-components'
import { pressableMixin } from 'uikit/util/styledMixins'
import { SpinnerKeyframes } from '../Svg/Icons/Spinner'

const SummitIconButton = styled.div<{ isLocked?: boolean, isLoading?: boolean }>`
  cursor: pointer;
  position: relative;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 200px;
  width: 52px;
  height: 52px;
  margin-left: 10px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  .spinner {
    fill: white;
    animation: ${SpinnerKeyframes} 1.4s infinite linear;
    z-index: 5;
  }

  ${({ theme, isLocked, isLoading }) =>
    pressableMixin({
      theme,
      disabled: isLocked || isLoading,
      disabledStyles: css`
        filter: grayscale(1);
        opacity: 0.75;
      `,
      hoverStyles: css`
        box-shadow: 2px 2px 4px ${theme.colors.textShadow};
      `,
      enabledStyles: css`
        background: ${theme.colors.cardHover};
        box-shadow: ${`1px 1px 2px ${theme.colors.textShadow}`};
      `,
    })}
`

export default SummitIconButton
