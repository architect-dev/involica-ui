import React, { useCallback, useMemo, useState } from 'react'
import { StepContentWrapper } from './StepContentWrapper'
import { Flex, SummitButton, Text } from 'uikit'
import { IntroStep, useIntroActiveStep, usePositionConfigState } from './introStore'
import { TokenSelectButton } from 'components/TokenSelect/TokenSelectButton'
import { TokenButton } from 'components/TokenButton'
import { AddressRecord } from 'state/types'
import 'rc-slider/assets/index.css'
import styled from 'styled-components'
import { WeightsSlider } from './WeightsSlider'
import { SummitPopUp } from 'uikit/widgets/Popup'

const OutsRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 12px;
  max-width: 450px;
`

const SelectedOutModal: React.FC<{ token: string, index: number, onDismiss?: () => void }> = ({ index, onDismiss }) => {
  const removeOut = usePositionConfigState((state) => state.removeOut)
  const handleRemove = useCallback(
    () => {
      removeOut(index)
      onDismiss()
    },
    [removeOut, index, onDismiss]
  )
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
      <SummitButton onClick={onDismiss} activeText="Close" />
    </Flex>
  )
}

const SelectedOutButton: React.FC<{ token: string, index: number }>= ({ token, index }) => {
  const [open, setOpen] = useState(false)
  const hide = useCallback(() => setOpen(false), [setOpen])
  
  return (
      <SummitPopUp
        open={open}
        callOnDismiss={hide}
        modal
        button={
          <TokenButton
            token={token}
            onClick={console.log}
            noTokenString="Missing"
          />
        }
        popUpContent={
          <SelectedOutModal
            token={token}
            index={index}
          />
        }
      />
  )
}

export const SelectOuts: React.FC = () => {
  const introStep = useIntroActiveStep()
  const expanded = introStep >= IntroStep.Outs
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
    <StepContentWrapper expanded={expanded}>
      <Text small>
        Build a portfolio by adding tokens to swap into each DCA.
        <br />
        <br />
        <i>Add portfolio tokens:</i>
      </Text>
      <OutsRow>
        {outs.map(({ token, weight, maxSlippage }, i) => (
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
        Choose what percent of your DCA amount goes into each token.
      </Text>
      <WeightsSlider/>
    </StepContentWrapper>
  )
}
