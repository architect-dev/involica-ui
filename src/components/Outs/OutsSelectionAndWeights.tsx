import { TokenSelectButton } from 'components/TokenSelect/TokenSelectButton'
import React, { useCallback, useMemo } from 'react'
import { usePositionTokenIn, useConfigurableOuts, usePositionOutsDirtyData } from 'state/hooks'
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
const EmptyOut = styled.div`
  width: 100px;
  border: 1px dashed ${({ theme }) => theme.colors.text};
  height: 28px;
  border-radius: 28px;
`

export const OutsSelectionAndWeights: React.FC<{ intro?: boolean }> = ({ intro = false }) => {
  const { tokenIn } = usePositionTokenIn()
  const { outs, addOut } = useConfigurableOuts()
  const dirtyData = usePositionOutsDirtyData(intro)

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
          <OutTokenButton key={token} token={token} changed={dirtyData != null && dirtyData[i].slippage} />
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
        {outs.length < 7 &&
          [...new Array(7 - outs.length)].map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <EmptyOut key={i} />
          ))}
      </OutsRow>
      {outs.length === 0 && (
          <Text red italic>
            Must have at least one DCA out
          </Text>
        )}
      {intro && (
        <Text small italic>
          <br />
          Use the slider to set your portfolio ratios.
        </Text>
      )}
      <WeightsSlider intro={intro} />
    </>
  )
}
