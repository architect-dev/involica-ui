import { css, DefaultTheme, FlattenSimpleInterpolation } from 'styled-components'

export const pressableMixin = ({
  theme,
  disabled = false,
  $translate = true,
  hoverStyles,
  disabledStyles,
  enabledStyles,
}: {
  theme: DefaultTheme
  disabled?: boolean
  $translate?: boolean
  hoverStyles?: FlattenSimpleInterpolation
  disabledStyles?: FlattenSimpleInterpolation
  enabledStyles?: FlattenSimpleInterpolation
}) => {
  if (disabled) return css`
    cursor: not-allowed;
    opacity: 0.5;

    ${disabledStyles}
  `

  return css`
    cursor: pointer;
    opacity: 1;
    transition: opacity 150ms ease-in-out, box-shadow 150ms ease-in-out;

    ${theme.mediaQueries.nav} {
      &:hover {
        font-weight: bold;
        ${hoverStyles}
      }
      &:active {
        opacity: 0.5;
      }
    }

    ${enabledStyles}
  `
}
