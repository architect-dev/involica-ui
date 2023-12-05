import React from 'react'
import styled from 'styled-components'
import SummitButton from '@uikit/components/Button/SummitButton'
import { grainyGradientMixin, pressableMixin } from '@uikit/util/styledMixins'
import { SelectorWrapperBase } from '@uikit/widgets/Selector/styles'
import { SunIcon, MoonIcon } from '../icons'

interface Props {
	isDark: boolean
	toggleTheme: () => void
}

const ToggleWrapper = styled(SelectorWrapperBase)`
	position: relative;
	width: 58px;
	height: 32px;
	border-radius: 20px;

	${pressableMixin}

	${({ theme }) => grainyGradientMixin(theme.isDark)}
`

const BGSunIcon = styled(SunIcon)`
	position: absolute;
	width: 20px;
	height: 20px;
	top: 6px;
	right: 6px;
	fill: ${({ theme }) => theme.colors.text};
`
const BGMoonIcon = styled(MoonIcon)`
	position: absolute;
	width: 20px;
	height: 20px;
	top: 6px;
	left: 6px;
	fill: ${({ theme }) => theme.colors.text};
`

const StyledSummitButton = styled(SummitButton)<{ visible: boolean }>`
	position: absolute;
	width: 32px;
	height: 32px;
	top: 0px;
	left: ${({ visible }) => (visible ? 26 : 0)}px;
	padding: 0px;

	pointer-events: none;
	box-shadow: none;
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
	fill: ${({ theme }) => theme.colors.buttonText};
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
	fill: ${({ theme }) => theme.colors.buttonText};
`

const DarkModeToggle: React.FC<Props> = ({ isDark, toggleTheme }) => {
	return (
		<ToggleWrapper onClick={toggleTheme}>
			<BGSunIcon />
			<BGMoonIcon />
			<StyledSummitButton visible={!isDark}>
				<StyledSunIcon visible={!isDark} />
				<StyledMoonIcon visible={isDark} />
			</StyledSummitButton>
		</ToggleWrapper>
	)
}

export default DarkModeToggle
