import React, { useCallback } from 'react'
import { Flex, RowCenter, SummitButton, SummitPopUp, Text, TokenSymbolImage } from 'uikit'
import styled, { css } from 'styled-components'
import { pressableMixin } from 'uikit/util/styledMixins'
import { transparentize } from 'polished'
import { DCATransactionModal } from 'components/DCATransactionModal'
import { PerfIndicator } from './DataVis/PerfIndicator'
import { DCAStats, useUserDcasData } from 'state/statsHooks'
import { Card } from './Card'
import { Link } from 'react-router-dom'
import { useChartOptionsState } from 'views/Stats/components/chartOptionsState'

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
  .empty-row {
    height: 56px;
    align-items: center;
    justify-content: center;
  }
  & .row:not(.head):nth-child(odd) {
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
  grid-columns: 3 / fill;
  grid-template-columns: min-content min-content min-content;
  gap: 6px;

  ${({ theme }) => theme.mediaQueries.invNav} {
    display: flex;
    flex-wrap: wrap;
  }
`

const PastDcaRow: React.FC<{ dca: DCAStats; openModal: (hash: string) => void; censorable: boolean }> = ({
  dca,
  openModal,
  censorable,
}) => {
  const handleOpenModal = useCallback(() => openModal(dca.txHash), [dca.txHash, openModal])
  return (
    <Row className="row" onClick={handleOpenModal}>
      <div className="item item_1">
        <Text bold>{dca.timestampDisplay}</Text>
      </div>
      <div className="item item_2">
        <PerfIndicator {...dca.totalValueChange} censorable={censorable} gap="6px" mobileInline />
      </div>

      <div className="item item_3">
        <OutsGrid>
          <Flex alignItems="center" gap="2px">
            <Text bold small>
              {censorable ? dca.inToken.trade.censorableUsdDisplay : dca.inToken.trade.usdDisplay}
            </Text>
            <TokenSymbolImage symbol={dca.inToken.symbol} width={24} height={24} />
          </Flex>
          <Text small mx="8px">
            {'>>'}
          </Text>
          <OutsTokenGrid>
            {dca.outTokens.map((outToken) => (
              <Flex alignItems="center" gap="2px" key={outToken.address}>
                <Text bold small>
                  {censorable ? outToken.trade.censorableUsdDisplay : outToken.trade.usdDisplay}
                </Text>
                <TokenSymbolImage symbol={outToken.symbol} width={24} height={24} />
              </Flex>
            ))}
          </OutsTokenGrid>
        </OutsGrid>
      </div>
    </Row>
  )
}

export const PastDcasTable: React.FC<{ includeStatsLink?: boolean; censorable?: boolean }> = ({
  includeStatsLink = false,
  censorable = false,
}) => {
  const censored = useChartOptionsState((state) => state.censored)
  const dcasData = useUserDcasData(censorable && censored)
  const [modalDcaHash, setModalDcaHash] = React.useState<string | null>(null)
  const hideTxModal = useCallback(() => setModalDcaHash(null), [])
  const openUserTxModal = useCallback((hash: string) => {
    setModalDcaHash(hash)
  }, [])

  return (
    <Card title="Executed DCAs" padding="24px">
      <Table>
        <div className="row head">
          <div className="item item_1">
            <Text small italic>
              Date
            </Text>
          </div>
          <div className="item item_2">
            <Text small italic>
              DCA Performance
            </Text>
          </div>
          <div className="item item_3">
            <Text small italic>
              Trade Breakdown
            </Text>
          </div>
        </div>
        <div className="body">
          {dcasData != null && dcasData.length > 0 ? (
            <>
              {dcasData.map((dca) => (
                <PastDcaRow dca={dca} key={dca.txHash} openModal={openUserTxModal} censorable={censorable} />
              ))}
            </>
          ) : (
            <Text className="row empty-row">No Executed DCAs found</Text>
          )}
        </div>
      </Table>
      {includeStatsLink && (
        <RowCenter>
          <SummitButton as={Link} to="/stats">
            Open Full Stats
          </SummitButton>
        </RowCenter>
      )}
      <SummitPopUp
        open={modalDcaHash != null}
        callOnDismiss={hideTxModal}
        popUpTitle="DCA Transaction Details"
        popUpContent={
          modalDcaHash != null && (
            <DCATransactionModal dca={dcasData.find(({ txHash }) => txHash === modalDcaHash)} onDismiss={hideTxModal} />
          )
        }
      />
    </Card>
  )
}
