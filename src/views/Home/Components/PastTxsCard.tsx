import React from 'react'
import { Card } from 'components/Card'
import { CellCol } from './styles'
import { useUserTxsWithDisplayData } from 'state/uiHooks'
import { PastTxsTable } from 'components/PastTxsTable'
import { DerivedStatsTable } from 'components/DerivedStatsTable'

export const PastTxsCard: React.FC = () => {
  const { txs, derived } = useUserTxsWithDisplayData()

  return (
    <>
      <Card title="Your Involica Stats" padding="24px">
        <DerivedStatsTable derived={derived} />
      </Card>
      <Card title="Executed DCAs" padding="24px">
        <CellCol>
          <PastTxsTable txs={txs} />
        </CellCol>
      </Card>
    </>
  )
}
