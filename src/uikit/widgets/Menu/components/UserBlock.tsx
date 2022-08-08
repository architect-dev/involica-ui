import { Elevation } from 'config/constants/types'
import { usePendingTxs } from 'hooks/usePendingTx'
import React, { useCallback } from 'react'
import styled, { css } from 'styled-components'
import { pressableMixin } from 'uikit/util/styledMixins'
import { Text } from 'uikit/components/Text'
import { Login } from '../../WalletModal/types'
import { linearGradient } from 'polished'
import { SummitPopUp } from 'uikit/widgets/Popup'
import ConnectPopUp from 'uikit/widgets/WalletModal/ConnectPopUp'
import AccountPopUp from 'uikit/widgets/WalletModal/AccountPopUp'
import { useForceOpenConnectModal } from 'state/hooksNew'
import { setForceOpenConnectModal } from 'state/summitEcosystem'
import { useDispatch } from 'react-redux'
import { ChainIcon } from 'uikit/components/Svg'
import { CHAIN_ID } from 'utils'

const UserBlockFlex = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
  ${pressableMixin}
`

const AccountDot = styled.div<{ connected: boolean }>`
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 20px;
  background: ${linearGradient({
    colorStops: [
      '#154463',
      '#017B88',
      '#90B7B4',
    ],
    toDirection: '120deg',
  })};

  display: flex;
  align-items: center;
  justify-content: center;


  ${({ theme }) => theme.mediaQueries.nav} {
    width: 32px;
    height: 32px;
  }

  ${({ theme, connected }) => !connected && css`
    ::after {
      content: ' ';
      position: absolute;
      top: 2px;
      right: 2px;
      left: 2px;
      bottom: 2px;
      border-radius: 50px;
      background-color: ${theme.colors.background};
    }
  `}
`

const StyledChainIcon = styled(ChainIcon)`
  width: 18px;
  height: 18px;
`

interface Props {
  account?: string
  isDark: boolean
  toggleTheme: () => void
  elevation?: Elevation
  login: Login
  logout: () => void
}

const UserBlock: React.FC<Props> = ({ account, isDark, toggleTheme, login, logout }) => {
  const chain = parseInt(CHAIN_ID)
  const dispatch = useDispatch()
  const pendingTxs = usePendingTxs()
  const accountEllipsis = account ? `${account.substring(0, 4)}...${account.substring(account.length - 4)}` : null
  const forceOpenConnectModal = useForceOpenConnectModal()
  const setForcedOpenFalse = useCallback(
    () => dispatch(setForceOpenConnectModal(false)),
    [dispatch]
  )

  return (
    <SummitPopUp
      position='bottom right'
      button={
        <UserBlockFlex>
          <AccountDot connected={account != null}>
            { account != null && <StyledChainIcon white chain={chain}/> }
          </AccountDot>
          <Text bold monospace>{account ? `${accountEllipsis}${pendingTxs.length > 0 ? ` | ${pendingTxs.length} TX` : ''}` : 'CONNECT'}</Text>
        </UserBlockFlex>
      }
      popUpContent={
        account != null ?
          <AccountPopUp account={account} isDark={isDark} toggleTheme={toggleTheme} logout={logout}/> :
          <ConnectPopUp login={login} isDark={isDark} toggleTheme={toggleTheme}/>
      }
      open={forceOpenConnectModal || undefined}
      callOnDismiss={setForcedOpenFalse}
    />
  )
}

export default React.memo(UserBlock)
