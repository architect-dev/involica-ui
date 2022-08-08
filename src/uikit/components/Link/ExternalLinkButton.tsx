import React from 'react'
import styled from 'styled-components'
import { OpenNewIcon } from '../Svg'
import { darken } from 'polished'
import Link from './Link'
import { LinkProps } from './types'
import { ElevOrPalette } from 'config/constants/types'
import { pressableMixin } from 'uikit/util/styledMixins'

const StyledExternalIcon = styled(OpenNewIcon)<{ summitPalette?: ElevOrPalette }>`
  fill: ${({ theme }) => theme.colors.textSubtle};
  width: 18px;
  height: 18px;
`

const StyleButton = styled(Link)<{ summitPalette?: ElevOrPalette }>`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 13px;
  font-weight: bold;
  gap: 8px;
  font-family: Courier Prime, monospace;
  text-align: right;
  white-space: nowrap;
  height: 14px;

  ${pressableMixin}
`

const ExternalLinkButton: React.FC<LinkProps> = ({ children, summitPalette, ...props }) => {
  return (
    <StyleButton external summitPalette={summitPalette} rel="noreferrer noopener" target="_blank" {...props}>
      {children}
      <StyledExternalIcon width="20px" summitPalette={summitPalette} />
    </StyleButton>
  )
}

export default ExternalLinkButton