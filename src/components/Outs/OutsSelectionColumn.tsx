import { TokenSelectButton } from 'components/TokenSelect/TokenSelectButton'
import React, { useCallback, useMemo } from 'react'
import { usePositionTokenIn, useConfigurableOuts } from 'state/hooks'
import { AddressRecord } from 'state/types'
import { RowStart, Text } from 'uikit'
import styled from 'styled-components'
import { OutTokenButton } from './OutTokenButton'

const OutsColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 12px;
`
const WidthText = styled(Text)<{ width: string }>`
  width: ${({ width }) => width};
`

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

  return (
    <OutsColumn>
      {outs.map(({ token, weight }, i) => (
        <RowStart gap="6px">
          <Text small>
            <pre>{'     >     '}</pre>
          </Text>
          <WidthText bold width="25px">
            {weight}%
          </WidthText>
          <OutTokenButton key={token} token={token} index={i} />
        </RowStart>
      ))}
      {outs.length < 8 && (
        <RowStart gap="6px" mt='12px'>
        <Text small>
          <pre>{'           '}</pre>
        </Text>
        <WidthText bold width="25px">
          {' '}
        </WidthText>
        <TokenSelectButton
          token={null}
          setToken={handleAddOutToken}
          noTokenString="+ Add"
          selectedTokens={outs.map(({ token }) => token)}
          disabledTokens={disabledReasons}
          modalVariant="tokenOut"
        />
        </RowStart>
      )}
    </OutsColumn>
  )
}
