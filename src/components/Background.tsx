import React from 'react'
import styled, { css } from 'styled-components'

const BackgroundImage = styled.div`
  --noise-4: url("data:image/svg+xml,%3Csvg viewBox='0 0 100% 100%' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  --gradient-3: radial-gradient(circle at top right, hsl(180 100% 50%), hsl(180 100% 50% / 0%)),
    radial-gradient(circle at bottom left, hsl(328 100% 54%), hsl(328 100% 54% / 0%));
  --gradient-mask: radial-gradient(circle at 80% top, #000 0%, transparent 70%),
    radial-gradient(circle at 25% bottom, #000 0%, transparent 30%),
    linear-gradient(135deg, black, transparent, transparent, black);
  position: fixed;
  isolation: isolate;
  /* stack grain with a gradient */
  /* , var(--noise-4); */
  /* force colors and noise to collide */
  /* filter: var(--noise-filter-1); */
  /* fit noise image to element */
  background-size: repeat;
  top: 0;
  right: 0;
  height: 100%;
  width: 100%;
  pointer-events: none;

  ${({ theme }) =>
    theme.isDark
      ? css`
          background-image: var(--gradient-3), var(--noise-4);
          filter: brightness(0);
        `
      : css`
          mask-image: var(--noise-4); /* , var(--gradient-mask); */
          background: radial-gradient(circle at 60% 25%, #ffecd2 30%, #f7cac9 60%, #f4b4b3 100%);
          background: radial-gradient(circle at bottom right, #ffecd2 10%, transparent 60%),
          conic-gradient(from 180deg at 100% 5%, #f4b4b3 10%, transparent 15%),
          conic-gradient(from -90deg at 0% 35%, #ffecd2 45%, #f7cac9 60%, #f4b4b3 75%, #f4b4b3 100%);
        `}
`

const Background: React.FC = () => {
  return <BackgroundImage />
}

export default React.memo(Background)
