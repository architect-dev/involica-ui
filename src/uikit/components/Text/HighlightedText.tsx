// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react'
import { ElevOrPalette } from 'config/constants/types'
import styled from 'styled-components'
import getThemeValue from 'uikit/util/getThemeValue'
import { Text, ThemedProps } from './Text'

const getColor = ({ color, gold, theme }: ThemedProps) => {
  if (gold) return theme.colors.textGold
  return getThemeValue(`colors.${color}`, color)(theme)
}

export const HighlightedText = styled(Text)<{
  summitPalette?: ElevOrPalette
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
  color: ${getColor};
  font-size: ${({ header, fontSize }) => fontSize || (header ? '22' : '16')}px !important;
  text-shadow: ${({ theme, summitPalette }) => {
    if (theme.isDark) return 'none'
    return `1px 1px 0px ${theme.colors[summitPalette || 'textShadow']}`
  }}
`

HighlightedText.defaultProps = {
  header: false,
}
