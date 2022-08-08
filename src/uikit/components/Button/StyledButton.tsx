import styled, { css, DefaultTheme } from 'styled-components'
import { space, layout, variant } from 'styled-system'
import { pressableMixin } from 'uikit/util/styledMixins'
import { scaleVariants, styleVariants } from './theme'
import { BaseButtonProps } from './types'

interface ThemedButtonProps extends BaseButtonProps {
  theme: DefaultTheme
  isLocked?: boolean
}

const getDisabledStyles = ({ isLoading, isLocked = false }: ThemedButtonProps) => {
  if (isLocked) {
    return css`
      &:disabled,
      &.summit-button--disabled {
        cursor: not-allowed;
      }
      filter: grayscale(1);
      opacity: 0.5;
      box-shadow: none;
      cursor: not-allowed;
      .secondary-inset {
        box-shadow: none;
      }
    `
  }

  if (isLoading === true) {
    return css`
      &:disabled,
      &.summit-button--disabled {
        cursor: not-allowed;
      }
      opacity: 0.5;
    `
  }

  return css`
    &:disabled,
    &.summit-button--disabled {
      box-shadow: none;
      cursor: not-allowed;
      .secondary-inset {
        box-shadow: none;
      }
    }
  `
}

const StyledButton = styled.button<BaseButtonProps>`
  cursor: pointer;
  align-items: center;
  border: 0;
  border-radius: 6px;
  display: inline-flex;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  justify-content: center;
  letter-spacing: 0.03em;
  line-height: 1;
  outline: 0;

  ${({ theme, disabled }) => pressableMixin({
    theme,
    disabled,
    hoverStyles: css`
      box-shadow: 2px 2px 4px ${theme.colors.textShadow};
      .secondary-inset {
        box-shadow: 2px 2px 4px inset ${theme.colors.textShadow};
      }
    `
  })}

  &:hover:not(:disabled):not(.summit-button--disabled):not(.summit-button--disabled):not(:active) {
    /* opacity: 0.65; */
    transform: translateY(-2px);
  }

  &:active:not(:disabled):not(.summit-button--disabled):not(.summit-button--disabled) {
    /* opacity: 0.85; */
    box-shadow: none;
    .secondary-inset {
      box-shadow: none;
    }
  }

  ${getDisabledStyles}
  ${variant({
    prop: 'scale',
    variants: scaleVariants,
  })}
  ${variant({
    variants: styleVariants,
  })}
  ${layout}
  ${space}
`

export default StyledButton
