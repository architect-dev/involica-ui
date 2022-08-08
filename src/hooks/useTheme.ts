import { useContext } from 'react'
import { ThemeContext as StyledThemeContext } from 'styled-components'
import { ThemeContext } from 'contexts/ThemeContext'

const useTheme = () => {
  const { isDark, toggleTheme, setPageForcedDark } = useContext(ThemeContext)
  const theme = useContext(StyledThemeContext)
  return { isDark, toggleTheme, setPageForcedDark, theme }
}

export default useTheme
