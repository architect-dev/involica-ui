import { transparentize } from 'polished'
import React from 'react'
import styled from 'styled-components'
import { connectorLocalStorageKey } from './config'
import { Login, Config } from './types'
import { grainyGradientMixin } from '@uikit/util/styledMixins'
import StyledButton from '@uikit/components/Button/StyledButton'
import { variants } from '@uikit/components/Button/types'

const WalletStyledButton = styled(StyledButton)`
	width: 100%;

	.icon {
		width: 32px;
		filter: drop-shadow(0px 0px 0px ${({ theme }) => transparentize(0.4, theme.colors.text)});
		transform: none;
		transition: filter 100ms ease-in-out, transform 100ms ease-in-out;
	}

	${({ theme }) => grainyGradientMixin(!theme.isDark)}

	:hover:not(:active) {
		.icon {
			filter: drop-shadow(2px 2px 0px ${({ theme }) => transparentize(0.4, theme.colors.text)});
			transform: translate(-1px, -1px);
		}
	}
`

interface Props {
	walletConfig: Config
	login: Login
	onDismiss?: () => void
	mb: string
}

const WalletCard: React.FC<Props> = ({ login, walletConfig, onDismiss, mb }) => {
	const { title, icon: Icon } = walletConfig
	return (
		<WalletStyledButton
			variant={variants.PRIMARY}
			onClick={() => {
				login(walletConfig.connectorId)
				window.localStorage.setItem(connectorLocalStorageKey, walletConfig.connectorId)
				if (onDismiss != null) onDismiss()
			}}
			style={{ justifyContent: 'space-between' }}
			mb={mb}
			id={`wallet-connect-${title.toLocaleLowerCase()}`}
		>
			<Children>
				{title}
				<Icon width='32px' className='icon' />
			</Children>
		</WalletStyledButton>
	)
}

const Children = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	filter: brightness(1);
	padding: 6px 8px;
`

export default WalletCard
