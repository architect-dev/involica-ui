import React, { useCallback, useMemo, useState } from 'react'
import { useInvolicaStore } from 'state/store'
import { Column, Row, RowBetween, SummitButton, Text, TokenSymbolImage, useMatchBreakpoints } from 'uikit'
import { AddressRecord, Token, UserTokenData } from 'state/types'
import { transparentize } from 'polished'
import styled, { css } from 'styled-components'
import { pressableMixin } from 'uikit/util/styledMixins'
import { bnDisplay, tryGetAddress } from 'utils'
import { getIsStable } from 'config/tokens'
import { Check } from 'react-feather'
import { ModalContentContainer } from 'uikit/widgets/Popup/SummitPopUp'
import { selectorWrapperMixin } from 'uikit/widgets/Selector/styles'

export type ModalVariant = 'tokenIn' | 'tokenOut'

const TokenRowButton = styled(RowBetween)<{ disabled }>`
  width: 100%;
  padding: 0 18px;
  height: 48px;
  min-height: 48px;
  color: ${({ theme }) => theme.colors.text};
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
  selected: boolean
  disabledReason: string | null
  variant: ModalVariant
  setToken: (string) => void
}> = ({ token, userData, variant, selected, disabledReason, setToken }) => {
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
      onClick={() => (disabledReason != null ? null : setToken(token.address))}
    >
      <Row gap="6px">
        {selected && <Check size={16} />}
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

export const TokenSearchInput = styled.input`
  ${selectorWrapperMixin}

  min-height: 32px;
  height: 32px;
  max-height: 32px;
  border-radius: 16px;
  margin-bottom: 12px;

  display: flex;
  width: 100%;
  border: none;
  outline: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 12px;
  
  padding: 0 16px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  :focus {
    outline: none;
  }
`

const SearchBar: React.FC<{
  search: string
  setSearch: (str: string) => void
}> = ({ search, setSearch }) => {
  const { isXs, isSm, isMd } = useMatchBreakpoints()
  const isMobile = isXs || isSm || isMd
  const handleInput = useCallback(
    (event) => {
      const input = event.target.value
      const checksummedInput = tryGetAddress(input)
      setSearch(checksummedInput || input)
    },
    [setSearch],
  )
  return (
    <TokenSearchInput
      width="100%"
      type="text"
      id="token-search-input"
      placeholder="Search by Name or Address"
      value={search}
      onChange={handleInput}
      autoComplete="off"
      spellCheck="false"
      autoFocus={!isMobile}
    />
  )
}

const TokenSelectModal: React.FC<{
  selectedTokens?: string[]
  disabledTokens?: AddressRecord<string>
  variant: ModalVariant
  onDismiss?: () => void
  setToken?: (string) => void
}> = ({ selectedTokens, disabledTokens, variant = 'tokenIn', setToken, onDismiss = () => null }) => {
  const tokens = useInvolicaStore((state) => state.tokens)
  const userTokensData = useInvolicaStore((state) => state.userData?.userTokensData)
  const [search, setSearch] = useState<string>('')

  const handleSelect = useCallback(
    (addr) => {
      if (setToken != null) {
        setToken(addr)
      }
      onDismiss()
    },
    [setToken, onDismiss],
  )

  const filteredTokens = useMemo(() => {
    if (search == null || search === '') return Object.values(tokens)

    const searchAddr = tryGetAddress(search)

    if (searchAddr) return Object.values(tokens).filter(({ address }) => address === searchAddr)

    const lowerSearchParts = search
      .toLowerCase()
      .split(/\s+/)
      .filter((s) => s.length > 0)

    if (lowerSearchParts.length === 0) {
      return Object.values(tokens)
    }

    const matchesSearch = ({ symbol }: { symbol: string }): boolean => {
      const sParts = symbol
        .toLowerCase()
        .split(/\s+/)
        .filter((str) => str.length > 0)

      return lowerSearchParts.every((p) => p.length === 0 || sParts.some((sp) => sp.startsWith(p) || sp.endsWith(p)))
    }

    return Object.values(tokens).filter(matchesSearch)
  }, [search, tokens])

  const sortedTokens = useMemo(() => {
    const sorted = () => {
      if (variant === 'tokenIn')
        return filteredTokens.sort(
          ({ address: a, decimals: decA }, { address: b, decimals: decB }) =>
            Number(bnDisplay(userTokensData?.[b]?.balance, decB, 3)) -
            Number(bnDisplay(userTokensData?.[a]?.balance, decA, 3)),
        )
      if (variant === 'tokenOut')
        return filteredTokens.sort(
          ({ address: a }, { address: b }) => (getIsStable(a) ? 1 : -1) - (getIsStable(b) ? 1 : -1),
        )
      return filteredTokens
    }
    return sorted().map(({ address }) => address)
  }, [variant, filteredTokens, userTokensData])

  return (
    <ModalContentContainer minWidth="300px" maxHeight="600px" gap="0px">
      <SearchBar search={search} setSearch={setSearch} />
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
            selected={selectedTokens?.includes(addr)}
            disabledReason={disabledTokens?.[addr]}
            setToken={handleSelect}
            variant={variant}
          />
        ))}
        {sortedTokens.length === 0 && (
          <Text my='16px' italic small>No Tokens Found</Text>
        )}
      </Scrollable>
      <br />
      <SummitButton onClick={onDismiss} activeText="Close" variant="secondary" />
    </ModalContentContainer>
  )
}

export default TokenSelectModal
