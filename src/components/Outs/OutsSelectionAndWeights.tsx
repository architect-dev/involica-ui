import { TokenSelectButton } from 'components/TokenSelect/TokenSelectButton'
import React, { useCallback, useMemo } from 'react'
import { usePositionTokenIn, useConfigurableOuts } from 'state/hooks'
import { AddressRecord } from 'state/types'
import { Text } from 'uikit'
import styled from 'styled-components'
import { OutTokenButton } from './OutTokenButton'
import { WeightsSlider } from './WeightsSlider'

const OutsRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 12px;
`

export const OutsSelectionAndWeights: React.FC<{ intro?: boolean }> = ({ intro = false }) => {
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
    <>
      <OutsRow>
        {outs.map(({ token }, i) => (
          <OutTokenButton
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            token={token}
            index={i}
          />
        ))}
        {outs.length < 8 && (
          <TokenSelectButton
            token={null}
            setToken={handleAddOutToken}
            noTokenString="+ Add"
            selectedTokens={outs.map(({ token }) => token)}
            disabledTokens={disabledReasons}
            modalVariant="tokenOut"
          />
        )}
      </OutsRow>
      {intro && (
        <Text small italic>
          <br />
          Use the slider to set your portfolio ratios.
        </Text>
      )}
      <WeightsSlider />
    </>
  )
}
