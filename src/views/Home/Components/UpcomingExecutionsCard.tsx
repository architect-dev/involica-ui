import React from 'react'
import { Card } from 'components/Card'
import { ColumnStart, RowCenter, RowStart, Text } from 'uikit'
import { CellCol } from './styles'
import { ManuallyExecuteDCAButton } from 'components/ManuallyExecuteDCAButton'
import { usePositionStatus, useUpcomingDCAs } from 'state/hooks'
import { PositionStatus, StatusColor, StatusType, StatusString } from 'state/status'

export const UpcomingExecutionsCard: React.FC = () => {
  const upcomingDCAs = useUpcomingDCAs()
  const status = usePositionStatus()

  return (
    <Card title="Scheduled Executions" padding="24px" halfWidth>
      <CellCol>
        <ColumnStart gap="0px" width="100%">
          {status === PositionStatus.Active &&
            upcomingDCAs != null &&
            upcomingDCAs.map((dateTime) => (
              <RowStart key={dateTime} gap="8px">
                <Text small>-</Text>
                <Text bold>{dateTime}</Text>
              </RowStart>
            ))}
          {status === PositionStatus.Active && upcomingDCAs != null && <Text bold>...</Text>}
          {status !== PositionStatus.Active &&
          <>
            <Text>No Upcoming Executions:</Text>
            <Text color={StatusColor[StatusType[status]]}>Position Status: <b>{StatusString[status]}</b></Text>
          </>
          }
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
