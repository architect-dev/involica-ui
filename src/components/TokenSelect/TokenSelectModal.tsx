import React, { useCallback, useMemo } from 'react'
import { keys } from 'lodash'
import { useInvolicaStore } from 'state/store'
import {
  Column,
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
import { getIsStable } from 'config/tokens'

export type ModalVariant = 'tokenIn' | 'tokenOut'

const TokenRowButton = styled(RowBetween)<{ disabled }>`
  width: 100%;
  padding: 0 18px;
  height: 48px;
  min-height: 48px;
  ${({ theme, disabled }) =>
    pressableMixin({
      theme,
      disabled,
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
      case 'tokenOut': {
        const price = token.price?.toFixed(2)
        return price != null ? `$${price}` : '-'
      }
      case 'tokenIn':
      default:
        return bnDisplay(userData?.balance, token?.decimals, 3)
    }
  }, [token, userData, variant])
  return (
    <TokenRowButton
      disabled={disabledReason != null}
      onClick={() => disabledReason != null ? null : setToken(token.address)}
    >
      <Row gap="6px">
        <TokenSymbolImage symbol={token.symbol} width={24} height={24} />
        <Column>
          <Text bold>{token.symbol}</Text>
          {disabledReason != null && (
            <Text fontSize="11px" mt="-4px">
              {disabledReason}
            </Text>
          )}
        </Column>
      </Row>
      <Text>{balance != null ? balance : '-'}</Text>
    </TokenRowButton>
  )
}

const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 300px;
  max-height: 600px;
`

const Scrollable = styled.div`
  display: flex;
  flex-direction: column;
  overflow: scroll;
  align-items: center;
  justify-content: flex-start;
  width: calc(100% + 36px);
  margin: 0 -18px;
`

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
  variant = 'tokenIn',
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

  const sortedTokens = useMemo(() => {
    if (variant === 'tokenIn')
      return keys(tokens).sort(
        (a, b) =>
          Number(
            bnDisplay(userTokensData?.[b]?.balance, tokens[b].decimals, 3),
          ) -
          Number(
            bnDisplay(userTokensData?.[a]?.balance, tokens[a].decimals, 3),
          ),
      )
    if (variant === 'tokenOut')
      return keys(tokens).sort(
        (a, b) => (getIsStable(a) ? 1 : -1) - (getIsStable(b) ? 1 : -1),
      )
    return keys(tokens)
  }, [variant, tokens, userTokensData])

  return (
    <ModalWrapper>
      <Text bold>Select Token:</Text>
      <br />
      <HeaderRow>
        <Text>Token</Text>
        <Text>{variant === 'tokenIn' ? 'Bal' : 'Price'}</Text>
      </HeaderRow>
      <Scrollable>
        {sortedTokens.map((addr) => (
          <TokenSelectRow
            key={addr}
            token={tokens[addr]}
            userData={userTokensData?.[addr]}
            disabledReason={disabledTokens?.[addr]}
            setToken={handleSelect}
            variant={variant}
          />
        ))}
      </Scrollable>
      <br />
      <SummitButton onClick={onDismiss} activeText="Close" />
    </ModalWrapper>
  )
}

export default TokenSelectModal
