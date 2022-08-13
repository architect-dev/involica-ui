import React, { useCallback, useMemo } from 'react'
import { keys } from 'lodash'
import { useInvolicaStore } from 'state/zustand'
import { Column, Flex, Row, RowBetween, SummitButton, Text, TokenSymbolImage } from 'uikit'
import { AddressRecord, Token, UserTokenData } from 'state/types'
import { transparentize } from 'polished'
import styled, { css } from 'styled-components'
import { pressableMixin } from 'uikit/util/styledMixins'
import { bnDisplay } from 'utils'

const TokenRowButton = styled(RowBetween)<{ disabled }>`
  width: calc(100% + 36px);
  padding: 12px 18px;
  margin: 0px -18px;
  ${({ theme, disabled }) => pressableMixin({
    theme,
    disabled,
    $translate: false,
    hoverStyles: css`
      background-color: ${transparentize(0.9, theme.colors.text)};
    `
  })}
`

const TokenSelectRow: React.FC<{
  token: Token
  userData?: UserTokenData
  disabledReason: string | null
  setToken: (string) => void
}> = ({ token, userData, disabledReason, setToken }) => {
  const balance = useMemo(
    () => bnDisplay(userData?.balance, token?.decimals, 3),
    [token?.decimals, userData?.balance]
  )
  return (
    <TokenRowButton disabled={disabledReason != null} onClick={() => setToken(token.address)}>
      <Column>
      <Row gap='6px'>
        <TokenSymbolImage
          symbol={token.symbol}
          width={24}
          height={24}
        />
        <Text bold>{token.symbol}</Text>
      </Row>
      { disabledReason != null && <Text small>{disabledReason}</Text>}
      </Column>
      <Text>{balance != null ? balance : '-'}</Text>
    </TokenRowButton>
  )
}

const TokenSelectModal: React.FC<{
  disabledTokens?: AddressRecord<string>
  onDismiss?: () => void
  setToken: (string) => void
}> = ({ disabledTokens, setToken, onDismiss = () => null }) => {
  const tokens = useInvolicaStore((state) => state.tokens)
  const userTokensData = useInvolicaStore((state) => state.userData?.userTokensData)

  const handleSelect = useCallback(
    (addr) => {
      setToken(addr)
      onDismiss()
    },
    [setToken, onDismiss]
  )

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minWidth="300px"
    >
      <Text bold>Select Token:</Text>
      <br/>
      {keys(tokens).map((addr) => (
        <TokenSelectRow
          key={addr}
          token={tokens[addr]}
          userData={userTokensData?.[addr]}
          disabledReason={disabledTokens?.[addr]}
          setToken={handleSelect}
        />
      ))}
      <br/>
      <SummitButton onClick={onDismiss} activeText="Close" />
    </Flex>
  )
}

export default TokenSelectModal
