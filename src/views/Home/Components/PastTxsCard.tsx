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

const Table = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  .head {
    border-bottom: 1px dashed ${({ theme }) => theme.colors.text};
  }
  .body {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-height: 400px;
    overflow-y: scroll;
  }
  .row {
    display: flex;
    flex-direction: row;
    width: 100%;
    flex-wrap: wrap;
  }
  & .row:nth-child(even) {
    background-color: ${({ theme }) => transparentize(0.95, theme.colors.text)};
  }

  .item {
    display: flex;
    padding: 6px;
    align-items: center;
    flex: 1;
  }
  .item_1 {
    display: flex;
    flex-basis: 22%;
    justify-content: flex-start;
  }
  .item_2 {
    display: flex;
    flex-basis: 22%;
    justify-content: flex-end;
  }
  .item_3 {
    display: flex;
    flex-basis: 56%;
    justify-content: flex-end;
  }

  ${({ theme }) => theme.mediaQueries.invNav} {
    .item_1 {
      flex-basis: 0;
      min-width: 150px;
      flex: unset;
    }
    .item_2 {
      flex-basis: 0;
      min-width: 150px;
      justify-content: flex-start;
    }
    .item_3 {
      flex-basis: 100%;
      justify-content: flex-start;
    }
  }
`

const Row = styled.div`
  ${({ theme }) =>
    pressableMixin({
      theme,
      hoverStyles: css`
        background-color: ${transparentize(0.85, theme.colors.text)} !important;
      `,
    })};
`

const DesktopVerticalText = styled(Text)`
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.invNav} {
    flex-direction: row;
    gap: 8px;
  }
`

const OutsGrid = styled.div`
  display: grid;
  grid-template-columns: min-content min-content min-content;
  gap: 6px;
  justify-items: center;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.invNav} {
    display: flex;
  }
`

const OutsTokenGrid = styled.div`
  display: grid;
  grid-columns: 3/fill;
  grid-template-columns: min-content min-content min-content;
  gap: 6px;


  ${({ theme }) => theme.mediaQueries.invNav} {
    display: flex;
    flex-wrap: wrap;
  }
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
    <Row className="row" onClick={handleOpenModal}>
      <div className="item item_1">
        <Text bold>{timestampDisplay}</Text>
      </div>
      <div className="item item_2">
        <FlexText color={ValueChangeStatusColor[valueChangeStatus]}>
          {ValueChangeStatusIcon[valueChangeStatus]}
          <DesktopVerticalText color={ValueChangeStatusColor[valueChangeStatus]}>
            <b>{valueChangeUsdDisplay}</b>
            <i>{valueChangePercDisplay}</i>
          </DesktopVerticalText>
        </FlexText>
      </div>

      <div className="item item_3">
        <OutsGrid>
          <Flex alignItems="center" gap="2px">
            <Text bold>{tokenInData.tradeAmountUsdDisplay}</Text>
            <TokenSymbolImage symbol={tokenInData.symbol} width={24} height={24} />
          </Flex>
          <Text small mx="8px">
            {'>>'}
          </Text>
          <OutsTokenGrid>
            {tokenTxsData.map((tokenTx) => (
              <Flex alignItems="center" gap="2px" key={tokenTx.address}>
                <Text bold>{tokenTx.tradeAmountUsdDisplay}</Text>
                <TokenSymbolImage key={tokenTx.tokenOut} symbol={tokenTx.symbol} width={24} height={24} />
              </Flex>
            ))}
          </OutsTokenGrid>
        </OutsGrid>
      </div>
    </Row>
  )
}

export const PastTxsCard: React.FC = () => {
  const { txs: userTxsWithDisplayData } = useUserTxsWithDisplayData()
  const [modalTxIndex, setModalTxIndex] = React.useState<number | null>(null)
  const hideTxModal = useCallback(() => setModalTxIndex(null), [])
  const openUserTxModal = useCallback((i: number) => {
    setModalTxIndex(i)
  }, [])

  return (
    <Card title="Executed DCAs" padding="24px">
      <CellCol>
        <Table>
          <div className="row head">
            <div className="item item_1">
              <Text small>Date</Text>
            </div>
            <div className="item item_2">
              <Text small>DCA Performance</Text>
            </div>
            <div className="item item_3">
              <Text small>Trade Breakdown</Text>
            </div>
          </div>
          <div className="body">
            {userTxsWithDisplayData != null &&
              userTxsWithDisplayData.map((userTx, i) => (
                <PastTxCard tx={userTx} key={userTx.timestamp} index={i} openModal={openUserTxModal} />
              ))}
          </div>
        </Table>
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
