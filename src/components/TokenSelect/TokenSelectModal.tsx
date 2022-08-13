import React, { useCallback, useMemo } from 'react'
import { keys } from 'lodash'
import { useInvolicaStore } from 'state/zustand'
import {
  Column,
  Flex,
  Row,
  RowBetween,
  SummitButton,
  Text,
  TokenSymbolImage,
} from 'uikit'
import { AddressRecord, Token, UserTokenData } from 'state/types'
import { transparentize } from 'polished'
import styled, { css } from 'styled-components'
import { pressableMixin } from 'uikit/util/styledMixins'
import { bnDisplay } from 'utils'

export type ModalVariant = 'price' | 'balance'

const TokenRowButton = styled(RowBetween)<{ disabled }>`
  width: calc(100% + 36px);
  padding: 0 18px;
  height: 48px;
  min-height: 48px;
  margin: 0 -18px;
  ${({ theme, disabled }) =>
    pressableMixin({
      theme,
      disabled,
      $translate: false,
      hoverStyles: css`
        background-color: ${transparentize(0.9, theme.colors.text)};
      `,
      disabledStyles: css`
        filter: grayscale(1);
      `,
    })}
`

const TokenSelectRow: React.FC<{
  token: Token
  userData?: UserTokenData
  disabledReason: string | null
  variant: ModalVariant
  setToken: (string) => void
}> = ({ token, userData, variant, disabledReason, setToken }) => {
  const balance = useMemo(() => {
    switch (variant) {
      case 'price': {
        const price = token.price?.toFixed(2)
        return price != null ? `$${price}` : '-'
      }
      case 'balance':
      default:
        return bnDisplay(userData?.balance, token?.decimals, 3)
    }
  }, [token, userData, variant])
  return (
    <TokenRowButton
      disabled={disabledReason != null}
      onClick={() => setToken(token.address)}
    >
      <Row gap="6px">
        <TokenSymbolImage symbol={token.symbol} width={24} height={24} />
        <Column>
          <Text bold>{token.symbol}</Text>
          {disabledReason != null && (
            <Text fontSize="11px" mt='-4px'>{disabledReason}</Text>
          )}
        </Column>
      </Row>
      <Text>{balance != null ? balance : '-'}</Text>
    </TokenRowButton>
  )
}

const HeaderRow = styled(RowBetween)`
  width: 100%;
  padding: 6px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.text};
`

const TokenSelectModal: React.FC<{
  disabledTokens?: AddressRecord<string>
  variant: ModalVariant
  onDismiss?: () => void
  setToken: (string) => void
}> = ({
  disabledTokens,
  variant = 'balance',
  setToken,
  onDismiss = () => null,
}) => {
  const tokens = useInvolicaStore((state) => state.tokens)
  const userTokensData = useInvolicaStore(
    (state) => state.userData?.userTokensData,
  )

  const handleSelect = useCallback(
    (addr) => {
      setToken(addr)
      onDismiss()
    },
    [setToken, onDismiss],
  )

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minWidth="300px"
    >
      <Text bold>Select Token:</Text>
      <br />
      <HeaderRow>
        <Text>Token</Text>
        <Text>{variant === 'price' ? 'Price' : 'Bal'}</Text>
      </HeaderRow>
      {keys(tokens).map((addr) => (
        <TokenSelectRow
          key={addr}
          token={tokens[addr]}
          userData={userTokensData?.[addr]}
          disabledReason={disabledTokens?.[addr]}
          setToken={handleSelect}
          variant={variant}
        />
      ))}
      <br />
      <SummitButton onClick={onDismiss} activeText="Close" />
    </Flex>
  )
}

export default TokenSelectModal
