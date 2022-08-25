import { Card } from 'components/Card'
import { OutTokenButton } from 'components/TokenSelect/OutTokenButton'
import { TokenSelectButton } from 'components/TokenSelect/TokenSelectButton'
import { WeightsSlider } from 'components/WeightsSlider'
import React, { useCallback, useMemo } from 'react'
import { useInvolicaStore } from 'state/store'
import { AddressRecord } from 'state/types'
import styled from 'styled-components'
import { RowStart, Text } from 'uikit'
import { usePositionConfigState } from 'views/Tutorial/steps/introStore'


const OutsRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 12px;
`

export const PositionCard: React.FC = () => {
  const positionTokenIn = useInvolicaStore((state) => state.userData?.position?.tokenIn)
  const positionOuts = useInvolicaStore((state) => state.userData?.position?.outs)
  console.log({
    positionTokenIn,
    positionOuts
  })
  const configTokenIn = usePositionConfigState((state) => state.tokenIn)
  const setConfigTokenIn = usePositionConfigState((state) => state.setTokenIn)
  const addOut = usePositionConfigState((state) => state.addOut)

  const inDisabledReasons = useMemo(() => {
    const reasons = {}
    ;(positionOuts ?? []).forEach((out) => {
      reasons[out.token] = 'Used as DCA out'
    })
    return reasons
  }, [positionOuts])

  const outDisabledReasons = useMemo(() => {
    const reasons: AddressRecord<string> = {}
    reasons[positionTokenIn] = 'DCA input token'
    ;(positionOuts ?? []).forEach((out) => {
      reasons[out.token] = 'Already added'
    })
    return reasons
  }, [positionOuts, positionTokenIn])

  const handleAddOutToken = useCallback(
    (address) => {
      addOut(address, 50, 10)
    },
    [addOut],
  )

  return (
    <Card title="Position">
      <RowStart>
        <TokenSelectButton
          token={positionTokenIn}
          setToken={setConfigTokenIn}
          noTokenString="Select"
          disabledTokens={inDisabledReasons}
          modalVariant="tokenIn"
        />
      </RowStart>
      <Text>v v v v v v v v v</Text>
      <OutsRow>
        {(positionOuts ?? []).map(({ token }, i) => (
          <OutTokenButton
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            token={token}
            index={i}
          />
        ))}
        {(positionOuts ?? []).length < 8 && (
          <TokenSelectButton
            token={null}
            setToken={handleAddOutToken}
            noTokenString="+ Add"
            disabledTokens={outDisabledReasons}
            modalVariant="tokenOut"
          />
        )}
      </OutsRow>
      <WeightsSlider />
    </Card>
  )
}
