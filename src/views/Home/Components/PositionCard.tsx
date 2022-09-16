import React, { useMemo } from 'react'
import { Card } from 'components/Card'
import styled from 'styled-components'
import { Column, RowBetween, TextWithChanged } from 'uikit'
import TokenAndAmountSelector from 'components/TokenAndAmountSelector'
import {
  useConfigurableAmountDCA,
  useConfigurableTokenIn,
  usePositionIntervalDCA,
  usePositionMaxGasPrice,
  usePositionOuts,
} from 'state/hooks'
import { IntervalSelector } from 'components/IntervalSelector'
import { CellCol, CellWithChanged } from './styles'
import { EditMaxGasPriceButton } from 'components/EditMaxGasPriceModal'
import { useIntervalStrings } from 'state/uiHooks'
import { OutsSelectionAndWeights } from 'components/Outs/OutsSelectionAndWeights'

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

const TokenInCell: React.FC = () => {
  const { dirty: tokenInDirty, tokenIn, setTokenIn } = useConfigurableTokenIn()
  const { outs } = usePositionOuts()
  const { dirty: amountDCADirty, amountDCA, setAmountDCA } = useConfigurableAmountDCA()

  const disabledReasons = useMemo(() => {
    const reasons = {}
    if (tokenIn != null) reasons[tokenIn] = 'Selected'
    ;(outs ?? []).forEach((out) => {
      reasons[out.token] = 'Used as DCA out'
    })
    return reasons
  }, [outs, tokenIn])

  return (
    <CellWithChanged changed={tokenInDirty || amountDCADirty}>
      <TextWithChanged small italic changed={tokenInDirty || amountDCADirty}>
        Token:
      </TextWithChanged>
      <TokenAndAmountSelector
        token={tokenIn}
        setToken={setTokenIn}
        value={amountDCA}
        setValue={setAmountDCA}
        disabledReasons={disabledReasons}
        tokenChanged={tokenInDirty}
        amountChanged={amountDCADirty}
      />
    </CellWithChanged>
  )
}

const OptionsCell: React.FC = () => {
  const { dirty: intervalDirty } = usePositionIntervalDCA()
  const { dirty: maxGasPriceDirty } = usePositionMaxGasPrice()
  const { intervalStringly } = useIntervalStrings()
  return (
    <CellWithChanged changed={intervalDirty || maxGasPriceDirty}>
      <TextWithChanged small italic changed={intervalDirty || maxGasPriceDirty}>
        DCA Options:
      </TextWithChanged>
      <Column width="100%" gap='4px'>
        <RowBetween>
        <TextWithChanged small italic changed={intervalDirty} asterisk>
          Interval:
        </TextWithChanged>
        <TextWithChanged bold changed={intervalDirty} asterisk>
          {intervalStringly}
        </TextWithChanged>
        </RowBetween>
        <IntervalSelector />
      </Column>
      <RowBetween>
        <TextWithChanged small italic changed={maxGasPriceDirty} asterisk>
          Max Gas Price:
        </TextWithChanged>
        <EditMaxGasPriceButton />
      </RowBetween>
    </CellWithChanged>
  )
}

const OutsCell: React.FC = () => {
  const { dirty } = usePositionOuts()
  return (
    <CellWithChanged changed={dirty}>
      <TextWithChanged small italic changed={dirty}>
        DCA Into:
      </TextWithChanged>
      <OutsSelectionAndWeights />
    </CellWithChanged>
  )
}

export const PositionCard: React.FC = () => {
  return (
    <Card title="Position" mobilePadding="12px" padding="24px">
      <CellRow>
        <CellCol>
          <TokenInCell />
        </CellCol>
        <CellCol>
          {/* <IntervalCell /> */}
          <OptionsCell />
        </CellCol>
      </CellRow>
      <CellRow>
        <OutsCell />
      </CellRow>
    </Card>
  )
}
