import React, { useMemo } from 'react'
import { Card } from 'components/Card'
import styled from 'styled-components'
import { Column, RowBetween, Text, RowCenter, SummitButton, TextButton, TextWithChanged } from 'uikit'
import TokenAndAmountSelector from 'components/TokenAndAmountSelector'
import {
  useConfigurableAmountDCA,
  useConfigurableTokenIn,
  usePositionIntervalDCA,
  usePositionMaxGasPrice,
  usePositionOuts,
  useRevertIntervalAndMaxGasPrice,
  useRevertOuts,
  useRevertTokenAndAmount,
} from 'state/hooks'
import { IntervalSelector } from 'components/IntervalSelector'
import { CellCol, CellWithChanged } from './styles'
import { EditMaxGasPriceButton } from 'components/EditMaxGasPriceModal'
import { suffix, useIntervalStrings } from 'state/uiHooks'
import { OutsSelectionAndWeights } from 'components/Outs/OutsSelectionAndWeights'
import { RotateCcw } from 'react-feather'
import { getSymbol } from 'config/tokens'
import { ManagePositionButton } from 'components/ManagePositionModal'
import { useSetPosition } from 'hooks/useExecute'

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

const StyledTextButton = styled(TextButton)`
  position: absolute;
  top: 6px;
  right: 14px;
  padding: 0;
`

const RevertChangesButton: React.FC<{ onClick }> = ({ onClick }) => {
  return (
    <StyledTextButton onClick={onClick}>
      <RotateCcw size={14} />
    </StyledTextButton>
  )
}

const TokenInCell: React.FC = () => {
  const { dirty: tokenInDirty, tokenIn, setTokenIn } = useConfigurableTokenIn()
  const { outs } = usePositionOuts()
  const { dirty: amountDCADirty, amountDCA, setAmountDCA } = useConfigurableAmountDCA()
  const revertTokenAndAmount = useRevertTokenAndAmount()

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
        DCA Token and DCA Amount:
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

      {(tokenInDirty || amountDCADirty) && <RevertChangesButton onClick={revertTokenAndAmount} />}
    </CellWithChanged>
  )
}

const OptionsCell: React.FC = () => {
  const { dirty: intervalDirty } = usePositionIntervalDCA()
  const { dirty: maxGasPriceDirty } = usePositionMaxGasPrice()
  const { intervalStringly } = useIntervalStrings()
  const revertIntervalAndMaxGasPrice = useRevertIntervalAndMaxGasPrice()

  return (
    <CellWithChanged changed={intervalDirty || maxGasPriceDirty}>
      <TextWithChanged small italic changed={intervalDirty || maxGasPriceDirty}>
        DCA Options:
      </TextWithChanged>
      <Column width="100%" gap="4px">
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

      {(intervalDirty || maxGasPriceDirty) && <RevertChangesButton onClick={revertIntervalAndMaxGasPrice} />}
    </CellWithChanged>
  )
}

const OutsCell: React.FC = () => {
  const { dirty } = usePositionOuts()
  const revertOuts = useRevertOuts()
  return (
    <CellWithChanged changed={dirty}>
      <TextWithChanged small italic changed={dirty}>
        DCA Portfolio: (Select up to 8 tokens)
      </TextWithChanged>
      <OutsSelectionAndWeights />

      {dirty && <RevertChangesButton onClick={revertOuts} />}
    </CellWithChanged>
  )
}

const ActionsCell: React.FC = () => {
  const { dirty: tokenInDirty, current: tokenInCurrent, tokenIn: tokenInPending } = useConfigurableTokenIn()
  const { dirty: outsDirty } = usePositionOuts()
  const { dirty: intervalDirty, current: intervalCurrent, intervalDCA: intervalPending } = usePositionIntervalDCA()
  const {
    dirty: maxGasPriceDirty,
    current: maxGasPriceCurrent,
    maxGasPrice: maxGasPricePending,
  } = usePositionMaxGasPrice()
  const { dirty: amountDCADirty, current: dcaAmountCurrent, amountDCA: dcaAmountPending } = useConfigurableAmountDCA()

  const anyDirty = useMemo(() => outsDirty || intervalDirty || maxGasPriceDirty || tokenInDirty || amountDCADirty, [
    outsDirty,
    intervalDirty,
    maxGasPriceDirty,
    tokenInDirty,
    amountDCADirty,
  ])

  const { onSetPosition, pending } = useSetPosition()

  return (
    <Column width="100%" gap="18px" alignItems="center">
      <RowCenter gap="18px">
        <ManagePositionButton />
        <SummitButton
          disabled={!anyDirty}
          onClick={onSetPosition}
          isLoading={pending}
          activeText="Update Position"
          loadingText="Updating"
        />
      </RowCenter>
      {anyDirty && (
        <Column width="100%" alignItems="center">
          <Text bold color="warning" mb="8px">
            Pending Changes:
          </Text>
          {tokenInDirty && (
            <Text italic small>
              Token In: <s>{getSymbol(tokenInCurrent)}</s> {'>'} <b>{getSymbol(tokenInPending)}</b>
            </Text>
          )}
          {amountDCADirty && (
            <Text italic small>
              DCA Amount: <s>{dcaAmountCurrent}</s> {'>'} <b>{dcaAmountPending}</b>
            </Text>
          )}
          {intervalDirty && (
            <Text italic small>
              DCA Interval: every <s>{suffix(intervalCurrent)}</s> {'>'} <b>{suffix(intervalPending)}</b>
            </Text>
          )}
          {maxGasPriceDirty && (
            <Text italic small>
              Max Gas Price: <s>{maxGasPriceCurrent}</s> {'>'} <b>{maxGasPricePending}</b>
            </Text>
          )}
          {outsDirty && (
            <Text italic small>
              DCA Out tokens or weights
            </Text>
          )}
        </Column>
      )}
    </Column>
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
          <OptionsCell />
        </CellCol>
      </CellRow>
      <CellRow>
        <OutsCell />
      </CellRow>
      <CellRow>
        <ActionsCell />
      </CellRow>
    </Card>
  )
}
