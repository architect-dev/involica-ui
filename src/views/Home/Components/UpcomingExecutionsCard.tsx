import React from 'react'
import { Card } from 'components/Card'
import { ColumnStart, RowCenter, Text } from 'uikit'
import { CellCol } from './styles'
import { ManuallyExecuteDCAButton } from 'components/ManuallyExecuteDCAButton'

export const UpcomingExecutionsCard: React.FC = () => {
  return (
    <Card title="Upcoming Executions" padding="24px" halfWidth>
      <CellCol>
        <Text small italic>
          Current Position Status:
        </Text>
        <ColumnStart gap="18px" alignItems="flex-start">
          <Text small italic>
            Manually Execute a DCA immediately: (Does not interfere with automatic interval DCAs)
          </Text>
          <RowCenter>
            <ManuallyExecuteDCAButton/>
          </RowCenter>
        </ColumnStart>
      </CellCol>
    </Card>
  )
}
