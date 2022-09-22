import React from 'react'
import { SummitButton, Text, RowBetween, RowCenter, TokenSymbolImage, Flex } from 'uikit'
import { ModalContentContainer } from 'uikit/widgets/Popup/SummitPopUp'
import { TokenWithTradeData, UserTxWithTradeData } from 'state/uiHooks'
import styled from 'styled-components'
import { InvValueChangeStatusColor, ValueChangeStatusColor, ValueChangeStatusIcon } from 'state/status'

const StyledTable = styled.table`
  border: 1px solid ${({ theme }) => theme.colors.text};
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

const TokenRow: React.FC<{ data: TokenWithTradeData; isTokenIn?: boolean }> = ({ data, isTokenIn = false }) => {
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
          <br />
          <i>
            (${data.tradePrice.toFixed(2)}/{data.symbol})
          </i>
        </Text>
      </td>
      <td>
        <Text small bold textAlign="right">
          <b>{data.currentAmountUsdDisplay}</b>
          <br />
          <i>
            (${data.price.toFixed(2)}/{data.symbol})
          </i>
        </Text>
      </td>
      <td>
        <Flex alignItems="center" justifyContent="flex-end">
          <Text color={(isTokenIn ? InvValueChangeStatusColor : ValueChangeStatusColor)[data.valueChangeStatus]}>
            {ValueChangeStatusIcon[data.valueChangeStatus]}
          </Text>
          <Text
            small
            textAlign="right"
            color={(isTokenIn ? InvValueChangeStatusColor : ValueChangeStatusColor)[data.valueChangeStatus]}
          >
            <b>{data.valueChangeUsdDisplay}</b>
            <br />
            <i>({data.valueChangePercDisplay})</i>
          </Text>
        </Flex>
      </td>
    </tr>
  )
}

export const DCATransactionModal: React.FC<{
  tx: UserTxWithTradeData
  onDismiss?: () => void
}> = ({ tx, onDismiss }) => {
  const {
    tokenInData,
    tokenTxsData,
    timestampDisplay,
    valueChangeStatus,
    valueChangeUsdDisplay,
    valueChangePercDisplay,
  } = tx

  return (
    <ModalContentContainer alignItems="flex-start" minWidth="300px" maxWidth="450px" gap="18px">
      <RowBetween px="6px">
        <Text small italic>
          Executed:
        </Text>
        <Text bold>{timestampDisplay}</Text>
      </RowBetween>

      {/* TODO: Add Tx Hash
      <RowBetween px='6px'>
        <Text small italic>
          Tx Hash:
        </Text>
        <Text bold>{timestampDisplay}</Text>
      </RowBetween> */}

      <StyledTable>
        <thead>
          <tr>
            <th>
              <Text italic small>
                Token In
              </Text>
            </th>
            <th>
              <Text italic small textAlign="right">
                Trade Val
              </Text>
            </th>
            <th>
              <Text italic small textAlign="right">
                Current Val
              </Text>
            </th>
            <th>
              <Text italic small textAlign="right">
                Performance
              </Text>
            </th>
          </tr>
        </thead>
        <tbody>
          <TokenRow data={tokenInData} isTokenIn />
        </tbody>
        <thead>
          <tr>
            <StyledSecondRowTh>
              <Text italic small>
                Tokens Out
              </Text>
            </StyledSecondRowTh>
          </tr>
        </thead>
        <tbody>
          {tokenTxsData.map((tokenTx) => (
            <TokenRow key={tokenTx.address} data={tokenTx} />
          ))}
        </tbody>
      </StyledTable>

      <RowBetween px="6px">
        <Text small italic>
          Total DCA Performance:
        </Text>
        <Flex alignItems="center" justifyContent="flex-end">
          <Text color={ValueChangeStatusColor[valueChangeStatus]}>{ValueChangeStatusIcon[valueChangeStatus]}</Text>
          <Text small textAlign="right" color={ValueChangeStatusColor[valueChangeStatus]}>
            <b>{valueChangeUsdDisplay}</b>
            <br />
            <i>({valueChangePercDisplay})</i>
          </Text>
        </Flex>
      </RowBetween>

      <br />

      <RowCenter gap="18px">
        <SummitButton onClick={onDismiss} activeText="Close" />
      </RowCenter>
    </ModalContentContainer>
  )
}
