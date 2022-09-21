import React from 'react'
import { Card } from 'components/Card'
import { ColumnStart, RowCenter, RowStart, Text } from 'uikit'
import { CellCol } from './styles'
import { ManuallyExecuteDCAButton } from 'components/ManuallyExecuteDCAButton'
import { useUpcomingDCAs } from 'state/hooks'

export const UpcomingExecutionsCard: React.FC = () => {
  const upcomingDCAs = useUpcomingDCAs()
  return (
    <Card title="Upcoming Executions" padding="24px" halfWidth>
      <CellCol>
        <ColumnStart gap="0px" width="100%">
          {upcomingDCAs.map((dateTime) => (
            <RowStart key={dateTime} gap="8px">
              <Text small>-</Text>
              <Text bold>{dateTime}</Text>
            </RowStart>
          ))}
          <Text bold>...</Text>
        </ColumnStart>
        <ColumnStart gap="18px" alignItems="flex-start">
          <Text small italic>
            Manually Execute a DCA immediately: (Does not interfere with automatic interval DCAs)
          </Text>
          <RowCenter>
            <ManuallyExecuteDCAButton />
          </RowCenter>
        </ColumnStart>
      </CellCol>
    </Card>
  )
}
