import { AlertTheme } from '../uikit/components/Alert/types'
import { CardTheme } from '../uikit/components/Card/types'
import { TooltipTheme } from '../uikit/components/Tooltip/types'
import { NavTheme } from '../uikit/widgets/Menu/types'
import { ModalTheme } from '../uikit/widgets/Modal/types'
import { Colors, Breakpoints, MediaQueries, Spacing, Shadows, Radii, ZIndices } from './types'

export interface PancakeTheme {
  siteWidth: number
  isDark: boolean
  alert: AlertTheme
  colors: Colors
  card: CardTheme
  nav: NavTheme
  modal: ModalTheme
  tooltip: TooltipTheme
  breakpoints: Breakpoints
  mediaQueries: MediaQueries
  spacing: Spacing
  shadows: Shadows
  radii: Radii
  zIndices: ZIndices
}

export { default as dark } from './dark'
export { default as light } from './light'

export { lightColors } from './colors'
export { darkColors } from './colors'
