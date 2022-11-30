import React from 'react'
import { Card } from 'components/Card'
import { Column, SummitButton, Text } from 'uikit'
import { CellCol } from './styles'
import { usePositionStatus } from 'state/hooks'
import { SetAllowanceButton } from 'components/SetAllowanceModal'
import { Link } from 'react-router-dom'
import { TopUpFundsButton } from 'components/FundsManagement/TopUpFundsModal'
import { ManagePositionButton } from 'components/ManagePositionModal'
import { ManuallyExecuteDCAButton } from 'components/ManuallyExecuteDCAButton'
import { PositionStatusRecord, PositionStatus, StatusColor, StatusType, StatusString } from 'state/status'
import { DataRow } from 'components/DataRow'
import { ActiveStatusContent } from './ActiveStatusContent'

const StatusAction: PositionStatusRecord<React.ReactNode> = {
  [PositionStatus.Active]: <ActiveStatusContent />,
  [PositionStatus.ActiveManualOnly]: <ManuallyExecuteDCAButton />,

  [PositionStatus.WarnPaused]: <ManagePositionButton unpauseOnly />,
  [PositionStatus.WarnGasFunds]: <TopUpFundsButton />,

  [PositionStatus.NoPosition]: (
    <>
      <Text small italic bold>
        Create Position Below
      </Text>
      <Text small italic>
        - or -
      </Text>
      <SummitButton as={Link} to="/tutorial">
        Open Involica Tutorial
      </SummitButton>
    </>
  ),
  [PositionStatus.ErrorNoDcaAmount]: (
    <Text small italic bold>
      Set Amount to DCA Below
    </Text>
  ),
  [PositionStatus.ErrorGasFunds]: <TopUpFundsButton />,
  [PositionStatus.ErrorInsufficientAllowance]: <SetAllowanceButton buttonText="Increase Allowance" />,
  [PositionStatus.ErrorInsufficientBalance]: (
    <Text small italic bold textAlign="center">
      Top up Wallet
      <br />
      DCA will Restart Immediately
    </Text>
  ),
}

export const PositionStatusCard: React.FC = () => {
  const status = usePositionStatus()

  return (
    <Card title="Position Status" padding="24px" halfWidth>
      <CellCol justifyContent="space-between">
        <DataRow
          t="Status:"
          v={
            <Text bold color={StatusColor[StatusType[status]]} textAlign="right">
              {StatusString[status]}
            </Text>
          }
        />
        <Column gap="8px" alignItems="center" width="100%" mt="12px">
          {StatusAction[status]}
        </Column>
      </CellCol>
    </Card>
  )
}
