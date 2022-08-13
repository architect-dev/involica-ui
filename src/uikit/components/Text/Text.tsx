import React from 'react';
import styled, { DefaultTheme } from 'styled-components'
import { space, typography } from 'styled-system'
import getThemeValue from 'uikit/util/getThemeValue';
import { TextProps } from './types'

export interface ThemedProps extends TextProps {
  theme: DefaultTheme
}

const getColor = ({ color, gold, red, theme }: ThemedProps) => {
  if (red) return theme.colors.failure
  if (gold) return theme.colors.textGold
  // return theme.colors[color]
  return getThemeValue(`colors.${color}`, color)(theme)
}

const getFontSize = ({ fontSize, small }: TextProps) => {
  return small ? '12px' : fontSize || '13px'
}

export const breakTextBr = (breakableText: string): Array<string | JSX.Element> => {
  return breakableText.split('|').map((text) => (text === 'br' ? <br key={text} /> : text))
}

export const Text = styled.div<TextProps>`
  color: ${getColor};
  font-size: ${getFontSize};
  font-weight: ${({ bold }) => (bold ? 600 : 400)};
  font-style: ${({ italic }) => (italic ? 'italic' : 'default')};
  text-decoration: ${({ underline }) => (underline ? 'underline' : 'default')};
  line-height: 1.5;
  font-family: monospace;
  ${({ textTransform }) => textTransform && `text-transform: ${textTransform};`}
  ${space}
  ${typography}
`

Text.defaultProps = {
  color: 'text',
  small: false,
}
