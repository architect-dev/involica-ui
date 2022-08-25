import React, { useCallback, useMemo, useState } from 'react'
import { Flex, SummitButton, Text } from 'uikit'
import { usePositionConfigState } from './introStore'
import { TokenSelectButton } from 'components/TokenSelect/TokenSelectButton'
import { TokenButton } from 'components/TokenButton'
import { AddressRecord } from 'state/types'
import 'rc-slider/assets/index.css'
import styled from 'styled-components'
import { SummitPopUp } from 'uikit/widgets/Popup'
import { PortfolioPresets } from './PortfolioPresets'
import { WeightsSlider } from 'components/WeightsSlider'
import { OutTokenButton } from 'components/TokenSelect/OutTokenButton'

const OutsRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 12px;
`

export const SelectOuts: React.FC = () => {
  const tokenIn = usePositionConfigState((state) => state.tokenIn)
  const outs = usePositionConfigState((state) => state.outs)
  const addOut = usePositionConfigState((state) => state.addOut)

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
      <Text small mb="-12px">
        Build a portfolio by adding tokens to swap into each DCA.
        <br />
        <br />
        <i>Select a portfolio preset:</i>
      </Text>
      <PortfolioPresets />
      <Text mb="-12px">
        <i>- OR -</i>
        <br />
        <br />
        <i>Customize your tokens and weights:</i>
      </Text>
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
            disabledTokens={disabledReasons}
            modalVariant="tokenOut"
          />
        )}
      </OutsRow>
      <Text small italic>
        <br />
        Use the slider to set your portfolio ratios.
      </Text>
      <WeightsSlider />
    </>
  )
}
