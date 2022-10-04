import React from 'react'
import { Card } from 'components/Card'
import { CellCol } from './styles'
import { PastDcasTable } from 'components/PastDcasTable'
import { DerivedStatsTable } from 'components/DerivedStatsTable'

export const PastDcasCard: React.FC = () => {
  return (
    <>
      <Card title="Your Involica Stats" padding="24px">
        <DerivedStatsTable />
      </Card>
      <Card title="Executed DCAs" padding="24px">
        <CellCol>
          <PastDcasTable />
        </CellCol>
      </Card>
    </>
  )
}
