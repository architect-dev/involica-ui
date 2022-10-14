import { SpaceProps, TypographyProps } from 'styled-system'

export interface TextProps extends SpaceProps, TypographyProps {
  color?: string
  fontSize?: string
  bold?: boolean
  underline?: boolean
  italic?: boolean
  small?: boolean
  monospace?: boolean
  gold?: boolean
  red?: boolean
  buttonText?: boolean
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize'
}
