import React from 'react'
import { Card } from 'components/Card'
import { Column, RowBetween, SummitButton, Text } from 'uikit'
import { CellCol } from './styles'
import { PositionStatus, PositionStatusRecord, usePositionStatus } from 'state/hooks'
import { SetAllowanceButton } from 'components/SetAllowanceModal'
import { Link } from 'react-router-dom'
import { TopUpFundsButton } from 'components/TopUpFundsModal'
import { TimeUntilNextDca } from 'components/TimeUntilNextDca'
import { ManagePositionButton } from 'components/ManagePositionModal'
import { ManuallyExecuteDCAButton } from 'components/ManuallyExecuteDCAButton'
import { DCAsRemaining } from 'components/DCAsRemaining'

const StatusString: PositionStatusRecord<React.ReactNode> = {
  [PositionStatus.Active]: 'Active',
  [PositionStatus.ActiveManualOnly]: 'Manual DCAs Only',

  [PositionStatus.WarnPaused]: 'Paused',
  [PositionStatus.WarnGasFunds]: 'Warning: Gas Funds Low',

  [PositionStatus.NoPosition]: 'No Position',
  [PositionStatus.ErrorNoDcaAmount]: 'No Amount to DCA Set',
  [PositionStatus.ErrorGasFunds]: 'Out of Gas Funds',
  [PositionStatus.ErrorInsufficientAllowance]: (
    <>
      Insufficient
      <br />
      Allowance
    </>
  ),
  [PositionStatus.ErrorInsufficientBalance]: (
    <>
      Insufficient
      <br />
      Wallet Balance
    </>
  ),
}

enum PositionStatusType {
  Default,
  Active,
  Warning,
  Error,
}

const StatusType: PositionStatusRecord<PositionStatusType> = {
  [PositionStatus.NoPosition]: PositionStatusType.Default,
  [PositionStatus.Active]: PositionStatusType.Active,
  [PositionStatus.ActiveManualOnly]: PositionStatusType.Active,

  [PositionStatus.WarnPaused]: PositionStatusType.Warning,
  [PositionStatus.WarnGasFunds]: PositionStatusType.Warning,

  [PositionStatus.ErrorNoDcaAmount]: PositionStatusType.Error,
  [PositionStatus.ErrorGasFunds]: PositionStatusType.Error,
  [PositionStatus.ErrorInsufficientAllowance]: PositionStatusType.Error,
  [PositionStatus.ErrorInsufficientBalance]: PositionStatusType.Error,
}

const StatusColor: Record<PositionStatusType, string> = {
  [PositionStatusType.Default]: 'text',
  [PositionStatusType.Active]: 'success',
  [PositionStatusType.Warning]: 'warning',
  [PositionStatusType.Error]: 'failure',
}

const StatusAction: PositionStatusRecord<React.ReactNode> = {
  [PositionStatus.Active]: (
    <>
    <RowBetween>
      <Text small italic>
        Next DCA In:
      </Text>
      <TimeUntilNextDca />
    </RowBetween>
    <RowBetween>
      <Text small italic>
        DCAs Remaining:
      </Text>
      <DCAsRemaining />
    </RowBetween>
    </>
  ),
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
    <Card title="Status" padding="24px" halfWidth>
      <CellCol justifyContent="space-between">
        <RowBetween>
          <Text small italic>
            Position Status:
          </Text>
          <Text bold color={StatusColor[StatusType[status]]} italic textAlign="right">
            {StatusString[status]}
          </Text>
        </RowBetween>
        <Column gap="8px" alignItems="center" width="100%" mt="12px">
          {StatusAction[status]}
        </Column>
      </CellCol>
    </Card>
  )
}
