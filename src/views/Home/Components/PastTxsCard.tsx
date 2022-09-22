import React, { useCallback } from 'react'
import { Flex, SummitPopUp, Text, TokenSymbolImage } from 'uikit'
import { Card } from 'components/Card'
import { CellCol } from './styles'
import styled, { css } from 'styled-components'
import { UserTxWithTradeData, useUserTxsWithDisplayData } from 'state/uiHooks'
import { pressableMixin } from 'uikit/util/styledMixins'
import { transparentize } from 'polished'
import { DCATransactionModal } from 'components/DCATransactionModal'
import { ValueChangeStatusColor, ValueChangeStatusIcon } from 'state/status'

const FlexText = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  line-height: 14px;
  text-align: right;
`

const StyledTable = styled.table`
  width: 100%;
`
const StyledTh = styled.th`
  vertical-align: middle;
`
const StyledThead = styled.thead`
  height: 48px;
  border-bottom: 1px dashed ${({ theme }) => theme.colors.text};
`
const StyledTr = styled.tr`
  height: 48px;
  ${({ theme }) =>
    pressableMixin({
      theme,
      hoverStyles: css`
        background-color: ${transparentize(0.9, theme.colors.text)};
      `,
    })};
`
const StyledTd = styled.td`
  vertical-align: middle;
`

const TokensWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 210px;
  gap: 2px 6px;
`

const PastTxCard: React.FC<{ tx: UserTxWithTradeData; index: number; openModal: (index: number) => void }> = ({
  tx,
  index,
  openModal,
}) => {
  const {
    timestampDisplay,
    tokenInData,
    tokenTxsData,
    valueChangeStatus,
    valueChangeUsdDisplay,
    valueChangePercDisplay,
  } = tx
  const handleOpenModal = useCallback(() => openModal(index), [index, openModal])
  return (
    <StyledTr onClick={handleOpenModal}>
      <StyledTd>
        <Text bold pl="8px">
          {timestampDisplay}
        </Text>
      </StyledTd>
      <StyledTd>
        <FlexText color={ValueChangeStatusColor[valueChangeStatus]}>
          {ValueChangeStatusIcon[valueChangeStatus]}
          <Text color={ValueChangeStatusColor[valueChangeStatus]}>
            <b>{valueChangeUsdDisplay}</b>
            <br />
            <i>{valueChangePercDisplay}</i>
          </Text>
        </FlexText>
      </StyledTd>

      <StyledTd>
        <Flex gap="6px" alignItems="center" justifyContent="flex-end" pr="8px">
          <Flex alignItems="center" gap="2px">
            <Text bold>{tokenInData.tradeAmountUsdDisplay}</Text>
            <TokenSymbolImage symbol={tokenInData.symbol} width={24} height={24} />
          </Flex>
          <Text small mx="8px">
            {'>>'}
          </Text>
          <TokensWrapper>
          {tokenTxsData.map((tokenTx, i) => (
            <Flex alignItems="center" gap="2px" key={tokenTx.address}>
              <Text bold>{tokenTx.tradeAmountUsdDisplay}</Text>
              <TokenSymbolImage key={tokenTx.tokenOut} symbol={tokenTx.symbol} width={24} height={24} />
            </Flex>
          ))}
          </TokensWrapper>
        </Flex>
      </StyledTd>
    </StyledTr>
  )
}

export const PastTxsCard: React.FC = () => {
  const userTxsWithDisplayData = useUserTxsWithDisplayData()
  const [modalTxIndex, setModalTxIndex] = React.useState<number | null>(null)
  const hideTxModal = useCallback(() => setModalTxIndex(null), [])
  const openUserTxModal = useCallback((i: number) => {
    setModalTxIndex(i)
  }, [])

  return (
    <Card title="Executed DCAs" padding="24px">
      <CellCol>
        <StyledTable>
          <StyledThead>
            <tr>
              <StyledTh>
                <Text small pl="8px">
                  Date
                </Text>
              </StyledTh>
              <StyledTh>
                <Text small textAlign="right">
                  DCA Performance
                </Text>
              </StyledTh>
              <StyledTh>
                <Text small textAlign="right" pr="8px">
                  Trade Breakdown
                </Text>
              </StyledTh>
            </tr>
          </StyledThead>
          <tbody>
            {userTxsWithDisplayData != null &&
              userTxsWithDisplayData.map((userTx, i) => (
                <PastTxCard tx={userTx} key={userTx.timestamp} index={i} openModal={openUserTxModal} />
              ))}
          </tbody>
        </StyledTable>
      </CellCol>
      <SummitPopUp
        open={modalTxIndex != null}
        callOnDismiss={hideTxModal}
        popUpTitle="DCA Transaction Details"
        popUpContent={
          modalTxIndex != null && (
            <DCATransactionModal tx={userTxsWithDisplayData[modalTxIndex]} onDismiss={hideTxModal} />
          )
        }
      />
    </Card>
  )
}
