import React from 'react'
import styled, { css, DefaultTheme } from 'styled-components'
import { space, typography } from 'styled-system'
import { TextProps } from './types'

export interface ThemedProps extends TextProps {
  theme: DefaultTheme
}

const getColor = ({ color, gold, red, theme }: ThemedProps) => {
  if (red) return theme.colors.failure
  if (gold) return theme.colors.textGold
  return theme.colors[color] || theme.colors.text
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
  text-align: left;
  font-family: monospace;
  ${({ textTransform }) => textTransform && `text-transform: ${textTransform};`}
  ${space};
  ${typography};
`

export const TextWithChanged = styled(Text)<{ changed?: boolean; asterisk?: boolean, asteriskPosition?: string }>`
  display: flex;
  position: relative;
  ${({ changed, asterisk, asteriskPosition, theme }) =>
    changed &&
    (asterisk
      ? css`
          :after {
            content: '*';
            color: ${theme.colors.warning};
            font-size: 14px;
            font-weight: bold;
            font-family: Courier Prime, monospace;
            position: absolute;
            top: ${asteriskPosition ? asteriskPosition.split(' ')[0] : '-6px'};
            right: ${asteriskPosition ? asteriskPosition.split(' ')[1] : '-8px'};
          }
        `
      : css`
          :after {
            color: ${theme.colors.warning};
            content: '(changed)';
            margin-left: 4px;
            font-weight: bold;
          }
        `)}
`

Text.defaultProps = {
  color: 'text',
  small: false,
}
