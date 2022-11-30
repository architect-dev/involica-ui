import React, { useMemo } from 'react'
import { Text, TokenSymbolImage, Flex } from 'uikit'
import styled, { css } from 'styled-components'
import { PerfIndicator } from './PerfIndicator'
import { TokenTradeData } from 'state/statsHooks'
import { transparentize } from 'polished'
import { pressableMixin } from 'uikit/util/styledMixins'

const StyledTable = styled.table`
  width: 100%;
  thead {
    border-bottom: 1px dashed ${({ theme }) => theme.colors.text};
  }
  tbody {
  }
  th {
    vertical-align: bottom;
    padding: 6px;
  }
  td {
    vertical-align: middle;
    padding: 6px;
  }
  & tr:not(.head):nth-child(odd) {
    background-color: ${({ theme }) => transparentize(0.95, theme.colors.text)};
  }
`
const StyledSecondRowTh = styled.th`
  height: 52px;
`
const ClickableTr = styled.tr<{ clickable: boolean; highlighted: boolean }>`
  ${({ theme, highlighted }) =>
    highlighted &&
    css`
      outline: 1px solid ${theme.colors.text};
      outline-offset: -1px;
    `}
  ${({ theme, clickable }) =>
    clickable &&
    pressableMixin({
      theme,
      hoverStyles: css`
        background-color: ${transparentize(0.85, theme.colors.text)} !important;
      `,
    })};
`

const TokenRow: React.FC<{
  data: TokenTradeData
  isTokenIn?: boolean
  hasOuts?: boolean
  isAggregate?: boolean
  highlighted?: boolean
  censorable?: boolean
  onClick?: () => void
}> = ({
  data,
  isTokenIn = false,
  hasOuts = false,
  isAggregate = false,
  highlighted = false,
  censorable = false,
  onClick,
}) => {
  return (
    <ClickableTr highlighted={highlighted} clickable={onClick != null} onClick={onClick}>
      <td>
        <Flex alignItems="center" gap="2px">
          <TokenSymbolImage symbol={data.symbol} width={24} height={24} />
          <Text bold>{data.symbol}</Text>
        </Flex>
      </td>
      <td>
        <Text small textAlign="right">
          {isTokenIn ? (
            <b>{censorable ? data.trade.censorableUsdDisplay : data.trade.usdDisplay}</b>
          ) : censorable ? (
            data.trade.censorableUsdDisplay
          ) : (
            data.trade.usdDisplay
          )}
          <br />
          <Text fontSize="11px" italic textAlign="right">
            ({isAggregate && 'avg '}${data.trade.price.toFixed(2)})
          </Text>
        </Text>
      </td>
      {!isTokenIn && (
        <>
          <td>
            <Text small bold textAlign="right">
              <b>{censorable ? data.current.censorableUsdDisplay : data.current.usdDisplay}</b>
              <br />
              <Text fontSize="11px" italic textAlign="right">
                (${data.price.toFixed(2)})
              </Text>
            </Text>
          </td>
          <td>
            <PerfIndicator {...data.valueChange} censorable={censorable} invertColors={isTokenIn} />
          </td>
        </>
      )}
      {isTokenIn && hasOuts && (
        <>
          <td />
          <td />
        </>
      )}
    </ClickableTr>
  )
}

export const TokenPerfTable: React.FC<{
  tokensIn?: TokenTradeData[]
  tokensOut?: TokenTradeData[]
  isAggregate?: boolean
  highlightedTokens?: string[]
  censorable?: boolean
  onTokenInClick?: (token: string) => void
  onTokenOutClick?: (token: string) => void
}> = ({
  tokensIn,
  tokensOut,
  isAggregate,
  highlightedTokens = [],
  censorable = false,
  onTokenInClick,
  onTokenOutClick,
}) => {
  const hasTokensIn = useMemo(() => tokensIn?.length > 0, [tokensIn?.length])
  return (
    <StyledTable>
      {hasTokensIn && (
        <>
          <thead>
            <tr className="head">
              <th>
                <Text italic small>
                  Token{tokensIn.length > 1 ? 's' : ''} In
                </Text>
              </th>
              <th>
                <Text italic small textAlign="right">
                  $Trade
                </Text>
              </th>
            </tr>
          </thead>
          <tbody>
            {tokensIn.map((tokenIn) => (
              <TokenRow
                key={tokenIn.address}
                data={tokenIn}
                censorable={censorable}
                isTokenIn
                hasOuts={tokensOut && tokensOut.length > 0}
                highlighted={highlightedTokens.includes(tokenIn.address)}
                isAggregate={isAggregate}
                onClick={
                  onTokenInClick == null
                    ? null
                    : () => onTokenInClick(highlightedTokens.includes(tokenIn.address) ? null : tokenIn.address)
                }
              />
            ))}
          </tbody>
        </>
      )}
      {tokensOut && tokensOut.length > 0 && (
        <>
          <thead>
            <tr className="head">
              {hasTokensIn ? (
                <StyledSecondRowTh>
                  <Text italic small>
                    Token{tokensOut.length > 1 ? 's' : ''} Out
                  </Text>
                </StyledSecondRowTh>
              ) : (
                <th>
                  <Text italic small>
                    Token{tokensOut.length > 1 ? 's' : ''} Out
                  </Text>
                </th>
              )}
              <th>
                <Text italic small textAlign="right">
                  $Trade
                </Text>
              </th>
              <th>
                <Text italic small textAlign="right">
                  $Current
                </Text>
              </th>
              <th>
                <Text italic small textAlign="right">
                  Perf
                </Text>
              </th>
            </tr>
          </thead>
          <tbody>
            {tokensOut.map((tokenOut) => (
              <TokenRow
                key={tokenOut.address}
                data={tokenOut}
                isAggregate={isAggregate}
                highlighted={highlightedTokens.includes(tokenOut.address)}
                censorable={censorable}
                onClick={
                  onTokenOutClick == null
                    ? null
                    : () => onTokenOutClick(highlightedTokens.includes(tokenOut.address) ? null : tokenOut.address)
                }
              />
            ))}
          </tbody>
        </>
      )}
    </StyledTable>
  )
}
