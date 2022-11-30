import React, { useCallback, useMemo } from 'react'
import { Text } from '../../components/Text/Text'
import Flex, { Column, ColumnStart, RowCenter, RowEnd } from '../../components/Box/Flex'
import CopyToClipboard from './CopyToClipboard'
import { connectorLocalStorageKey } from './config'
import SummitButton from '../../components/Button/SummitButton'
import ExternalLinkButton from '../../components/Link/ExternalLinkButton'
import { getLinks, getNativeTokenSymbol } from 'config/constants'
import styled from 'styled-components'
import Divider from 'uikit/components/Divider'
import DarkModeToggle from '../Menu/components/DarkModeToggle'
import { bn, bnDisplay, CHAIN_ID } from 'utils'
import { ChainIcon } from 'uikit/components/Svg'
import { ModalContentContainer } from '../Popup/SummitPopUp'
import { grainyGradientMixin } from 'uikit/util/styledMixins'
import { DataRow } from 'uikit/components/DataRow'
import { TopUpFundsButton } from 'components/FundsManagement/TopUpFundsModal'
import { WithdrawFundsButton } from 'components/FundsManagement/WithdrawFundsModal'
import { useNativeTokenPublicData, useUserTreasury, useDcaTxPriceRange } from 'state/hooks'

const AccountDot = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 22px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ theme }) => grainyGradientMixin(!theme.isDark)}
`

const StyledChainIcon = styled(ChainIcon)`
  width: 22px;
  height: 22px;
  fill: ${({ theme }) => theme.colors.buttonText};
  z-index: 2;
`

interface Props {
  account: string
  isDark: boolean
  toggleTheme: () => void
  logout: () => void
  onDismiss?: () => void
}

const AccountFundingSection: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => {
  const { nativeTokenData } = useNativeTokenPublicData()
  const userTreasury = useUserTreasury()
  const userTreasuryDisplay = useMemo(() => (userTreasury == null ? '-' : bnDisplay(userTreasury, 18, 4)), [
    userTreasury,
  ])
  const userTreasuryUsdDisplay = useMemo(() => {
    if (userTreasury == null || nativeTokenData?.price == null) return '-'
    return `$${bnDisplay(bn(userTreasury).times(nativeTokenData.price), 18, 2)}`
  }, [nativeTokenData?.price, userTreasury])
  const minGasPrice = '100'
  const { maxGasPrice, minTxPrice, maxTxPrice } = useDcaTxPriceRange(true)
  const dcasAtMinGas = useMemo(() => {
    if (minTxPrice == null || userTreasury == null) return '-'
    return Math.floor(bn(userTreasury).div(minTxPrice).toNumber())
  }, [minTxPrice, userTreasury])
  const dcasAtMaxGas = useMemo(() => {
    if (maxTxPrice == null || userTreasury == null) return '-'
    if (bn(userTreasury).eq(0)) return 0
    return Math.floor(bn(userTreasury).div(maxTxPrice).toNumber())
  }, [maxTxPrice, userTreasury])

  const gasPriceWarning = useMemo(() => dcasAtMaxGas === 0, [dcasAtMaxGas])
  const gasPriceError = useMemo(() => dcasAtMinGas === 0, [dcasAtMinGas])
  const errorColor = useMemo(() => (gasPriceError ? 'failure' : gasPriceWarning ? 'warning' : 'text'), [
    gasPriceError,
    gasPriceWarning,
  ])

  return (
    <ColumnStart gap="inherit" width="100%">
      <DataRow
        t="Current Funding:"
        i="Test test test test"
        v={
          <Text color={errorColor} textAlign="right">
            <b>
              {userTreasuryDisplay} {getNativeTokenSymbol()}
            </b>
            <br />
            <i>{userTreasuryUsdDisplay}</i>
          </Text>
        }
      />
      <Column width="100%">
        <DataRow
          t="DCAs covered (est):"
          v={
            <Text bold color={errorColor}>
              {dcasAtMinGas} DCAs (@ {minGasPrice} gwei)
            </Text>
          }
        />
        {maxGasPrice !== minGasPrice && (
          <RowEnd>
            <Text bold textAlign="right" color={errorColor}>
              {dcasAtMaxGas} DCAs (@ {maxGasPrice} gwei)
            </Text>
          </RowEnd>
        )}
      </Column>
      <RowCenter gap='8px'>
        <WithdrawFundsButton buttonText="Withdraw" onDismissParent={onDismiss} />
        <TopUpFundsButton buttonText="Top Up" onDismissParent={onDismiss} />
      </RowCenter>
    </ColumnStart>
  )
}

const AccountPopUp: React.FC<Props> = ({ account, isDark, toggleTheme, logout, onDismiss = () => null }) => {
  const chain = parseInt(CHAIN_ID)
  const { etherscan } = getLinks()
  const accountEtherscanLink = `${etherscan}address/${account}`
  const accountEllipsis = account ? `${account.substring(0, 4)}...${account.substring(account.length - 4)}` : null

  const getChainName = useCallback((chainNum: number) => {
    if (chainNum === 250) return 'FANTOM'
    return 'POLYGON'
  }, [])

  return (
    <ModalContentContainer gap="18px" minWidth="300px" padding="18px 0px">
      <Flex width="100%" alignItems="center" justifyContent="space-between">
        <Text bold monospace>
          ACCOUNT
        </Text>
        <SummitButton
          secondary
          height="28px"
          width="120px"
          onClick={() => {
            logout()
            window.localStorage.removeItem(connectorLocalStorageKey)
            onDismiss()
          }}
          variant="secondary"
        >
          <Text monospace small>
            DISCONNECT
          </Text>
        </SummitButton>
      </Flex>

      <Flex width="100%" alignItems="center" justifyContent="space-between">
        <Flex>
          <AccountDot>
            <StyledChainIcon chain={chain} />
          </AccountDot>
          <Flex flexDirection="column" alignItems="flex-start" justifyContent="center">
            <Text fontSize="16px" bold monospace>
              {accountEllipsis}
            </Text>
            <Text small mt="-6px" bold monospace>
              {getChainName(chain)}
            </Text>
          </Flex>
        </Flex>
        <Flex gap="8px">
          <ExternalLinkButton href={accountEtherscanLink} />
          <CopyToClipboard toCopy={account} />
        </Flex>
      </Flex>

      <Divider />

      <AccountFundingSection onDismiss={onDismiss} />

      <Divider />

      <Flex width="100%" alignItems="center" justifyContent="space-between">
        <Text bold monospace>
          Site Theme
        </Text>
        <DarkModeToggle isDark={isDark} toggleTheme={toggleTheme} />
      </Flex>
    </ModalContentContainer>
  )
}

export default AccountPopUp
