import { transparentize } from 'polished'
import React from 'react'
import styled from 'styled-components'
import Button from '../../components/Button/Button'
import { Text } from '../../components/Text/Text'
import { connectorLocalStorageKey } from './config'
import { Login, Config } from './types'

const StyledButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.selectorBackground};
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
    <StyledButton
      width="100%"
      variant="tertiary"
      onClick={() => {
        login(walletConfig.connectorId)
        window.localStorage.setItem(connectorLocalStorageKey, walletConfig.connectorId)
        if (onDismiss != null) onDismiss()
      }}
      style={{ justifyContent: 'space-between' }}
      mb={mb}
      id={`wallet-connect-${title.toLocaleLowerCase()}`}
    >
      <Text bold monospace mr="16px">
        {title}
      </Text>
      <Icon
        width="32px"
        style={{ width: '32px', filter: `drop-shadow(2px 2px 2px ${transparentize(0.5, '#000000')})` }}
      />
    </StyledButton>
  )
}

export default WalletCard
