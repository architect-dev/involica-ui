import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { LogoIcon as LogoWithText } from '../icons'
import { pressableMixin } from '@uikit/util/styledMixins'

interface Props {
	isDark: boolean
	href: string
}

const StyledLink = styled(Link)`
	display: flex;
	align-items: center;
	padding: 6px 0px;
	.desktop-icon {
		width: 177px;
		display: block;
	}
	justify-content: center;

	${pressableMixin}
`

const Logo: React.FC<Props> = ({ isDark, href }) => {
	return (
		<StyledLink to={href} replace aria-label='Summit home page'>
			<LogoWithText isDark={isDark} className='desktop-icon' />
		</StyledLink>
	)
}

export default React.memo(Logo, (prev, next) => prev.isDark === next.isDark)
