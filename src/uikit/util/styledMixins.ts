import { css, DefaultTheme, FlattenSimpleInterpolation } from 'styled-components'

export const pressableMixin = ({
  theme,
  disabled = false,
  hoverStyles,
  disabledStyles,
  enabledStyles,
}: {
  theme: DefaultTheme
  disabled?: boolean
  hoverStyles?: FlattenSimpleInterpolation
  disabledStyles?: FlattenSimpleInterpolation
  enabledStyles?: FlattenSimpleInterpolation
}) => {
  if (disabled)
    return css`
      cursor: not-allowed;
      opacity: 0.5;

      ${disabledStyles}
    `

  return css`
    cursor: pointer;
    opacity: 1;
    transition: opacity 100ms ease-in-out, box-shadow 100ms ease-in-out, transform 100ms ease-in-out;

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

export const grainyGradientMixin = (dark: boolean) => css`
  position: relative;
  background-color: #faf1e4;
  ::before {
    content: ' ';
    pointer-events: none;
    position: absolute;
    top: 0px;
    left: 0px;
    bottom: 0px;
    right: 0px;
    border-radius: inherit;
    isolation: isolate;
    ${dark
      ? css`
          isolation: isolate;
          background-image: radial-gradient(circle at bottom right, hsl(328 100% 54%) 0%, hsl(328 100% 54% / 0%) 150%),
            url("data:image/svg+xml,%3Csvg viewBox='0 0 100% 100%' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          filter: brightness(0);
        `
      : css`
          isolation: isolate;
          mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 100% 100%' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          background: radial-gradient(circle at bottom left, #f3acc0 20%, transparent 100%),
            conic-gradient(from 250deg at 70% -50%, transparent 60%, #f4b4b3 75%, transparent 85%);
        `}
  }
`
