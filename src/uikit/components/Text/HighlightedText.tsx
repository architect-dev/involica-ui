// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react'
import styled from 'styled-components'
import { Text } from './Text'

export const HighlightedText = styled(Text)<{
  header?: boolean
  fontSize?: string
  gold?: boolean
  color?: string
}>`
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-style: italic;
  text-align: center;
  font-size: ${({ header, fontSize }) => fontSize || (header ? '22' : '16')}px !important;
  text-shadow: ${({ theme }) => {
    if (theme.isDark) return 'none'
    return '1px 1px 0px textShadow'
  }}
`

HighlightedText.defaultProps = {
  header: false,
}
