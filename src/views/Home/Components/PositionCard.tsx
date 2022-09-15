import React, { useMemo } from 'react'
import { Card } from 'components/Card'
import styled from 'styled-components'
import { TextWithChanged } from 'uikit'
import { OutsSelectionColumn } from 'components/Outs/OutsSelectionColumn'
import TokenAndAmountSelector from 'components/TokenAndAmountSelector'
import { useConfigurableAmountDCA, useConfigurableTokenIn, usePositionOuts } from 'state/hooks'
import { IntervalSelector } from 'components/IntervalSelector'
import { transparentize } from 'polished'

const CellRow = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
`

const CellCol = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`

const CellWithChanged = styled(CellCol)<{ changed?: boolean }>`
  background-color: ${({ theme, changed }) => (changed ? transparentize(0.8, theme.colors.warning) : 'transparent')};
  padding: 12px;
  width: 100%;
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
    <Card title="Position" padding='24px'>
      <CellRow>
        <CellCol>
          <CellWithChanged>
            <TextWithChanged small italic changed>
              DCA:
            </TextWithChanged>
            <TokenAndAmountSelector
              token={tokenIn}
              setToken={setTokenIn}
              value={amountDCA}
              setValue={setAmountDCA}
              disabledReasons={disabledReasons}
              tokenChanged
              amountChanged
            />
          </CellWithChanged>
          <CellWithChanged changed>
            <TextWithChanged small italic>
              Every:
            </TextWithChanged>
            <IntervalSelector />
          </CellWithChanged>
        </CellCol>
        <CellCol>
          <CellWithChanged>
            <TextWithChanged small italic ml="6px" changed>
              <pre>{'           '}</pre>Into:
            </TextWithChanged>
            <OutsSelectionColumn />
          </CellWithChanged>
        </CellCol>
      </CellRow>
    </Card>
  )
}
