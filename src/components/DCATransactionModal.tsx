import React from 'react'
import { SummitButton, RowCenter, LinkExternal } from 'uikit'
import { ModalContentContainer } from 'uikit/widgets/Popup/SummitPopUp'
import { DataRow } from '../uikit/components/DataRow'
import { PerfIndicator } from './DataVis/PerfIndicator'
import { TokenPerfTable } from './DataVis/TokenPerfTable'
import { DCAStats } from 'state/statsHooks'
import { getLinks } from 'config/constants'

export const DCATransactionModal: React.FC<{
  dca: DCAStats
  onDismiss?: () => void
}> = ({ dca, onDismiss }) => {
  const txHashEllipsis = dca.txHash ? `${dca.txHash.substring(0, 4)}...${dca.txHash.substring(dca.txHash.length - 4)}` : null

  return (
    <ModalContentContainer alignItems="flex-start" minWidth="300px" maxWidth="450px" gap="18px">
      <DataRow px='6px' t='Tx Hash:' v={
        <LinkExternal href={`${getLinks().etherscan}/tx/${dca.txHash}`}>{txHashEllipsis}</LinkExternal>
      } />
      <DataRow px="6px" t="Executed:" v={dca.timestampDisplay} />
      
      <TokenPerfTable
        tokensIn={[dca.inToken]}
        tokensOut={dca.outTokens}
      />

      <DataRow
        px="6px"
        t="Total DCA Performance:"
        v={
          <PerfIndicator
            {...dca.totalValueChange}
          />
        }
      />

      <br />

      <RowCenter gap="18px">
        <SummitButton onClick={onDismiss} activeText="Close" variant="secondary" />
      </RowCenter>
    </ModalContentContainer>
  )
}
