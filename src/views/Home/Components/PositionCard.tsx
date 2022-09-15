import React, { useMemo } from 'react'
import { Card } from 'components/Card'
import styled from 'styled-components'
import { TextWithChanged } from 'uikit'
import { OutsSelectionColumn } from 'components/Outs/OutsSelectionColumn'
import TokenAndAmountSelector from 'components/TokenAndAmountSelector'
import { useConfigurableAmountDCA, useConfigurableTokenIn, usePositionOuts } from 'state/hooks'
import { IntervalSelector } from 'components/IntervalSelector'
import { WeightsSlider } from 'components/Outs/WeightsSlider'
import { CellCol, CellWithChanged, DesktopOnlyPre } from './styles'

const CellRow = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  gap: 18px;
  flex-wrap: wrap;
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
    <Card title="Position" padding="24px">
      <CellRow>
        <CellCol>
          <CellWithChanged changed>
            <TextWithChanged small italic changed>
              Token:
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
              Interval:
            </TextWithChanged>
            <IntervalSelector />
          </CellWithChanged>
        </CellCol>
        <CellCol>
          <CellWithChanged changed>
            <TextWithChanged small italic changed>
              <DesktopOnlyPre>{'         '}</DesktopOnlyPre>DCA Into:
            </TextWithChanged>
            <OutsSelectionColumn />
          </CellWithChanged>
        </CellCol>
      </CellRow>
      <CellRow>
        <CellWithChanged changed>
          <TextWithChanged small italic changed>
            DCA Weighting:
          </TextWithChanged>
          <WeightsSlider />
        </CellWithChanged>
      </CellRow>
    </Card>
  )
}
