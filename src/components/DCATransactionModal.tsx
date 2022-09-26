import React from 'react'
import { SummitButton, RowCenter } from 'uikit'
import { ModalContentContainer } from 'uikit/widgets/Popup/SummitPopUp'
import { UserTxWithTradeData } from 'state/uiHooks'
import { DataRow } from './DataRow'
import { PerfIndicator } from './DataVis/PerfIndicator'
import { TokenPerfTable } from './DataVis/TokenPerfTable'

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
      <DataRow px="6px" t="Executed:" v={timestampDisplay} />

      {/* TODO: Add Tx Hash
      <DataRow px='6px' t='Tx Hash:' v={tx.hash} />
      */}
      
      <TokenPerfTable
        tokensIn={[tokenInData]}
        tokensOut={tokenTxsData}
      />

      <DataRow
        px="6px"
        t="Total DCA Performance:"
        v={
          <PerfIndicator
            status={valueChangeStatus}
            usdDisplay={valueChangeUsdDisplay}
            percDisplay={valueChangePercDisplay}
          />
        }
      />

      <br />

      <RowCenter gap="18px">
        <SummitButton onClick={onDismiss} activeText="Close" />
      </RowCenter>
    </ModalContentContainer>
  )
}
