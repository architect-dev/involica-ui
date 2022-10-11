import { transparentize } from 'polished'
import React from 'react'
import styled from 'styled-components'
import Button from '../../components/Button/Button'
import { Text } from '../../components/Text/Text'
import { connectorLocalStorageKey } from './config'
import { Login, Config } from './types'

const StyledButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.selectorBackground};
  width: 100%;

  .icon {
    width: 32px;
    filter: drop-shadow(0px 0px 0px ${({ theme }) => transparentize(0.4, theme.colors.text)});
    transform: none;
    transition: filter 100ms ease-in-out, transform 100ms ease-in-out;
  }

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
    <StyledButton
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
        className='icon'
      />
    </StyledButton>
  )
}

export default WalletCard
