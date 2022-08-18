import React, { useCallback, useMemo, useState } from 'react'
import { Flex, SummitButton, Text } from 'uikit'
import { usePositionConfigState } from './introStore'
import { TokenSelectButton } from 'components/TokenSelect/TokenSelectButton'
import { TokenButton } from 'components/TokenButton'
import { AddressRecord } from 'state/types'
import 'rc-slider/assets/index.css'
import styled from 'styled-components'
import { WeightsSlider } from './WeightsSlider'
import { SummitPopUp } from 'uikit/widgets/Popup'
import { PortfolioPresets } from './PortfolioPresets'

const OutsRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 12px;
`

// TODO: Add max slippage setting
const SelectedOutModal: React.FC<{
  token: string
  index: number
  onDismiss?: () => void
}> = ({ index, onDismiss }) => {
  const removeOut = usePositionConfigState((state) => state.removeOut)
  const handleRemove = useCallback(() => {
    removeOut(index)
    onDismiss()
  }, [removeOut, index, onDismiss])
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minWidth="300px"
    >
      <Text bold>Manage Token:</Text>
      <br />
      <SummitButton onClick={handleRemove} activeText="Remove" />
      <br />
      <SummitButton onClick={onDismiss} activeText="Close" />
    </Flex>
  )
}

const SelectedOutButton: React.FC<{ token: string; index: number }> = ({
  token,
  index,
}) => {
  const [open, setOpen] = useState(false)
  const hide = useCallback(() => setOpen(false), [setOpen])

  return (
    <SummitPopUp
      open={open}
      callOnDismiss={hide}
      modal
      button={<TokenButton token={token} noTokenString="Missing" />}
      popUpContent={<SelectedOutModal token={token} index={index} />}
    />
  )
}

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
          <SelectedOutButton
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
