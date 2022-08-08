import { DefaultTheme } from 'styled-components'
import { dark as darkAlert } from '../uikit/components/Alert/theme'
import { dark as darkCard } from '../uikit/components/Card/theme'
import { dark as darkNav } from '../uikit/widgets/Menu/theme'
import { dark as darkModal } from '../uikit/widgets/Modal/theme'
import { dark as darkTooltip } from '../uikit/components/Tooltip/theme'
import base from './base'
import { darkColors } from './colors'

const darkTheme: DefaultTheme = {
  ...base,
  isDark: true,
  alert: darkAlert,
  colors: darkColors,
  card: darkCard,
  nav: darkNav,
  modal: darkModal,
  tooltip: darkTooltip,
}

export default darkTheme
