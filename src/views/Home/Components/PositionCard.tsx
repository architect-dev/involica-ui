import React from 'react'
import { RowStart, Text } from 'uikit'
import { Card } from 'components/Card'
import { OutsSelectionAndWeights } from 'components/Outs/OutsSelectionAndWeights'
import { TokenInSelector } from 'components/TokenSelect/TokenInSelector'

export const PositionCard: React.FC = () => {
  return (
    <Card title="Position">
      <RowStart>
        <TokenInSelector />
      </RowStart>
      <Text>v v v v v v v v v</Text>
      <OutsSelectionAndWeights />
    </Card>
  )
}
