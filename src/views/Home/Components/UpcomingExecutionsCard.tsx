import React from 'react'
import { Card } from 'components/Card'
import { Text } from 'uikit'
import { CellCol } from './styles'

export const UpcomingExecutionsCard: React.FC = () => {

  return (
    <Card title="Upcoming Executions" padding="24px" halfWidth>
      <CellCol>
          <Text small italic>
            Current Position Status:
          </Text>
      </CellCol>
    </Card>
  )
}
