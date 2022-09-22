import React from 'react'
import { Card } from 'components/Card'
import { Column, RowBetween, SummitButton, Text } from 'uikit'
import { CellCol } from './styles'
import { usePositionStatus } from 'state/hooks'
import { SetAllowanceButton } from 'components/SetAllowanceModal'
import { Link } from 'react-router-dom'
import { TopUpFundsButton } from 'components/TopUpFundsModal'
import { TimeUntilNextDca } from 'components/TimeUntilNextDca'
import { ManagePositionButton } from 'components/ManagePositionModal'
import { ManuallyExecuteDCAButton } from 'components/ManuallyExecuteDCAButton'
import { DCAsRemaining } from 'components/DCAsRemaining'
import { PositionStatusRecord, PositionStatus, StatusColor, StatusType, StatusString } from 'state/status'

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
