import styled, { DefaultTheme } from 'styled-components'
import getColor from '../../util/getColor'
import { TagProps } from './types'

interface ThemedProps extends TagProps {
  theme: DefaultTheme
}

const getThemeTextColor = ({ outline, variant = 'primary', theme }: ThemedProps) =>
  outline ? getColor(variant, theme) : '#ffffff'

export const StyledTag = styled.div<ThemedProps>`
  align-items: center;
  background-color: ${({ outline, theme, elevation }) =>
    // eslint-disable-next-line no-nested-ternary
    outline ? 'transparent' : theme.colors[elevation || 'BASE']};
  border: 2px solid
    ${({ elevation, theme }) => theme.colors[elevation || 'BASE']};
  border-radius: 16px;
  color: ${({ elevation, theme, outline, variant }) =>
    outline ? theme.colors[elevation || 'BASE'] : getThemeTextColor({ outline, variant, theme })};
  display: inline-flex;
  font-size: 12px;
  font-weight: bold;
  height: 20px;
  line-height: 1.5;
  padding: 0 6px;
  white-space: nowrap;

  svg {
    fill: ${({ elevation, theme, outline, variant }) =>
      elevation && outline ? theme.colors[elevation] : getThemeTextColor({ outline, variant, theme })};
  }
`

export default null
