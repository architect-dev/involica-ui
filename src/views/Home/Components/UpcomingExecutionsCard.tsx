import React from 'react'
import { Card } from 'components/Card'
import { ColumnStart, RowCenter, SummitButton, Text } from 'uikit'
import { CellCol } from './styles'
import { useManuallyExecuteDCA } from 'hooks/useExecute'
import { useAllowanceIsSufficient } from 'state/hooks'

export const UpcomingExecutionsCard: React.FC = () => {
  const { onManuallyExecuteDCA, pending } = useManuallyExecuteDCA()
  const allowanceIsSufficient = useAllowanceIsSufficient()

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
            <ColumnStart alignItems='center' gap='4px'>
              <SummitButton
                onClick={onManuallyExecuteDCA}
                isLoading={pending}
                disabled={!allowanceIsSufficient}
                activeText="Manually Execute DCA"
                loadingText="Executing DCA"
              />
              {!allowanceIsSufficient && (
                <Text small italic red>
                  Insufficient Allowance
                </Text>
              )}
            </ColumnStart>
          </RowCenter>
        </ColumnStart>
      </CellCol>
    </Card>
  )
}
