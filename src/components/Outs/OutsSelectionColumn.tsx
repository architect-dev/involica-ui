import { TokenSelectButton } from 'components/TokenSelect/TokenSelectButton'
import React, { ReactNode, useCallback, useMemo } from 'react'
import { usePositionTokenIn, useConfigurableOuts } from 'state/hooks'
import { AddressRecord, PositionOut } from 'state/types'
import { RowStart, Text, TextWithChanged } from 'uikit'
import styled from 'styled-components'
import { OutTokenButton } from './OutTokenButton'
import { chunk } from 'lodash'

const OutsColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 12px;
`
const WidthText = styled(TextWithChanged)<{ width: string }>`
  width: ${({ width }) => width};
  text-align: right;
`
const EmptyOut = styled.div`
  width: 100px;
  border: 1px dashed ${({ theme }) => theme.colors.text};
  height: 28px;
  border-radius: 28px;
`

export const OutAddOrEmpty: React.FC<{
  out: PositionOut | null
  i: number
  outsCount: number
  addButton: ReactNode
  weightChanged?: boolean
  tokenOrOptionsChanged?: boolean
}> = ({ out, i, outsCount, addButton, weightChanged, tokenOrOptionsChanged }) => {
  // ADD / EMPTY
  if (i >= outsCount)
    return (
      <>
        <WidthText bold width="25px" ml={i >= 4 ? '25px' : null}>
          {' '}
        </WidthText>
        {i > outsCount ? <EmptyOut /> : addButton}
      </>
    )

  // OUT
  return (
    <>
      <WidthText bold width="25px" ml={i >= 4 ? '25px' : null} changed={weightChanged} asterisk asteriskPosition='-10px -4px'>
        {out.weight}%
      </WidthText>
      <OutTokenButton token={out.token} index={i} changed={tokenOrOptionsChanged} />
    </>
  )
}

export const OutsSelectionColumn: React.FC = () => {
  const { tokenIn } = usePositionTokenIn()
  const { outs, addOut } = useConfigurableOuts()

  const disabledReasons = useMemo(() => {
    const reasons: AddressRecord<string> = {}
    reasons[tokenIn] = 'DCA input token'
    outs.forEach((out) => {
      reasons[out.token] = 'Already added'
    })
    return reasons
  }, [outs, tokenIn])

  const handleAddOutToken = useCallback(
    (address) => {
      addOut(address, 50, 10)
    },
    [addOut],
  )

  const chunkedOuts = useMemo(() => chunk(outs, 4), [outs])

  const addButton = useMemo(
    () => (
      <TokenSelectButton
        token={null}
        setToken={handleAddOutToken}
        noTokenString="+ Add"
        selectedTokens={outs.map(({ token }) => token)}
        disabledTokens={disabledReasons}
        modalVariant="tokenOut"
      />
    ),
    [disabledReasons, handleAddOutToken, outs],
  )

  return (
    <OutsColumn>
      {[0, 1, 2, 3].map((i) => (
        <RowStart gap="6px" key={i}>
          <Text small>
            <pre>{'     >     '}</pre>
          </Text>
          <OutAddOrEmpty
            out={chunkedOuts[0] != null ? chunkedOuts[0][i] : null}
            i={i}
            outsCount={outs.length}
            addButton={addButton}
            weightChanged
            tokenOrOptionsChanged
          />
          <OutAddOrEmpty
            out={chunkedOuts[1] != null ? chunkedOuts[1][i] : null}
            i={4 + i}
            outsCount={outs.length}
            addButton={addButton}
          />
        </RowStart>
      ))}
      {outs.length === 0 && (
        <RowStart gap="6px" mt="12px">
          <Text small>
            <pre>{'           '}</pre>
          </Text>
          <OutAddOrEmpty out={null} i={0} outsCount={outs.length} addButton={addButton} />
        </RowStart>
      )}
    </OutsColumn>
  )
}
