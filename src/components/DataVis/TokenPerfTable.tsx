import React, { useMemo } from 'react'
import { Text, TokenSymbolImage, Flex } from 'uikit'
import { TokenWithTradeData } from 'state/uiHooks'
import styled from 'styled-components'
import { PerfIndicator } from './PerfIndicator'

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
`
const StyledSecondRowTh = styled.th`
  height: 52px;
`

const TokenRow: React.FC<{ data: TokenWithTradeData; isTokenIn?: boolean; isAggregate?: boolean }> = ({
  data,
  isTokenIn = false,
  isAggregate = false,
}) => {
  return (
    <tr>
      <td>
        <Flex alignItems="center" gap="2px">
          <TokenSymbolImage symbol={data.symbol} width={24} height={24} />
          <Text bold>{data.symbol}</Text>
        </Flex>
      </td>
      <td>
        <Text small textAlign="right">
          {data.tradeAmountUsdDisplay}
          {!isAggregate && (
            <>
              <br />
              <Text fontSize="11px" italic textAlign="right">
                (${data.tradePrice.toFixed(2)}/{data.symbol})
              </Text>
            </>
          )}
        </Text>
      </td>
      <td>
        <Text small bold textAlign="right">
          <b>{data.currentAmountUsdDisplay}</b>
          <br />
          <Text fontSize="11px" italic textAlign="right">
            (${data.price.toFixed(2)}/{data.symbol})
          </Text>
        </Text>
      </td>
      <td>
        <PerfIndicator
          status={data.valueChangeStatus}
          usdDisplay={data.valueChangeUsdDisplay}
          percDisplay={data.valueChangePercDisplay}
          invertColors={isTokenIn}
        />
      </td>
    </tr>
  )
}

export const TokenPerfTable: React.FC<{
  tokensIn?: TokenWithTradeData[]
  tokensOut?: TokenWithTradeData[]
  isAggregate?: boolean
}> = ({ tokensIn, tokensOut, isAggregate }) => {
  const hasTokensIn = useMemo(() => tokensIn?.length > 0, [tokensIn?.length])
  return (
    <StyledTable>
      {hasTokensIn && (
        <>
          <thead>
            <tr>
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
            {tokensIn.map((tokenIn) => (
              <TokenRow key={tokenIn.address} data={tokenIn} isTokenIn isAggregate={isAggregate} />
            ))}
          </tbody>
        </>
      )}
      {tokensOut && tokensOut.length > 0 && (
        <>
          <thead>
            <tr>
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
              <TokenRow key={tokenOut.address} data={tokenOut} isAggregate={isAggregate} />
            ))}
          </tbody>
        </>
      )}
    </StyledTable>
  )
}
