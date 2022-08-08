import React from 'react'
import styled from 'styled-components'
import { SvgProps } from '../types'

const ShadowSvg = styled.svg`
  border-radius: 50px;
  width: 36px;
  height: 36px;

  ${({ theme }) => theme.mediaQueries.nav} {
    width: 32px;
    height: 32px;
  }
`

const LogoRound: React.FC<SvgProps> = (props) => {
  return (
    <ShadowSvg viewBox="0 0 36 36" {...props}>
      <image height="36" href="/images/summit/token.png" />
    </ShadowSvg>
  )
}

export default LogoRound
