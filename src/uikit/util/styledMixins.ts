import { linearGradient } from 'polished'
import { css, DefaultTheme, FlattenSimpleInterpolation } from 'styled-components'
import { getPaletteGradientStops } from 'utils'

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
    box-shadow: none;

    ${disabledStyles}
  `

  return css`
    cursor: pointer;
    opacity: 1;

    ${theme.mediaQueries.nav} {
      &:hover {
        text-decoration: underline;
        font-weight: bold;
        ${$translate === true && 'transform: translateY(-1px)'};
        ${hoverStyles}
      }
    }


    ${theme.mediaQueries.nav} {
      &:active {
        ${$translate === true && 'transform: translateY(0px)'};
        opacity: 0.5;
      }
    }

    ${enabledStyles}
  `
}

export const paletteLinearGradientBackground = ({
  theme,
  secondary,
  summitPalette,
}: {
  theme: DefaultTheme,
  secondary: boolean,
  summitPalette?: string,
}) => {
  if (secondary && summitPalette == null) return css`
    background: ${theme.colors.text};
  `
  return css`
    background: ${linearGradient({
      colorStops: getPaletteGradientStops(summitPalette),
      toDirection: '120deg',
    })}};
  `
}
