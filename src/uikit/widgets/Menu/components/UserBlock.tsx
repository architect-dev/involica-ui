import React, { useCallback } from 'react'
import styled from 'styled-components'
import { grainyGradientMixin, pressableMixin } from '@uikit/util/styledMixins'
import { Text } from '@uikit/components/Text'
import { Login } from '../../WalletModal/types'
import { transparentize } from 'polished'
import { SummitPopUp } from '@uikit/widgets/Popup'
import ConnectPopUp from '@uikit/widgets/WalletModal/ConnectPopUp'
import AccountPopUp from '@uikit/widgets/WalletModal/AccountPopUp'
import { ChainIcon } from '@uikit/components/Svg'
import { CHAIN_ID, Nullable } from '@utils'
import { Column } from '@uikit/components/Box'
import { useInvolicaStore } from '@state/store'
import { useUserTreasuryGlanceData } from '@state/uiHooks'

const UserBlockFlex = styled.div`
	display: flex;
	gap: 12px;
	align-items: center;
	justify-content: center;
	${pressableMixin}

	transform: null;
	transition: transform 100ms ease-in-out;

	:hover:not(:active) {
		transform: translate(-1px, -1px);
		.account-dot {
			box-shadow: 2px 2px 0px ${({ theme }) => transparentize(0.4, theme.colors.text)};
		}
		.no-account-fill {
			box-shadow: inset 2px 2px 0px ${({ theme }) => transparentize(0.4, theme.colors.text)};
		}
		.label {
			text-decoration: underline;
			font-weight: bold;
		}
	}
`

const AccountDot = styled.div<{ connected: boolean }>`
	position: relative;
	width: 36px;
	height: 36px;
	border-radius: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0px 0px 0px ${({ theme }) => transparentize(0.4, theme.colors.text)};
	transition: box-shadow 100ms ease-in-out;

	${({ theme }) => theme.mediaQueries.nav} {
		width: 36px;
		height: 36px;
	}

	${({ theme }) => grainyGradientMixin(!theme.isDark)}
`

const NoAccountFill = styled.div`
	position: absolute;
	top: 2px;
	right: 2px;
	left: 2px;
	bottom: 2px;
	border-radius: 50px;
	background-color: ${({ theme }) => (theme.isDark ? '#131313' : '#fff6e9')};
	box-shadow: inset 0px 0px 0px ${({ theme }) => transparentize(0.4, theme.colors.text)};
	transition: box-shadow 100ms ease-in-out;
	z-index: 2;
`

const StyledChainIcon = styled(ChainIcon)`
	width: 18px;
	height: 18px;
	fill: ${({ theme }) => theme.colors.buttonText};
	z-index: 2;
`

interface Props {
	account: Nullable<string>
	isDark: boolean
	toggleTheme: () => void
	login: Login
	logout: () => void
}

const UserBlock: React.FC<Props> = ({ account, isDark, toggleTheme, login, logout }) => {
	const { connectModalOpen, setConnectModalOpen } = useInvolicaStore((state) => ({
		connectModalOpen: state.connectModalOpen,
		setConnectModalOpen: state.setConnectModalOpen,
	}))
	const chain = parseInt(CHAIN_ID)
	const accountEllipsis = account ? `${account.substring(0, 4)}...${account.substring(account.length - 4)}` : null
	const closeConnectModal = useCallback(() => setConnectModalOpen(false), [setConnectModalOpen])

	const { userTreasuryUsd, userTreasuryColor } = useUserTreasuryGlanceData()

	return (
		<SummitPopUp
			position='bottom right'
			button={
				<UserBlockFlex>
					<AccountDot className='account-dot' connected={account != null}>
						{account == null ? <NoAccountFill className='no-account-fill' /> : <StyledChainIcon chain={chain} />}
					</AccountDot>
					<Column justifyContent='flex-end'>
						<Text className='label' monospace textAlign='right'>
							{account ? accountEllipsis : 'CONNECT'}
						</Text>
						{account && (
							<Text className='label' small color={userTreasuryColor} textAlign='right'>
								Funds: <b>{userTreasuryUsd}</b>
							</Text>
						)}
					</Column>
				</UserBlockFlex>
			}
			popUpContent={
				account != null ? (
					<AccountPopUp account={account} isDark={isDark} toggleTheme={toggleTheme} logout={logout} />
				) : (
					<ConnectPopUp login={login} isDark={isDark} toggleTheme={toggleTheme} />
				)
			}
			open={connectModalOpen}
			callOnDismiss={closeConnectModal}
		/>
	)
}

export default React.memo(UserBlock)
