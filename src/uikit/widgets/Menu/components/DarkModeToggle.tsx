import React, { useCallback } from 'react'
import { SummitPalette, ElevOrPalette } from 'config/constants/types'
import styled from 'styled-components'
import SummitButton from 'uikit/components/Button/SummitButton'
import { pressableMixin } from 'uikit/util/styledMixins'
import { SelectorWrapperBase } from 'uikit/widgets/Selector/styles'
import { SunIcon, MoonIcon } from '../icons'

interface Props {
  summitPalette: ElevOrPalette
  isDark: boolean
  toggleTheme: () => void
}

const ToggleWrapper = styled(SelectorWrapperBase)`
  position: relative;
  width: 58px;
  height: 32px;
  border-radius: 20px;

  ${pressableMixin}
`

const BGSunIcon = styled(SunIcon)`
  position: absolute;
  width: 20px;
  height: 20px;
  top: 6px;
  right: 6px;
`
const BGMoonIcon = styled(MoonIcon)`
  position: absolute;
  width: 20px;
  height: 20px;
  top: 6px;
  left: 6px;
`

const StyledSummitButton = styled(SummitButton)<{ visible: boolean }>`
  position: absolute;
  width: 28px;
  height: 28px;
  top: 2px;
  left: ${({ visible }) => (visible ? 28 : 2)}px;
  padding: 0px;

  pointer-events: none;
`

const StyledSunIcon = styled(SunIcon)<{ visible: boolean }>`
  position: absolute;
  width: 24px;
  height: 24px;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  margin: auto;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
`
const StyledMoonIcon = styled(MoonIcon)<{ visible: boolean }>`
  position: absolute;
  width: 24px;
  height: 24px;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  margin: auto;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
`

const DarkModeToggle: React.FC<Props> = ({ summitPalette, isDark, toggleTheme }) => {
  const handleToggleTheme = useCallback(() => {
    if (summitPalette === SummitPalette.EXPEDITION) return
    toggleTheme()
  }, [summitPalette, toggleTheme])
  return (
    <ToggleWrapper disabled={summitPalette === SummitPalette.EXPEDITION} onClick={handleToggleTheme}>
      <BGSunIcon color="white" />
      <BGMoonIcon color="#575757" />
      <StyledSummitButton summitPalette={summitPalette} visible={!isDark}>
        <StyledSunIcon color="white" visible={!isDark} />
        <StyledMoonIcon color="white" visible={isDark} />
      </StyledSummitButton>
    </ToggleWrapper>
  )
}

export default DarkModeToggle
