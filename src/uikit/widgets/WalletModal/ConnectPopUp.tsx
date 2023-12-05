import React from 'react'
import WalletCard from './WalletCard'
import config from './config'
import { Login } from './types'
import { Text } from '../../components/Text'
import { Flex } from '@uikit/components/Box'
import Divider from '@uikit/components/Divider'
import DarkModeToggle from '../Menu/components/DarkModeToggle'
import { ModalContentContainer } from '../Popup/SummitPopUp'

interface Props {
	login: Login
	isDark: boolean
	toggleTheme: () => void
	onDismiss?: () => void
}

const ConnectPopUp: React.FC<Props> = ({ login, isDark, toggleTheme, onDismiss = () => null }) => (
	<ModalContentContainer gap='18px' minWidth='300px' padding='18px 0px'>
		<Text bold monospace>
			Connect Wallet:
		</Text>
		<Flex flexDirection='column' width='100%'>
			{config.map((entry, index) => (
				<WalletCard key={entry.title} login={login} walletConfig={entry} onDismiss={onDismiss} mb={index < config.length - 1 ? '8px' : '0'} />
			))}
		</Flex>

		<Divider />

		<Flex width='100%' alignItems='center' justifyContent='space-between'>
			<Text bold monospace>
				Site Theme
			</Text>
			<DarkModeToggle isDark={isDark} toggleTheme={toggleTheme} />
		</Flex>
	</ModalContentContainer>
)

export default ConnectPopUp
