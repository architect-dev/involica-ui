import React, { useMemo } from 'react'
import { Card } from 'components/Card'
import styled from 'styled-components'
import { Text } from 'uikit'
import { OutsSelectionColumn } from 'components/Outs/OutsSelectionColumn'
import TokenAndAmountSelector from 'components/TokenAndAmountSelector'
import { useConfigurableAmountDCA, useConfigurableTokenIn, usePositionOuts } from 'state/hooks'

const CellRow = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
`

const Cell = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 24px;
`

export const PositionCard: React.FC = () => {
  const { tokenIn, setTokenIn } = useConfigurableTokenIn()
  const { outs } = usePositionOuts()
  const { amountDCA, setAmountDCA } = useConfigurableAmountDCA()

  const disabledReasons = useMemo(() => {
    const reasons = {}
    if (tokenIn != null) reasons[tokenIn] = 'Selected'
    ;(outs ?? []).forEach((out) => {
      reasons[out.token] = 'Used as DCA out'
    })
    return reasons
  }, [outs, tokenIn])

  return (
    <Card title="In">
      <CellRow>
        <Cell>
          <Text small italic>DCA:</Text>
          <TokenAndAmountSelector
            token={tokenIn}
            setToken={setTokenIn}
            value={amountDCA}
            setValue={setAmountDCA}
            disabledReasons={disabledReasons}
          />
          <Text small italic>Every:</Text>
        </Cell>
        <Cell>
          <Text small italic ml='6px'><pre>{'           Into:'}</pre></Text>
          <OutsSelectionColumn />
        </Cell>
      </CellRow>
    </Card>
  )
}
