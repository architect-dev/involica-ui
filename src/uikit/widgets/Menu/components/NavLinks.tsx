import React from 'react'
import styled, { css } from 'styled-components'
import { Link, useLocation } from 'react-router-dom'
import { MenuEntry } from '../types'
import { pressableMixin } from '@uikit/util/styledMixins'
import { Text } from '@uikit/components/Text'
import DebugMenu from './DebugMenu'
import { Nullable } from '@utils'

interface Props {
	links: Array<MenuEntry>
	mobileNav: boolean
	account: Nullable<string>
}

const Container = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-content: center;
	align-items: center;
	height: 100%;
	gap: 0 24px;
	flex-wrap: wrap;
	max-width: 250px;

	${({ theme }) => theme.mediaQueries.sm} {
		max-width: 100%;
	}
`

const ItemFlex = styled.div<{ selected: boolean; index: number }>`
	display: flex;
	gap: 6px;
	align-items: center;
	justify-content: center;
	position: relative;
	height: 32px;
	${({ theme }) =>
		pressableMixin({
			theme,
			hoverStyles: css`
				.item-label {
					font-weight: bold;
					text-decoration: underline;
				}
			`,
		})}

	${({ selected }) =>
		selected &&
		css`
			.item-label {
				font-weight: bold;
				text-decoration: underline;
			}
		`}
`

const NavLinks: React.FC<Props> = ({ links, account }) => {
	const location = useLocation()
	const keyPath = location.pathname.split('/')[1]

	return (
		<Container>
			{links.map((entry, index) => {
				const selected = entry?.keyPaths?.includes(keyPath)
				if (entry.external)
					return (
						<ItemFlex key={entry.href} rel='noreferrer noopener' target='_blank' selected={false} index={index} as='a' href={entry.href}>
							<Text className='item-label' monospace bold={selected}>
								{entry.label}
							</Text>
						</ItemFlex>
					)
				return (
					<ItemFlex key={entry.href} selected={selected ?? false} index={index} as={Link} to={entry.href} replace>
						<Text className='item-label' monospace bold={selected}>
							{entry.label}
						</Text>
					</ItemFlex>
				)
			})}
			<DebugMenu account={account} />
		</Container>
	)
}

export default React.memo(NavLinks)
