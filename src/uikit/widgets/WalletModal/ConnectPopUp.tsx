import React from 'react'
import WalletCard from './WalletCard'
import config from './config'
import { Login } from './types'
import { Text } from '../../components/Text'
import styled from 'styled-components'
import { SummitPalette } from 'config/constants'
import { Flex } from 'uikit/components/Box'
import Divider from 'uikit/components/Divider'
import DarkModeToggle from '../Menu/components/DarkModeToggle'

const PopUpWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 300px;
  gap: 18px;
`

interface Props {
  login: Login
  isDark: boolean
  toggleTheme: () => void
  onDismiss?: () => void
}

const ConnectPopUp: React.FC<Props> = ({ login, isDark, toggleTheme, onDismiss = () => null }) => (
  <PopUpWrapper>
    <Text bold monospace>Connect Wallet:</Text>
    <Flex flexDirection='column'>
      {config.map((entry, index) => (
        <WalletCard
          key={entry.title}
          login={login}
          walletConfig={entry}
          onDismiss={onDismiss}
          mb={index < config.length - 1 ? '8px' : '0'}
        />
      ))}
    </Flex>

    <Divider/>

    <Flex width='100%' alignItems='center' justifyContent='space-between'>
      <Text bold monospace>Site Theme</Text>
      <DarkModeToggle summitPalette={SummitPalette.BASE} isDark={isDark} toggleTheme={toggleTheme}/>
    </Flex>
  </PopUpWrapper>
)

export default ConnectPopUp
